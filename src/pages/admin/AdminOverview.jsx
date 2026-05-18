import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../config';
import { formatDate, formatTime } from '../../utils/dateUtils';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

const STATUS_COLOR = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const load = () => {
    fetch(`${API}/admin/dashboard`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => { setStats(d.stats); setRecentOrders(d.recentOrders || []); });
  };

  useEffect(() => {
    load();
  }, []);

  const handleNotifyWhatsApp = async (order) => {
    // 1. Trigger backend notify-preparing API (so it updates database status / logs)
    try {
      await fetch(`${API}/orders/${order.id}/notify-preparing`, {
        method: 'POST',
        headers: authHeader(),
      });
    } catch (err) {
      console.error('Failed to trigger backend notify:', err.message);
    }

    // 2. Open WhatsApp redirect to chat with prefilled message
    const cleanMobile = order.mobile.replace(/\D/g, '');
    const mobileWithCountry = cleanMobile.startsWith('91') || cleanMobile.length > 10
      ? cleanMobile
      : `91${cleanMobile}`;
    const text = encodeURIComponent(`Dear Customer, your order #${order.id} is preparing now at Vindhya Pickles & Foods. Thank you for choosing us!`);
    const waUrl = `https://wa.me/${mobileWithCountry}?text=${text}`;
    window.open(waUrl, '_blank');
  };

  if (!stats) return <div className="dash-loading-inline"><div className="dash-spinner" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Primary Metrics Row */}
      <div className="dash-stats">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#3b82f6' },
          { label: 'Customers', value: stats.totalCustomers, icon: '👥', color: '#10b981' },
          { label: 'Products', value: stats.totalProducts, icon: '🫙', color: '#f59e0b' },
          { label: 'Revenue', value: `₹${parseFloat(stats.revenue).toFixed(0)}`, icon: '💰', color: '#8b5cf6' },
        ].map((s, i) => (
          <motion.div key={i} className="dash-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="dash-stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
            <div className="dash-stat-value">{s.value}</div>
            <div className="dash-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Status Breakdown Row */}
      <div className="dash-section-title">Order Status Breakdown</div>
      <div className="dash-stats status-breakdown-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Pending', value: stats.pending, color: '#f59e0b', icon: '⏳' },
          { label: 'Confirmed', value: stats.confirmed, color: '#3b82f6', icon: '✓' },
          { label: 'Processing', value: stats.processing, color: '#8b5cf6', icon: '⚙️' },
          { label: 'Shipped', value: stats.shipped, color: '#06b6d4', icon: '🚚' },
          { label: 'Delivered', value: stats.delivered, color: '#10b981', icon: '🎉' },
        ].map((s, i) => (
          <div key={i} className="dash-stat-card" style={{ borderTop: `4px solid ${s.color}`, padding: '16px' }}>
            <div className="dash-stat-icon" style={{ background: s.color + '15', color: s.color, width: '40px', height: '40px', fontSize: '18px' }}>{s.icon}</div>
            <div className="dash-stat-value" style={{ fontSize: '20px', marginTop: '8px' }}>{s.value || 0}</div>
            <div className="dash-stat-label" style={{ fontSize: '12px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-section-title">Recent Orders</div>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.name || o.email?.split('@')[0] || '—'}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{o.email || '—'}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{o.mobile}</div>
                </td>
                <td>₹{parseFloat(o.total).toFixed(0)}</td>
                <td><span className="dash-badge" style={{ background: (STATUS_COLOR[o.status] || '#6b7280') + '20', color: STATUS_COLOR[o.status] || '#6b7280' }}>{o.status}</span></td>
                <td>
                  <div>{formatDate(o.created_at)}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{formatTime(o.created_at)}</div>
                </td>
                <td>
                  <button 
                    onClick={() => handleNotifyWhatsApp(o)}
                    className="dash-btn-ghost notify-wa-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: '#25D36620',
                      color: '#25D366',
                      border: '1px solid #25D36640',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#25D366';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#25D36620';
                      e.currentTarget.style.color = '#25D366';
                    }}
                  >
                    💬 Notify WhatsApp
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
