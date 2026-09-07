import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from './ui';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
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
      <div className="login-card card">
        <h3>Login</h3>
        
        {error && <div className="alert-error">{error}</div>}
        
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
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary auth-submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
