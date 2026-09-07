import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from './ui';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('HR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Must match backend rule: min 8 chars, upper + lower + digit
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and a digit');
      return;
    }
    
    setLoading(true);

    const result = await register(email, password, role);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="register-container">
      <aside className="auth-brand">
        <div className="auth-mono">TL</div>
        <div className="auth-name">TalentLens</div>
        <div className="auth-sub">AI Recruitment</div>
        <p className="auth-pos">Platform rekrutmen yang membantu tim HR menilai kandidat lebih cepat dan objektif.</p>
        <ul className="auth-trust">
          <li><Icon name="check" size={15} /> Screening CV konsisten berbasis skor</li>
          <li><Icon name="check" size={15} /> Data kandidat tersimpan aman dan terpusat</li>
          <li><Icon name="check" size={15} /> Alur rekrutmen terdokumentasi rapi</li>
        </ul>
      </aside>
      <div className="register-card card">
        <h3>Create Account</h3>
        
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-ok">Registration successful! Redirecting to login...</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              className="input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              className="input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength="8"
            />
            <small className="form-hint">Min 8 characters with uppercase, lowercase, and a digit</small>
          </div>
          
          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="input"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          
          <div className="field">
            <label htmlFor="role">Role</label>
            <select
              className="select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading || success} className="btn btn-primary auth-submit">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
