import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import candidateAPI from '../services/candidateAPI';
import { PageHeader, Icon } from '../components/ui';
import './UploadCV.css';

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

  const validateFile = (file) => {
    if (!file) {
      return 'Please select a file';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }

    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return 'Only PDF, DOCX, and TXT files are allowed';
    }

    if (!ALLOWED_TYPES.includes(file.type) && file.type !== '') {
      return 'Invalid file type';
    }

    return null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    setError('');
    setSuccess('');

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const result = await candidateAPI.uploadCV(file, (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      });

      setSuccess(`CV uploaded successfully! Candidate ID: ${result.candidate_id}`);
      setFile(null);
      setUploadProgress(0);

      // Redirect to candidate detail page after 2 seconds
      setTimeout(() => {
        navigate(`/candidates/${result.candidate_id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to upload CV');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <PageHeader
        eyebrow="Intake"
        title="Upload Candidate CV"
        sub="Upload a CV in PDF, DOCX, or TXT format (max 5MB)"
      />

      <div className="card upload-card">
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-ok">{success}</div>}

        <div
          className={`drop-zone${dragActive ? ' is-active' : ''}${file ? ' has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            accept=".pdf,.docx,.txt"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />

          {!file ? (
            <label htmlFor="file-input" className="drop-zone-label">
              <span className="dz-icon"><Icon name="upload" size={22} /></span>
              <p>Drag and drop your CV here</p>
              <p className="or-text">or</p>
              <button type="button" className="btn btn-ghost btn-sm">
                Select File
              </button>
            </label>
          ) : (
            <div className="file-info">
              <span className="dz-icon"><Icon name="doc" size={22} /></span>
              <p className="file-name mono">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setFile(null)}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {uploading && (
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="progress-text mono">{uploadProgress}% uploaded</p>
          </div>
        )}

        <button
          className="btn btn-primary btn-upload"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload CV'}
        </button>
      </div>
    </div>
  );
};

export default UploadCV;
