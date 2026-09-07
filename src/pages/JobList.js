import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobAPI from '../services/jobAPI';
import { PageHeader, EmptyState, Skeleton, StatusPill, SkillChips, Icon } from '../components/ui';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await jobAPI.getJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message || 'Failed to load job positions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await jobAPI.deleteJob(jobId);
      // Refresh the job list
      fetchJobs();
    } catch (err) {
      setError(err.message || 'Failed to delete job position');
    }
  };

  return (
    <div className="jl-wrap">
      <PageHeader
        eyebrow="Hiring"
        title="Job Positions"
        actions={
          <Link to="/jobs/new" className="btn btn-primary">
            <Icon name="plus" /> Create New Job
          </Link>
        }
      />

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <Skeleton lines={3} />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No job positions found."
          action={
            <Link to="/jobs/new" className="btn btn-primary">
              Create your first job position
            </Link>
          }
        />
      ) : (
        <div className="jl-grid">
          {jobs.map((job) => (
            <div key={job.id} className="card jl-card">
              <div className="jl-card-head">
                <h3>{job.title}</h3>
                <StatusPill status={job.is_active ? 'Active' : 'Inactive'} />
              </div>
              
              <p className="jl-desc">
                {job.description && job.description.length > 150
                  ? job.description.substring(0, 150) + '...'
                  : job.description || 'No description'}
              </p>
              
              <div className="jl-meta">
                <div className="jl-meta-row jl-skills">
                  <span className="jl-label">Required Skills:</span>
                  <SkillChips skills={job.required_skills || []} max={3} />
                </div>
                
                <div className="jl-meta-row">
                  <span className="jl-label">Min Experience:</span>
                  <span className="mono">
                    {job.min_experience_years || 0} years
                  </span>
                </div>
                
                <div className="jl-meta-row">
                  <span className="jl-label">Candidates:</span>
                  <span className="mono">
                    {job.candidate_count || 0}
                  </span>
                </div>
                
                <div className="jl-meta-row">
                  <span className="jl-label">Created:</span>
                  <span className="mono">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="jl-actions">
                <Link to={`/jobs/${job.id}`} className="btn btn-ghost btn-sm">
                  <Icon name="eye" /> View Details
                </Link>
                <Link to={`/jobs/${job.id}/edit`} className="btn btn-ghost btn-sm">
                  <Icon name="edit" /> Edit
                </Link>
                <button 
                  onClick={() => handleDeleteJob(job.id, job.title)} 
                  className="btn btn-danger-ghost btn-sm"
                >
                  <Icon name="trash" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
