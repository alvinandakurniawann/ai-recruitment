import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import candidateAPI from '../services/candidateAPI';
import { PageHeader, EmptyState, Skeleton, StatusPill, Avatar, SkillChips, Icon } from '../components/ui';
import './CandidateList.css';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 20;

  useEffect(() => {
    fetchCandidates();
  }, [page, statusFilter]);

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const data = await candidateAPI.getCandidates(params);
      setCandidates(data.candidates || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to delete "${candidateName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await candidateAPI.deleteCandidate(candidateId);
      // Refresh the candidate list
      fetchCandidates();
    } catch (err) {
      setError(err.message || 'Failed to delete candidate');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="candidate-list">
      <PageHeader
        eyebrow="Talent pool"
        title="Candidates"
        sub={`${total} profiles`}
        actions={
          <Link to="/upload" className="btn btn-primary">
            <Icon name="upload" /> Upload New CV
          </Link>
        }
      />

      <div className="filterbar">
        <label htmlFor="status-filter">Filter by Status:</label>
        <select
          id="status-filter"
          className="select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <Skeleton lines={6} />
      ) : candidates.length === 0 ? (
        <EmptyState
          title="No candidates found."
          action={
            <Link to="/upload" className="btn btn-primary">
              Upload your first CV
            </Link>
          }
        />
      ) : (
        <>
          <div className="tl-table-wrap">
            <table className="tl-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <span className="cand-name">
                        <Avatar name={candidate.name} />
                        <span className="row-main">{candidate.name || 'N/A'}</span>
                      </span>
                    </td>
                    <td>{candidate.email || 'N/A'}</td>
                    <td>
                      <SkillChips skills={candidate.skills || []} max={3} />
                    </td>
                    <td className="mono">{candidate.total_experience_years || 0} years</td>
                    <td><StatusPill status={candidate.status} /></td>
                    <td className="mono">
                      {candidate.created_at
                        ? new Date(candidate.created_at).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      <span className="tbl-actions">
                        <Link
                          to={`/candidates/${candidate.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          <Icon name="eye" /> View
                        </Link>
                        <button
                          onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}
                          className="btn btn-danger-ghost btn-sm"
                        >
                          <Icon name="trash" /> Delete
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pager">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn btn-ghost btn-sm"
              >
                Previous
              </button>
              <span className="info">
                Page {page} of {totalPages} ({total} total)
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn btn-ghost btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CandidateList;
