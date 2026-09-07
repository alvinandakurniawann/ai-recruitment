import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import jobAPI from '../services/jobAPI';
import { BackLink, StatusPill, Avatar, ScoreBar, Skeleton, EmptyState, Icon, matchTone } from '../components/ui';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [error, setError] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (job) {
      fetchCandidates();
    }
  }, [minScore, statusFilter]);

  const fetchJob = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await jobAPI.getJobById(id);
      setJob(data);
      fetchCandidates();
    } catch (err) {
      setError(err.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const data = await jobAPI.getJobCandidates(id, {
        min_score: minScore,
        status: statusFilter,
      });
      setCandidates(data.candidates || []);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await jobAPI.deleteJob(id);
      navigate('/jobs');
    } catch (err) {
      setError(err.message || 'Failed to delete job position');
    }
  };

  if (loading) {
    return (
      <div className="jd-wrap">
        <Skeleton lines={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="jd-wrap">
        <BackLink to="/jobs">Back to Jobs</BackLink>
        <div className="alert-error">{error}</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="jd-wrap">
        <EmptyState
          title="Job not found"
          action={<BackLink to="/jobs">Back to Jobs</BackLink>}
        />
      </div>
    );
  }

  return (
    <div className="jd-wrap">
      <div className="jd-topbar">
        <BackLink to="/jobs">Back to Jobs</BackLink>
        <div className="jd-top-actions">
          <Link to={`/jobs/${id}/edit`} className="btn btn-ghost btn-sm">
            <Icon name="edit" /> Edit Job
          </Link>
          <button onClick={handleDeleteJob} className="btn btn-danger-ghost btn-sm">
            <Icon name="trash" /> Delete Job
          </button>
        </div>
      </div>

      <div className="card jd-card">
        <div className="jd-head">
          <div>
            <h2>{job.title}</h2>
            <div className="jd-sub">
              <StatusPill status={job.is_active ? 'Active' : 'Inactive'} />
              <span className="mono">
                {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="jd-section">
          <h3>Description</h3>
          <p className="jd-desc">{job.description || 'No description provided'}</p>
        </div>

        <div className="jd-req-grid">
          <div className="jd-req">
            <h3>Required Skills</h3>
            <div>
              {job.required_skills && job.required_skills.length > 0 ? (
                job.required_skills.map((skill, index) => (
                  <span key={index} className="chip is-req">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="jd-muted">No required skills specified</p>
              )}
            </div>
          </div>

          <div className="jd-req">
            <h3>Preferred Skills</h3>
            <div>
              {job.preferred_skills && job.preferred_skills.length > 0 ? (
                job.preferred_skills.map((skill, index) => (
                  <span key={index} className="chip is-pref">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="jd-muted">No preferred skills specified</p>
              )}
            </div>
          </div>
        </div>

        <div className="jd-info">
          <div className="jd-info-item">
            <span className="jd-label">Minimum Experience:</span>
            <span className="jd-value">{job.min_experience_years || 0} years</span>
          </div>
          <div className="jd-info-item">
            <span className="jd-label">Education Level:</span>
            <span className="jd-value">{job.education_level || 'Not specified'}</span>
          </div>
          <div className="jd-info-item">
            <span className="jd-label">Created:</span>
            <span className="jd-value mono">
              {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="card jd-card">
        <h3 className="jd-cands-title">Matched Candidates</h3>
        
        <div className="filterbar">
          <div className="jd-filter">
            <label htmlFor="min-score">Minimum Score:</label>
            <input
              type="range"
              id="min-score"
              className="slider"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
            />
            <span className="mono">{minScore}</span>
          </div>
          
          <div className="jd-filter">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              className="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Qualified">Qualified</option>
              <option value="Potentially Qualified">Potentially Qualified</option>
              <option value="Not Qualified">Not Qualified</option>
            </select>
          </div>
        </div>

        {loadingCandidates ? (
          <div className="jd-muted">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className="empty">
            <p>No candidates match the current filters.</p>
          </div>
        ) : (
          <div className="jd-cands">
            {candidates.map((candidate, index) => (
              <div key={index} className="jd-cand" data-tone={matchTone(candidate.match_score, candidate.skill_match_score || candidate.skill_match)}>
                <div className="jd-cand-head">
                  <Avatar name={candidate.candidate_name} />
                  <div className="jd-cand-id">
                    <Link to={`/candidates/${candidate.candidate_id}`} className="jd-cand-name">
                      {candidate.candidate_name || 'Unknown'}
                    </Link>
                    <StatusPill status={candidate.status} />
                  </div>
                  <div className="jd-cand-score">
                    <ScoreBar value={candidate.match_score} />
                  </div>
                </div>
                
                <div className="jd-break">
                  <div className="jd-break-item">
                    <span className="jd-label">Skills:</span>
                    <ScoreBar value={candidate.skill_match_score || candidate.skill_match || 0} />
                  </div>
                  <div className="jd-break-item">
                    <span className="jd-label">Experience:</span>
                    <ScoreBar value={candidate.experience_match_score || candidate.experience_match || 0} />
                  </div>
                  <div className="jd-break-item">
                    <span className="jd-label">Education:</span>
                    <ScoreBar value={candidate.education_match_score || candidate.education_match || 0} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
