import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiArrowRight, FiUser, FiLock, FiCheckCircle } from 'react-icons/fi';
import logo from '../assets/logo3.png';
import './Login.css';

import API from '../config';

export default function CustomerLogin() {
  // mode can be: 'login', 'signup-email', 'signup-otp', 'signup-details'
  const [mode, setMode] = useState('login'); 
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('customerToken', data.token);
      localStorage.setItem('customerData', JSON.stringify({ email: data.email, mobile: data.mobile, name: data.name }));
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!form.email) return setError('Email is required');

    setLoading(true);
    try {
      const res = await fetch(`${API}/customer/signup/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setSuccess('OTP sent successfully to your email.');
      setMode('signup-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/customer/signup/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      
      setSuccess('Email verified! Please complete your profile.');
      setMode('signup-details');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/customer/signup/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          mobile: form.mobile,
          password: form.password
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete registration');
      
      localStorage.setItem('customerToken', data.token);
      localStorage.setItem('customerData', JSON.stringify({ email: data.email, mobile: form.mobile, name: data.name }));
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-gradient" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="login-particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="login-container">
        <motion.div className="login-card"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}>

          <div className="login-brand">
            <div className="login-logo">
              <img src={logo} alt="Vindhya Pickles" className="login-logo-img" />
            </div>
            <div className="login-brand-name">VINDHYA PICKLES</div>
            <div className="login-brand-sub">& Foods</div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <h2 className="login-title">Welcome Back!</h2>
                <p className="login-subtitle">Sign in to your account</p>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}

                <form onSubmit={handleLogin} className="login-form">
                  <div className="input-group">
                    <FiMail className="input-icon" />
                    <input type="email" name="email" placeholder="Email Address" required
                      value={form.email} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <FiLock className="input-icon" />
                    <input type="password" name="password" placeholder="Password" required
                      value={form.password} onChange={handleInputChange} />
                  </div>
                  <div className="forgot-link">
                    <a href="#forgot">Forgot Password?</a>
                  </div>
                  <button type="submit" className="login-btn" disabled={loading}>
                    <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                    <FiArrowRight />
                  </button>
                </form>

                <div className="auth-switch">
                  Don't have an account? <button type="button" onClick={() => switchMode('signup-email')}>Sign Up</button>
                </div>
              </motion.div>
            )}

            {mode === 'signup-email' && (
              <motion.div key="signup-email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="login-title">Create Account</h2>
                <p className="login-subtitle">Step 1: Verify your email address</p>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSendOTP} className="login-form">
                  <div className="input-group">
                    <FiMail className="input-icon" />
                    <input type="email" name="email" placeholder="Email Address" required
                      value={form.email} onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="login-btn" disabled={loading}>
                    <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
                    <FiArrowRight />
                  </button>
                </form>

                <div className="auth-switch">
                  Already have an account? <button type="button" onClick={() => switchMode('login')}>Sign In</button>
                </div>
              </motion.div>
            )}

            {mode === 'signup-otp' && (
              <motion.div key="signup-otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="login-title">Verify OTP</h2>
                <p className="login-subtitle">Step 2: Enter the 6-digit code sent to {form.email}</p>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}

                <form onSubmit={handleVerifyOTP} className="login-form">
                  <div className="input-group otp-group">
                    <input type="text" name="otp" placeholder="Enter 6-digit OTP" maxLength="6" required
                      value={form.otp} onChange={handleInputChange} style={{ textAlign: 'center', letterSpacing: '8px', paddingLeft: '16px' }} />
                  </div>
                  <button type="submit" className="login-btn" disabled={loading}>
                    <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
                    <FiArrowRight />
                  </button>
                </form>

                <div className="auth-switch">
                  <button type="button" onClick={() => switchMode('signup-email')}>← Change Email</button>
                </div>
              </motion.div>
            )}

            {mode === 'signup-details' && (
              <motion.div key="signup-details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="login-title">Complete Profile</h2>
                <p className="login-subtitle">Step 3: Almost there! Fill in your details</p>

                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}

                <form onSubmit={handleCompleteSignup} className="login-form">
                  <div className="input-group">
                    <FiUser className="input-icon" />
                    <input type="text" name="name" placeholder="Full Name" required
                      value={form.name} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <FiPhone className="input-icon" />
                    <input type="tel" name="mobile" placeholder="Mobile Number" required
                      value={form.mobile} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <FiLock className="input-icon" />
                    <input type="password" name="password" placeholder="Create Password" required
                      value={form.password} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <FiCheckCircle className="input-icon" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required
                      value={form.confirmPassword} onChange={handleInputChange} />
                  </div>
                  <button type="submit" className="login-btn" disabled={loading}>
                    <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                    <FiArrowRight />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="login-footer-links">
            <Link to="/">← Back to Home</Link>
            <Link to="/admin">Admin Login</Link>
          </div>
        </motion.div>

        <motion.div className="login-side"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="login-side-content">
            <div className="side-emoji">🫙</div>
            <h3>Authentic Andhra Pickles</h3>
            <p>Join us to track your orders, save favorites, and enjoy exclusive member discounts!</p>
            <div className="side-benefits">
              <div className="benefit">✅ Track your orders in real-time</div>
              <div className="benefit">✅ Exclusive member discounts</div>
              <div className="benefit">✅ Save your favorite products</div>
              <div className="benefit">✅ Easy reorder with one click</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
