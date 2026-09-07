import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './ui';
import './Navbar.css';

const SECTIONS = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: 'grid', match: ['/dashboard'] }],
  },
  {
    label: 'Recruitment',
    items: [
      { to: '/candidates', label: 'Candidates', icon: 'users', match: ['/candidates'] },
      { to: '/jobs', label: 'Jobs', icon: 'briefcase', match: ['/jobs'] },
      { to: '/upload', label: 'Upload CV', icon: 'upload', match: ['/upload'] },
    ],
  },
];

const Navbar = () => {
  const location = useLocation();

  const isActive = (match) =>
    match.some(
      (path) => location.pathname === path || location.pathname.startsWith(path + '/')
    );

  return (
    <nav className="sidebar" aria-label="Primary">
      <Link to="/dashboard" className="brand">
        <span className="brand-mark" aria-hidden="true">TL</span>
        <span className="brand-text">
          <span className="brand-name">TalentLens</span>
          <span className="brand-sub">AI Recruitment</span>
        </span>
      </Link>

      <div className="side-sections">
        {SECTIONS.map((section) => (
          <div className="side-section" key={section.label}>
            <div className="side-label">{section.label}</div>
            {section.items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`side-link ${isActive(item.match) ? 'active' : ''}`}
                aria-current={isActive(item.match) ? 'page' : undefined}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="side-foot">
        <span className="side-version">v0.1.0 · internal</span>
      </div>
    </nav>
  );
};

export default Navbar;
