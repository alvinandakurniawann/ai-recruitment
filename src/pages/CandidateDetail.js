import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import candidateAPI from '../services/candidateAPI';
import { BackLink, StatusPill, Avatar, SkillChips, ScoreBar, Skeleton, Icon, matchTone } from '../components/ui';
import './CandidateDetail.css';

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await candidateAPI.getCandidateById(id);
      setCandidate(data);

      // Fetch matches if candidate is completed
      if (data.status === 'completed') {
        fetchMatches();
      }
    } catch (err) {
      setError(err.message || 'Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await candidateAPI.getCandidateMatches(id);
      setMatches(data.matches || []);
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!window.confirm(`Are you sure you want to delete "${candidate.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await candidateAPI.deleteCandidate(id);
      navigate('/candidates');
    } catch (err) {
      setError(err.message || 'Failed to delete candidate');
    }
  };

  if (loading) {
    return (
      <div className="candidate-detail">
        <Skeleton lines={6} />
        <p className="muted-text">Loading candidate details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-detail">
        <div className="card error-card">
          <div className="alert-error">{error}</div>
          <BackLink to="/candidates">Back to Candidates</BackLink>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="candidate-detail">
        <div className="card error-card">
          <p>Candidate not found</p>
          <BackLink to="/candidates">Back to Candidates</BackLink>
        </div>
      </div>
    );
  }

  const scoredSkills = (candidate.skills || []).filter(
    (skill) => typeof skill === 'object' && skill.score
  );

  return (
    <div className="candidate-detail">
      <div className="cd-topbar">
        <BackLink to="/candidates">Back to Candidates</BackLink>
        <div className="header-actions">
          <button onClick={handleDeleteCandidate} className="btn btn-danger-ghost btn-sm">
            <Icon name="trash" /> Delete Candidate
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Personal Information */}
        <div className="card detail-card">
          <h3>Personal Information</h3>
          <div className="profile-head">
            <Avatar name={candidate.name} size={64} />
            <div className="profile-id">
              <div className="profile-name">{candidate.name || 'N/A'}</div>
              <StatusPill status={candidate.status} />
            </div>
          </div>
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span className="info-value">{candidate.name || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value mono">{candidate.email || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone:</span>
            <span className="info-value mono">{candidate.phone || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Experience:</span>
            <span className="info-value">
              {candidate.total_experience_years || 0} years
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Status:</span>
            <StatusPill status={candidate.status} />
          </div>
        </div>

        {/* Education */}
        <div className="card detail-card">
          <h3>Education</h3>
          {candidate.education && candidate.education.length > 0 ? (
            <div className="edu-list">
              {candidate.education.map((edu, index) => (
                <div key={index} className="edu-item">
                  <div className="edu-institution">
                    {edu.institution || 'Institution'}
                  </div>
                  <div className="edu-degree">{edu.degree || 'Degree'}</div>
                  {edu.field && <div className="edu-field">{edu.field}</div>}
                  {edu.year && (
                    <div className="edu-year mono">Year: {edu.year}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-text">No education information available</p>
          )}
        </div>

        {/* Skills */}
        <div className="card detail-card full-width">
          <h3>Skills</h3>
          {candidate.skills && candidate.skills.length > 0 ? (
            <>
              <SkillChips skills={candidate.skills} max={candidate.skills.length} />
              {scoredSkills.length > 0 && (
                <div className="skill-scores">
                  {scoredSkills.map((skill, index) => (
                    <div key={index} className="skill-score-row">
                      <span className="skill-score-name">
                        {skill.name}
                        {skill.category && (
                          <span className="skill-score-cat"> — {skill.category}</span>
                        )}
                      </span>
                      <ScoreBar value={skill.score} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="no-data-text">No skills information available</p>
          )}
        </div>

        {/* Work Experience */}
        <div className="card detail-card full-width">
          <h3>Work Experience</h3>
          {candidate.experience && candidate.experience.length > 0 ? (
            <div className="exp-list">
              {candidate.experience.map((exp, index) => (
                <div key={index} className="exp-item">
                  <div className="exp-title">{exp.title || 'Position'}</div>
                  <div className="exp-company">{exp.company || 'Company'}</div>
                  {exp.duration && (
                    <div className="exp-duration mono">{exp.duration}</div>
                  )}
                  {exp.description && (
                    <div className="exp-description">{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-text">No work experience information available</p>
          )}
        </div>

        {/* Certifications */}
        {candidate.certifications && candidate.certifications.length > 0 && (
          <div className="card detail-card full-width">
            <h3>Certifications</h3>
            <div className="cert-list">
              {candidate.certifications.map((cert, index) => (
                <span key={index} className="chip">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Job Matches */}
        <div className="card detail-card full-width">
          <h3>Job Position Matches</h3>
          {loadingMatches ? (
            <p className="loading-text">Loading matches...</p>
          ) : matches.length > 0 ? (
            <div className="matches-list">
              {matches.map((match, index) => (
                <div key={index} className="match-item" data-tone={matchTone(match.match_score, match.skill_match)}>
                  <div className="match-header">
                    <Link to={`/jobs/${match.job_id}`} className="match-title">
                      {match.job_title}
                    </Link>
                    <StatusPill status={match.status} />
                  </div>
                  <div className="match-overall">
                    <span className="score-label">Overall</span>
                    <ScoreBar value={match.match_score} />
                  </div>
                  <div className="match-scores">
                    <div className="match-score">
                      <span className="score-label">Skills</span>
                      <ScoreBar value={match.skill_match} />
                    </div>
                    <div className="match-score">
                      <span className="score-label">Experience</span>
                      <ScoreBar value={match.experience_match} />
                    </div>
                    <div className="match-score">
                      <span className="score-label">Education</span>
                      <ScoreBar value={match.education_match} />
                    </div>
                  </div>
                  {match.screening_notes && (
                    <p className="match-notes">
                      <span className="score-label">Why</span>
                      <span>
                        {String(match.screening_notes).split('\n').filter(Boolean).slice(0, 2).join(' — ')}
                      </span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-text">
              No job matches available. Matches will be calculated automatically.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
