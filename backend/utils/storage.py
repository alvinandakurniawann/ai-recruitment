"""
Supabase Storage upload for original CV files (free tier: 1 GB).

Zero-cost design:
- No new dependencies (uses `requests`, already installed).
- No-op when SUPABASE_URL / SUPABASE_SERVICE_KEY are unset (local dev keeps
  working with local-only processing).
- Failures never block the upload endpoint; caller logs a warning instead.

Required env (production):
    SUPABASE_URL=https://<ref>.supabase.co
    SUPABASE_SERVICE_KEY=<service_role key>  (never the anon key, never commit)
    SUPABASE_CV_BUCKET=cvs                   (auto-created as public if missing)
"""

import os

import requests

_CONTENT_TYPES = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
}


def storage_enabled():
    """True only when Supabase Storage is fully configured."""
    return bool(os.environ.get('SUPABASE_URL') and os.environ.get('SUPABASE_SERVICE_KEY'))


def _bucket():
    return os.environ.get('SUPABASE_CV_BUCKET', 'cvs')


def _headers(extra=None):
    key = os.environ['SUPABASE_SERVICE_KEY']
    h = {'apikey': key, 'Authorization': f'Bearer {key}'}
    if extra:
        h.update(extra)
    return h


def ensure_bucket():
    """Create the CV bucket as public if it does not exist yet."""
    base = os.environ['SUPABASE_URL'].rstrip('/')
    bucket = _bucket()
    r = requests.post(
        f'{base}/storage/v1/bucket',
        headers=_headers({'Content-Type': 'application/json'}),
        json={'id': bucket, 'name': bucket, 'public': True},
        timeout=15,
    )
    # 409/duplicate = already exists, anything 2xx = created
    if r.status_code not in (200, 201, 409):
        raise RuntimeError(f'ensure bucket failed: {r.status_code} {r.text[:120]}')


def upload_cv_to_storage(data: bytes, dest_path: str, filename: str):
    """
    Upload original CV bytes to Supabase Storage.

    Returns the public URL string, or None when storage is not configured.
    Raises on upload failure (caller decides: warn-and-continue).
    """
    if not storage_enabled():
        return None
    ensure_bucket()
    base = os.environ['SUPABASE_URL'].rstrip('/')
    bucket = _bucket()
    ext = '.' + filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    r = requests.post(
        f'{base}/storage/v1/object/{bucket}/{dest_path}',
        headers=_headers({
            'Content-Type': _CONTENT_TYPES.get(ext, 'application/octet-stream'),
            'x-upsert': 'true',
        }),
        data=data,
        timeout=60,
    )
    if r.status_code not in (200, 201):
        raise RuntimeError(f'storage upload failed: {r.status_code} {r.text[:160]}')
    return f'{base}/storage/v1/object/public/{bucket}/{dest_path}'
