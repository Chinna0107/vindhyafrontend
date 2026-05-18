import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiUser, FiMenu, FiX, FiPhone, FiShoppingCart, FiTag,
  FiHome, FiShoppingBag, FiInfo, FiChevronDown, FiCoffee, FiLogOut
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo3.png';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);
  const userMenuRef = useRef(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem('customerData');
    if (stored) {
      try {
        setCustomer(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse customerData", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    setCustomer(null);
    setUserDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen && !userDropdownOpen) return;
    const handleOutside = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        menuBtnRef.current && !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [menuOpen, userDropdownOpen]);

  const productCategories = [
    { name: 'All Products', path: '/products', emoji: '🫙' },
    { name: 'Pickles', path: '/products?cat=pickles', emoji: '🥭' },
    { name: 'Podi', path: '/products?cat=podi\'s', emoji: '🌶️' },
    { name: 'Snacks', path: '/products?cat=snacks', emoji: '🥨' }
  ];

  return (
    <>
      <div className="promo-banner">
        <div className="promo-scroll">
          <div className="promo-content">
            <FiTag size={14} />
            <span>Use code <strong>GET10</strong> for 10% OFF on all orders!</span>
            <FiTag size={14} />
            <span>Use code <strong>GET10</strong> for 10% OFF on all orders!</span>
            <FiTag size={14} />
            <span>Use code <strong>GET10</strong> for 10% OFF on all orders!</span>
            <FiTag size={14} />
            <span>Use code <strong>GET10</strong> for 10% OFF on all orders!</span>
          </div>
        </div>
      </div>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><FiPhone size={12} /> +91 8142128079</span>
          <span>🌶️ Free delivery on orders above ₹499</span>
          <span>vindhyapicklesandfoods@gmail.com</span>
        </div>
      </div>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
        <Link to="/" className="logo">
            <img src={logo} alt="Vindhya Pickles Logo" className="logo-img" />
            <div className="logo-text">
              <span className="logo-main">VINDHYA PICKLES</span>
              <span className="logo-sub">& Foods</span>
            </div>
          </Link>

          <nav className="nav-desktop">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              <FiHome className="nav-icon" />
              <span className="nav-label">Home</span>
            </NavLink>
            
            <div 
              className="nav-dropdown-wrapper" 
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <FiShoppingBag className="nav-icon" />
                <span className="nav-label-wrapper">
                  Products <FiChevronDown className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
                </span>
              </NavLink>
              
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    className="nav-dropdown-menu"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                  >
                    {productCategories.map((cat, i) => (
                      <Link key={i} to={cat.path} className="dropdown-item">
                        <span className="dropdown-emoji">{cat.emoji}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/cook" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiCoffee className="nav-icon" />
              <span className="nav-label">Cook with Vindhya</span>
            </NavLink>

            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiInfo className="nav-icon" />
              <span className="nav-label">About Us</span>
            </NavLink>
            
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FiPhone className="nav-icon" />
              <span className="nav-label">Contact</span>
            </NavLink>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-btn">
              <FiShoppingCart size={18} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            {customer ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button 
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="btn-user-avatar"
                >
                  <div className="user-avatar-circle">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : (customer.email ? customer.email.charAt(0).toUpperCase() : 'U')}
                  </div>
                  <span className="user-avatar-name">{customer.name ? customer.name.split(' ')[0] : 'User'}</span>
                  <FiChevronDown className={`avatar-arrow ${userDropdownOpen ? 'open' : ''}`} size={14} />
                </button>
                
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div 
                      className="user-dropdown-menu"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="user-dropdown-header">
                        <span className="user-dropdown-name">{customer.name || 'Customer Account'}</span>
                        <span className="user-dropdown-email">{customer.email}</span>
                      </div>
                      <Link to="/orders" className="user-dropdown-item">
                        <FiShoppingBag className="dropdown-item-icon" /> My Orders
                      </Link>
                      <Link to="/profile" className="user-dropdown-item">
                        <FiUser className="dropdown-item-icon" /> Profile
                      </Link>
                      <div className="dropdown-menu-divider" />
                      <button onClick={handleLogout} className="user-dropdown-item logout">
                        <FiLogOut className="dropdown-item-icon" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-login">
                <FiUser size={16} />
                <span>Login</span>
              </Link>
            )}
            <button ref={menuBtnRef} className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div ref={menuRef} className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}>
            
            <NavLink to="/" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} end>
              <FiHome /> Home
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}>
              <FiShoppingBag /> Products
            </NavLink>
            <NavLink to="/cook" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}>
              <FiCoffee /> Cook with Vindhya
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}>
              <FiInfo /> About Us
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}>
              <FiPhone /> Contact
            </NavLink>

            <div className="mobile-menu-divider" />
            {customer ? (
              <>
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="mobile-user-details">
                    <span className="mobile-user-name">{customer.name || 'User'}</span>
                    <span className="mobile-user-email">{customer.email}</span>
                  </div>
                </div>
                <Link to="/orders" className="mobile-link">📦 My Orders</Link>
                <Link to="/profile" className="mobile-link">👤 Profile Settings</Link>
                <button onClick={handleLogout} className="mobile-link logout-btn-mobile">🚪 Logout</button>
              </>
            ) : (
              <Link to="/login" className="mobile-link login-mobile">👤 Customer Login</Link>
            )}
            <Link to="/admin" className="mobile-link admin-mobile">🔐 Admin Login</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
