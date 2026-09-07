import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import dashboardAPI from '../services/dashboardAPI';
import candidateAPI from '../services/candidateAPI';
import { Icon, PageHeader, EmptyState, Skeleton, StatusPill, Avatar, SkillChips, ScoreBar } from '../components/ui';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NAVY = '#4f46e5';
const NAVY_DEEP = '#4338ca';
const NAVY_FAINT = 'rgba(79, 70, 229, 0.12)';
const STOPLIGHT = ['#f43f5e', '#fb923c', '#facc15', '#34d399', '#059669'];

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleFont: { family: 'Inter', size: 12 },
      bodyFont: { family: 'IBM Plex Mono', size: 12 },
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: 'IBM Plex Mono', size: 11 }, color: '#64748b' },
    },
    y: {
      grid: { color: '#f1f5f9' },
      border: { display: false },
      ticks: { font: { family: 'IBM Plex Mono', size: 11 }, color: '#64748b', precision: 0 },
    },
  },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Chart.js mengukur label sekali saat mount; render ulang setelah
  // webfont tiba agar label sumbu tidak terpotong/overlap.
  useEffect(() => {
    let on = true;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { if (on) setFontsReady(true); });
    } else {
      setFontsReady(true);
    }
    return () => { on = false; };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsData, analyticsData, candidatesData] = await Promise.all([
        dashboardAPI.getStatistics(),
        dashboardAPI.getAnalytics(),
        candidateAPI.getCandidates({ page: 1, limit: 5 }),
      ]);

      setStats(statsData);
      setAnalytics(analyticsData);
      setRecentCandidates(candidatesData.candidates || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getSkillDistributionData = () => {
    if (!analytics?.skill_distribution) return null;

    const skills = Object.entries(analytics.skill_distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      labels: skills.map(([skill]) => skill),
      datasets: [
        {
          data: skills.map(([, count]) => count),
          backgroundColor: NAVY,
          hoverBackgroundColor: NAVY_DEEP,
          borderRadius: 4,
          barThickness: 14,
        },
      ],
    };
  };

  const getExperienceDistributionData = () => {
    if (!analytics?.experience_distribution) return null;

    const ranges = ['0-2 years', '3-5 years', '6-10 years', '11-15 years', '16+ years'];
    const data = ranges.map((range) => analytics.experience_distribution[range] || 0);

    return {
      labels: ranges,
      datasets: [
        {
          data,
          backgroundColor: NAVY_FAINT,
          hoverBackgroundColor: NAVY,
          borderColor: NAVY,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  };

  const getMatchScoreDistributionData = () => {
    if (!analytics?.match_score_distribution) return null;

    const ranges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
    const data = ranges.map((range) => analytics.match_score_distribution[range] || 0);

    return {
      labels: ranges,
      datasets: [
        {
          data,
          backgroundColor: STOPLIGHT,
          borderRadius: 4,
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Skeleton lines={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="empty">
          <h3>Dashboard unavailable</h3>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const total = stats?.total_candidates || 0;
  const qualified = stats?.qualified_candidates || 0;
  const qualRate = total > 0 ? Math.round((qualified / total) * 100) : 0;
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const kpis = [
    { icon: 'users', value: total, label: 'Total candidates', foot: `${qualified} qualified` },
    { icon: 'briefcase', value: stats?.total_jobs || 0, label: 'Active jobs', foot: 'open positions' },
    { icon: 'grid', value: stats?.avg_match_score ? Math.round(stats.avg_match_score) : 0, label: 'Avg match score', foot: 'across all matches', mono: true },
    { icon: 'check', value: `${qualRate}%`, label: 'Qualification rate', foot: 'share of pipeline', mono: true },
  ];

  return (
    <div className="dashboard-container">
      <PageHeader
        eyebrow="Overview"
        title="Hiring dashboard"
        sub={today}
        actions={
          <Link to="/upload" className="btn btn-primary">
            <Icon name="upload" /> Upload CV
          </Link>
        }
      />

      {/* Statistics Cards */}
      <div className="stats-grid">
        {kpis.map((kpi) => (
          <div className="stat-card" key={kpi.label}>
            <div className="stat-icon">
              <Icon name={kpi.icon} size={20} />
            </div>
            <div className="stat-content">
              <div className={`stat-value${kpi.mono ? ' mono' : ''}`}>{kpi.value}</div>
              <div className="stat-label">{kpi.label}</div>
              <div className="stat-foot">{kpi.foot}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="card chart-card">
          <div className="chart-head">
            <h3>Top skills in pipeline</h3>
            <span className="chart-note">by candidate count</span>
          </div>
          <div className="chart-container">
            {getSkillDistributionData() ? (
              <Bar
                key={'skills-' + fontsReady}
                data={getSkillDistributionData()}
                options={{ ...baseOptions, indexAxis: 'y' }}
              />
            ) : (
              <p className="no-data-text">No skill data available</p>
            )}
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-head">
            <h3>Experience mix</h3>
            <span className="chart-note">years of experience</span>
          </div>
          <div className="chart-container">
            {getExperienceDistributionData() ? (
              <Bar key={'exp-' + fontsReady} data={getExperienceDistributionData()} options={baseOptions} />
            ) : (
              <p className="no-data-text">No experience data available</p>
            )}
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-head">
            <h3>Match score bands</h3>
            <span className="chart-note">distribution of matches</span>
          </div>
          <div className="chart-container">
            {getMatchScoreDistributionData() ? (
              <Bar key={'match-' + fontsReady} data={getMatchScoreDistributionData()} options={baseOptions} />
            ) : (
              <p className="no-data-text">No match score data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Candidates */}
      <div className="card recent-candidates-card">
        <div className="card-header">
          <h3>Recent candidates</h3>
          <Link to="/candidates" className="view-all-link">
            View all
          </Link>
        </div>

        {recentCandidates.length > 0 ? (
          <div className="tl-table-wrap">
            <table className="tl-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Match</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <span className="cand-cell">
                        <Avatar name={candidate.name} />
                        <span>
                          <span className="row-main">{candidate.name || 'N/A'}</span>
                          <br />
                          <span className="row-sub">{candidate.email || 'N/A'}</span>
                        </span>
                      </span>
                    </td>
                    <td>
                      <SkillChips skills={candidate.skills} max={2} />
                    </td>
                    <td className="mono">
                      {candidate.total_experience_years || 0} yrs
                    </td>
                    <td>
                      <StatusPill status={candidate.status} />
                    </td>
                    <td>
                      {candidate.match_score != null ? (
                        <ScoreBar value={candidate.match_score} />
                      ) : (
                        <span style={{ color: 'var(--muted)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/candidates/${candidate.id}`} className="btn btn-ghost btn-sm">
                        <Icon name="eye" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No candidates yet"
            body="Upload the first CV to start building the pipeline."
            action={
              <Link to="/upload" className="btn btn-primary">
                <Icon name="upload" /> Upload CV
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
