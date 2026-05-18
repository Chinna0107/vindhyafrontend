import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiUser, FiLogOut, FiShoppingBag, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import './Dashboard.css';

import API from '../config';

const STATUS_ICON = {
  pending: <FiClock />, confirmed: <FiCheckCircle />, processing: <FiPackage />,
  shipped: <FiTruck />, delivered: <FiCheckCircle />, cancelled: <FiXCircle />,
};
const STATUS_COLOR = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

export default function CustomerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) return navigate('/login');
    fetch(`${API}/customer/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.error) navigate('/login'); else setData(d); })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    navigate('/login');
  };

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner" />
      <p>Loading your dashboard...</p>
    </div>
  );

  const { customer, orders } = data;
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + parseFloat(o.total || 0), 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const pending = orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length;

  return (
    <div className="dash-page">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="dash-brand-emoji">🫙</span>
          <div>
            <div className="dash-brand-name">Vindhya Pickles</div>
            <div className="dash-brand-sub">Customer Portal</div>
          </div>
        </div>

        <div className="dash-profile">
          <div className="dash-avatar">{(customer.name || customer.email)[0].toUpperCase()}</div>
          <div>
            <div className="dash-profile-name">{customer.name || 'Customer'}</div>
            <div className="dash-profile-email">{customer.email}</div>
          </div>
        </div>

        <nav className="dash-nav">
          {[
            { id: 'overview', icon: <FiShoppingBag />, label: 'Overview' },
            { id: 'orders', icon: <FiPackage />, label: 'My Orders' },
            { id: 'profile', icon: <FiUser />, label: 'Profile' },
          ].map(item => (
            <button key={item.id} className={`dash-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <Link to="/products" className="dash-nav-item">🛍️ Shop Now</Link>
          <button className="dash-nav-item logout" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        <div className="dash-topbar">
          <h1 className="dash-page-title">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'orders' && 'My Orders'}
            {activeTab === 'profile' && 'My Profile'}
          </h1>
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dash-stats">
              {[
                { label: 'Total Orders', value: orders.length, icon: '📦', color: '#3b82f6' },
                { label: 'Delivered', value: delivered, icon: '✅', color: '#10b981' },
                { label: 'Active Orders', value: pending, icon: '🚚', color: '#f59e0b' },
                { label: 'Total Spent', value: `₹${totalSpent.toFixed(0)}`, icon: '💰', color: '#8b5cf6' },
              ].map((s, i) => (
                <motion.div key={i} className="dash-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="dash-stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
                  <div className="dash-stat-value">{s.value}</div>
                  <div className="dash-stat-label">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="dash-section-title">Recent Orders</div>
            <div className="dash-orders-list">
              {orders.slice(0, 5).length === 0
                ? <div className="dash-empty">No orders yet. <Link to="/products">Start shopping!</Link></div>
                : orders.slice(0, 5).map(order => <OrderRow key={order.id} order={order} />)
              }
            </div>
          </motion.div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dash-orders-list">
              {orders.length === 0
                ? <div className="dash-empty">No orders yet. <Link to="/products">Start shopping!</Link></div>
                : orders.map(order => <OrderRow key={order.id} order={order} expanded />)
              }
            </div>
          </motion.div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <motion.div className="dash-profile-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dash-profile-avatar-lg">{(customer.name || customer.email)[0].toUpperCase()}</div>
            <div className="dash-profile-info">
              <div className="dash-info-row"><span>Name</span><strong>{customer.name || '—'}</strong></div>
              <div className="dash-info-row"><span>Email</span><strong>{customer.email}</strong></div>
              <div className="dash-info-row"><span>Mobile</span><strong>{customer.mobile}</strong></div>
              <div className="dash-info-row"><span>Member Since</span><strong>{new Date(customer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function OrderRow({ order, expanded }) {
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const color = STATUS_COLOR[order.status] || '#6b7280';
  return (
    <div className="dash-order-card">
      <div className="dash-order-header">
        <div>
          <span className="dash-order-id">Order #{order.id}</span>
          <span className="dash-order-date">{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
        </div>
        <span className="dash-order-status" style={{ background: color + '20', color }}>
          {STATUS_ICON[order.status]} {order.status}
        </span>
      </div>
      {expanded && (
        <div className="dash-order-items">
          {Array.isArray(items) && items.map((item, i) => (
            <div key={i} className="dash-order-item">
              <span>{item.emoji || '🫙'} {item.name}</span>
              <span>{item.selectedWeight} × {item.qty}</span>
            </div>
          ))}
        </div>
      )}
      <div className="dash-order-footer">
        <span>Total: <strong>₹{parseFloat(order.total).toFixed(0)}</strong></span>
        {order.coupon && <span className="dash-coupon">Coupon: {order.coupon}</span>}
      </div>
    </div>
  );
}
