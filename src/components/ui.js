import React from 'react';
import { Link } from 'react-router-dom';

/* Ikon SVG garis 1.8px konsisten — pengganti emoji di seluruh app. */
const PATHS = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" /><circle cx="17" cy="9" r="2.4" /><path d="M15.5 14.2c2.9.1 4.4 1.9 5 4.8" /></>,
  briefcase: <><rect x="3" y="7.5" width="18" height="12" rx="2" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18" /></>,
  upload: <><path d="M12 16V4m0 0l-4.5 4.5M12 4l4.5 4.5" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>,
  back: <><path d="M15 5l-7 7 7 7" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  x: <><path d="M6 6l12 12M18 6L6 18" /></>,
  check: <><path d="M4.5 12.5l5 5L19.5 7" /></>,
  alert: <><path d="M12 4L2.5 20h19L12 4z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.2" r="0.4" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></>,
  edit: <><path d="M4 20l1-4L16.5 4.5a1.4 1.4 0 0 1 2 2L7 18l-3 2z" /></>,
  trash: <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0l-.8 12a2 2 0 0 1-2 1.9H8.8a2 2 0 0 1-2-1.9L6 7" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
};

export const Icon = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    {PATHS[name] || null}
  </svg>
);

export const initials = (name) => {
  if (!name) return '–';
  const parts = String(name).trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')).toUpperCase().slice(0, 2) || '–';
};

export const Avatar = ({ name, size }) => (
  <span className="avatar" style={size ? { width: size, height: size } : undefined} aria-hidden="true">
    {initials(name)}
  </span>
);

/* Kepala halaman korporat: eyebrow + judul + sub + aksi */
export const PageHeader = ({ eyebrow, title, sub, actions }) => (
  <div className="page-head">
    <div>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      {sub && <div className="sub">{sub}</div>}
    </div>
    {actions && <div className="actions">{actions}</div>}
  </div>
);

export const EmptyState = ({ title, body, action }) => (
  <div className="empty">
    <h3>{title}</h3>
    {body && <p>{body}</p>}
    {action}
  </div>
);

export const Skeleton = ({ lines = 4 }) => (
  <div className="skel-page" aria-label="Loading">
    <div className="skel" style={{ height: 34, width: '38%' }} />
    <div className="skel" style={{ height: 120 }} />
    {Array.from({ length: lines }).map((_, i) => (
      <div className="skel" key={i} style={{ height: 18 }} />
    ))}
  </div>
);

/* Pil status terpusat — satu pemetaan untuk semua tabel */
const STATUS_TONE = {
  completed: 'ok', qualified: 'ok', active: 'ok',
  processing: 'warn', 'potentially qualified': 'warn',
  failed: 'bad', 'not qualified': 'bad', inactive: 'neutral',
};

export const StatusPill = ({ status }) => {
  const key = String(status || '').toLowerCase();
  const tone = STATUS_TONE[key] || 'info';
  return <span className={`pill pill-${tone}`}>{status}</span>;
};

export const SkillChips = ({ skills = [], max = 3 }) => {
  const names = skills.map((s) => (typeof s === 'object' ? s.name : s)).filter(Boolean);
  if (!names.length) return <span style={{ color: 'var(--muted)' }}>—</span>;
  return (
    <span>
      {names.slice(0, max).map((n, i) => (
        <span className="chip" key={i}>{n}</span>
      ))}
      {names.length > max && <span className="chip chip-more">+{names.length - max}</span>}
    </span>
  );
};

/* Ambang nada warna skor 0–100 — selaras dengan backend (Qualified≥70, Potentially≥50/40) */
export const scoreTone = (value = 0) => {
  const v = Math.max(0, Math.min(100, Math.round(value || 0)));
  return v >= 70 ? 'ok' : v >= 40 ? 'warn' : 'bad';
};

/* Nada kartu match — replika aturan 2D backend (overall + skill) agar selalu akur dengan pil status */
export const matchTone = (overall = 0, skill = 0) => {
  const o = Number(overall) || 0;
  const s = Number(skill) || 0;
  if (o >= 70 && s >= 60) return 'ok';
  if (o >= 50 || (o >= 40 && s >= 50)) return 'warn';
  return 'bad';
};

/* Bilah skor 0–100 dengan nada warna sesuai ambang + animasi fill saat mount */
export const ScoreBar = ({ value = 0 }) => {
  const v = Math.max(0, Math.min(100, Math.round(value || 0)));
  const tone = scoreTone(v);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const r = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <span className="scorebar" data-tone={tone} title={`${v}/100`}>
      <span className="track"><span className="fill" style={{ width: `${on ? v : 0}%` }} /></span>
      <span className="val">{v}</span>
    </span>
  );
};

export const BackLink = ({ to, children }) => (
  <Link to={to} className="btn btn-ghost btn-sm">
    <Icon name="back" /> {children}
  </Link>
);
