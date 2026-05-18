import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiExternalLink, FiMapPin } from 'react-icons/fi';
import API from '../../config';
import { formatDateTime } from '../../utils/dateUtils';

const STATUS_ICON = {
  pending: <FiClock />, confirmed: <FiCheckCircle />, processing: <FiPackage />,
  shipped: <FiTruck />, delivered: <FiCheckCircle />, cancelled: <FiXCircle />,
};
const STATUS_COLOR = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

export default function CustomerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(`${API}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="orders-page page-enter">
        <section className="cart-hero">
          <div className="cart-hero-bg" />
          <div className="container cart-hero-content">
            <div>
              <span className="cart-hero-tag">📦 My Orders</span>
              <h1>Your Orders</h1>
              <p>Loading your orders...</p>
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
    <div className="orders-page page-enter">
      {/* PAGE HERO */}
      <section className="cart-hero">
        <div className="cart-hero-bg" />
        <div className="container cart-hero-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="cart-hero-tag">📦 My Orders</span>
            <h1>Your Orders</h1>
            <p>Track your active shipments and view past orders</p>
          </motion.div>
        </div>
        <div className="cart-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '80px', marginTop: '40px', maxWidth: '800px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="dash-orders-list">
            {orders.length === 0
              ? <div className="dash-empty">No orders yet. <Link to="/products">Start shopping!</Link></div>
              : orders.map(order => {
                  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                  const color = STATUS_COLOR[order.status] || '#6b7280';
                  return (
                    <div key={order.id} className="dash-order-card">
                      <div className="dash-order-header">
                        <div>
                          <span className="dash-order-id">Order #{order.id}</span>
                          <span className="dash-order-date">{formatDateTime(order.created_at)}</span>
                        </div>
                        <span className="dash-order-status" style={{ background: color + '20', color }}>
                          {STATUS_ICON[order.status]} {order.status}
                        </span>
                      </div>
                      <div className="dash-order-items">
                        {Array.isArray(items) && items.map((item, i) => (
                          <div key={i} className="dash-order-item">
                            <span>{item.emoji || '🫙'} {item.name}</span>
                            <span>{item.selectedWeight} × {item.qty}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Tracking Information - Only show if not delivered and tracking exists */}
                      {(order.tracking_id || order.tracking_link) && order.status !== 'delivered' && (
                        <div className="dash-order-tracking">
                          <div className="tracking-header">
                            <FiTruck className="tracking-icon" />
                            <span className="tracking-title">Shipment Tracking</span>
                          </div>
                          <div className="tracking-content">
                            {order.tracking_id && (
                              <div className="tracking-id">
                                <span className="tracking-label">Tracking ID:</span>
                                <span className="tracking-value">{order.tracking_id}</span>
                              </div>
                            )}
                            {order.tracking_link && (
                              <a 
                                href={order.tracking_link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="tracking-button"
                              >
                                <FiExternalLink size={14} />
                                Track Package
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="dash-order-footer">
                        <div className="order-total">
                          <span>Total: <strong>₹{parseFloat(order.total).toFixed(0)}</strong></span>
                        </div>
                        <div className="order-details">
                          {order.address && (
                            <span className="order-address">
                              <FiMapPin size={12} /> {order.address}
                            </span>
                          )}
                          {order.coupon && <span className="dash-coupon">Coupon: {order.coupon}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        </motion.div>
      </div>
    </div>
  );
}
