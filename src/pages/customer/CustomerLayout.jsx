import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { FiShoppingBag, FiPackage, FiUser, FiLogOut, FiMenu, FiX, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo3.png';
import '../Dashboard.css';

const tabs = [
  { path: '/customer/dashboard', icon: <FiShoppingBag />, label: 'Overview', shortLabel: 'Home' },
  { path: '/customer/orders', icon: <FiPackage />, label: 'My Orders', shortLabel: 'Orders' },
  { path: '/customer/profile', icon: <FiUser />, label: 'Profile', shortLabel: 'Profile' },
];

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('customerToken')) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    navigate('/login');
  };

  const initial = (customerData.email || 'C')[0].toUpperCase();
  const currentTab = tabs.find(t => location.pathname === t.path);

  return (
    <div className="dash-page customer-dashboard">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-brand">
            <img src={logo} alt="Vindhya Pickles" className="mobile-logo" />
            <div className="mobile-brand-text">
              <span className="mobile-brand-name">Vindhya Pickles</span>
              <span className="mobile-brand-sub">Customer Portal</span>
            </div>
          </div>
          
          <div className="mobile-header-actions">
            <div className="mobile-profile">
              <div className="mobile-avatar">{initial}</div>
            </div>
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-profile">
                  <div className="mobile-menu-avatar">{initial}</div>
                  <div className="mobile-menu-info">
                    <div className="mobile-menu-name">{customerData.name || 'Customer'}</div>
                    <div className="mobile-menu-email">{customerData.email}</div>
                  </div>
                </div>
                <button 
                  className="mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <nav className="mobile-menu-nav">
                {tabs.map(t => (
                  <Link 
                    key={t.path} 
                    to={t.path}
                    className={`mobile-menu-item ${location.pathname === t.path ? 'active' : ''}`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </Link>
                ))}
                
                <Link to="/products" className="mobile-menu-item shop">
                  <FiHome />
                  <span>Shop Now</span>
                </Link>
                
                <button className="mobile-menu-item logout" onClick={logout}>
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="dash-sidebar desktop-sidebar">
        <div className="dash-brand">
          <div className="dash-brand-logo">
            <img src={logo} alt="Vindhya Pickles" className="dash-brand-logo-img" />
          </div>
          <div>
            <div className="dash-brand-name">Vindhya Pickles</div>
            <div className="dash-brand-sub">Customer Portal</div>
          </div>
        </div>

        <div className="dash-profile">
          <div className="dash-avatar">{initial}</div>
          <div>
            <div className="dash-profile-name">{customerData.name || 'Customer'}</div>
            <div className="dash-profile-email">{customerData.email}</div>
          </div>
        </div>

        <nav className="dash-nav">
          {tabs.map(t => (
            <Link key={t.path} to={t.path}
              className={`dash-nav-item ${location.pathname === t.path ? 'active' : ''}`}>
              {t.icon} {t.label}
            </Link>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <Link to="/products" className="dash-nav-item">🛍️ Shop Now</Link>
          <button className="dash-nav-item logout" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar desktop-topbar">
          <h1 className="dash-page-title">
            {currentTab?.label || 'Dashboard'}
          </h1>
        </div>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {tabs.map(t => (
          <Link 
            key={t.path} 
            to={t.path}
            className={`mobile-nav-item ${location.pathname === t.path ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon">{t.icon}</div>
            <span className="mobile-nav-label">{t.shortLabel}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
