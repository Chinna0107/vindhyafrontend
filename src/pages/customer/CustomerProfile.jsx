import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShoppingBag, FiTrendingUp, FiPackage, FiHeart, FiClock } from 'react-icons/fi';
import API from '../../config';
import { formatDate, formatTime, formatDateTime } from '../../utils/dateUtils';

const STATUS_COLOR = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
  const initial = (customerData.email || 'C')[0].toUpperCase();

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate('/login');
      return;
    }
    loadProfile(token);
  }, [navigate]);

  const loadProfile = async (token) => {
    try {
      const response = await fetch(`${API}/customer/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page page-enter">
        <section className="cart-hero">
          <div className="cart-hero-bg" />
          <div className="container cart-hero-content">
            <div>
              <span className="cart-hero-tag">👤 Profile</span>
              <h1>Your Profile</h1>
              <p>Loading your profile details...</p>
            </div>
          </div>
          <div className="cart-hero-wave">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
              <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--cream)" />
            </svg>
          </div>
        </section>
        <div className="container text-center" style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
          <div className="dash-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page page-enter">
      {/* PAGE HERO */}
      <section className="cart-hero">
        <div className="cart-hero-bg" />
        <div className="container cart-hero-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="cart-hero-tag">👤 Profile</span>
            <h1>Your Profile</h1>
            <p>Manage your account details and preferences</p>
          </motion.div>
        </div>
        <div className="cart-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px', maxWidth: '900px' }}>
        <motion.div 
          className="customer-profile-container"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">{initial}</div>
              <div className="profile-basic-info">
                <h2>Welcome Back!</h2>
                <p className="profile-email">
                  <FiMail size={16} />
                  {customerData.email}
                </p>
                <p className="profile-mobile">
                  <FiPhone size={16} />
                  {customerData.mobile}
                </p>
                {profile.firstOrderDate && (
                  <p className="profile-member-since">
                    <FiCalendar size={14} />
                    Customer since {new Date(profile.firstOrderDate).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* Customer Statistics */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon orders">
                <FiPackage size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{profile.totalOrders || 0}</div>
                <div className="stat-label">Total Orders</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon spent">
                <FiTrendingUp size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-number">₹{Math.round(profile.totalSpent || 0).toLocaleString('en-IN')}</div>
                <div className="stat-label">Total Spent</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon recent">
                <FiClock size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-number">
                  {profile.lastOrderDate 
                    ? formatDate(profile.lastOrderDate)
                    : 'N/A'
                  }
                </div>
                <div className="stat-label">Last Order</div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="profile-content">
            {/* Recent Address */}
            {profile.recentAddress && (
              <div className="profile-section">
                <div className="section-header">
                  <FiMapPin className="section-icon" />
                  <h3>Recent Delivery Address</h3>
                </div>
                
                <div className="recent-address">
                  {profile.recentAddress}
                </div>
              </div>
            )}

            {/* Favorite Items */}
            {profile.favoriteItems && profile.favoriteItems.length > 0 && (
              <div className="profile-section">
                <div className="section-header">
                  <FiHeart className="section-icon" />
                  <h3>Your Favorite Items</h3>
                </div>
                
                <div className="favorite-items">
                  {profile.favoriteItems.map((fav, index) => {
                    const [name, weight] = fav.item.split('-');
                    return (
                      <div key={index} className="favorite-item">
                        <div className="favorite-item-info">
                          <div className="favorite-item-name">{name}</div>
                          <div className="favorite-item-weight">{weight}</div>
                        </div>
                        <div className="favorite-item-count">
                          <span className="count-badge">{fav.count}</span>
                          <span className="count-label">orders</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Orders */}
            <div className="profile-section">
              <div className="section-header">
                <FiShoppingBag className="section-icon" />
                <h3>All Your Orders ({profile.totalOrders || 0})</h3>
              </div>
              
              {profile.orders && profile.orders.length > 0 ? (
                <div className="orders-list">
                  {profile.orders.map(order => {
                    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    const statusColor = STATUS_COLOR[order.status] || '#6b7280';
                    
                    return (
                      <div key={order.id} className="order-summary-card">
                        <div className="order-summary-header">
                          <div className="order-summary-id">Order #{order.id}</div>
                          <div className="order-summary-date">
                            {formatDateTime(order.created_at)}
                          </div>
                          <div 
                            className="order-summary-status"
                            style={{ background: statusColor + '20', color: statusColor }}
                          >
                            {order.status}
                          </div>
                        </div>
                        
                        <div className="order-summary-items">
                          {Array.isArray(items) && items.slice(0, 3).map((item, i) => (
                            <span key={i} className="order-summary-item">
                              {item.name} ({item.selectedWeight})
                            </span>
                          ))}
                          {Array.isArray(items) && items.length > 3 && (
                            <span className="order-summary-more">+{items.length - 3} more</span>
                          )}
                        </div>
                        
                        <div className="order-summary-footer">
                          <div className="order-summary-total">₹{Math.round(parseFloat(order.total))}</div>
                          {order.address && (
                            <div className="order-summary-address">
                              <FiMapPin size={12} />
                              {order.address.length > 50 ? order.address.substring(0, 50) + '...' : order.address}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-orders">
                  <FiShoppingBag size={48} />
                  <p>No orders found</p>
                  <p>Start shopping to see your orders here!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
