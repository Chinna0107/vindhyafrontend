import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiShield } from 'react-icons/fi';
import logo from '../assets/logo3.png';
import './Login.css';

import API from '../config';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify(data.admin));
      // Refresh the page after successful login
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page admin-login-page">
      <div className="login-bg">
        <div className="login-bg-gradient admin-gradient" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="login-particle admin-particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="login-container">
        <motion.div className="login-card admin-card"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}>

          <div className="login-brand">
            <div className="login-logo admin-logo">
              <img src={logo} alt="Vindhya Pickles" className="login-logo-img" />
            </div>
            <div className="login-brand-name">ADMIN PANEL</div>
            <div className="login-brand-sub">Vindhya Pickles & Foods</div>
          </div>

          <div className="admin-warning">
            <FiShield />
            <span>Restricted Access — Authorized Personnel Only</span>
          </div>

          <h2 className="login-title">Admin Sign In</h2>
          <p className="login-subtitle">Enter your credentials to access the dashboard</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <FiMail className="input-icon" />
              <input type="email" placeholder="Admin Email" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input type="password" placeholder="Admin Password" required
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="login-btn admin-btn" disabled={loading}>
              <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
              <FiArrowRight />
            </button>
          </form>

          <div className="admin-features">
            <div className="admin-feature">📦 Manage Orders</div>
            <div className="admin-feature">🛍️ Manage Products</div>
            <div className="admin-feature">👥 Customer Data</div>
            <div className="admin-feature">📊 Analytics</div>
          </div>

          <div className="login-footer-links">
            <Link to="/">← Back to Home</Link>
            <Link to="/login">Customer Login</Link>
          </div>
        </motion.div>

        <motion.div className="login-side admin-side"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="login-side-content">
            <div className="side-emoji">🛡️</div>
            <h3>Admin Dashboard</h3>
            <p>Manage your Vindhya Pickles business from one powerful dashboard.</p>
            <div className="side-benefits">
              <div className="benefit">📦 Manage all orders</div>
              <div className="benefit">🛍️ Add/edit products</div>
              <div className="benefit">👥 View customer data</div>
              <div className="benefit">📊 Sales analytics</div>
              <div className="benefit">🚚 Track deliveries</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
