import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import API from '../../config';
import { formatDate } from '../../utils/dateUtils';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/admin/customers`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => {
        setCustomers(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.mobile || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="admin-customers-page">
      {/* Search Bar */}
      <div className="reports-filter-bar" style={{ marginBottom: '20px' }}>
        <div className="reports-filter-group" style={{ width: '100%', maxWidth: '400px' }}>
          <FiSearch size={16} style={{ color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="reports-date-input"
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
          />
        </div>
        <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>
          {filtered.length} Customers found
        </div>
      </div>

      {loading ? (
        <div className="dash-loading-inline"><div className="dash-spinner" /></div>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Customer Details</th>
                <th>Join Date</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                    🔍 No customers matching your search criteria
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--accent-light, #c8102e15)',
                          color: 'var(--accent, #c8102e)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>
                          {c.name ? c.name[0].toUpperCase() : <FiUser />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#111827' }}>{c.name || 'Anonymous'}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <FiMail size={12} /> {c.email}
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                            <FiPhone size={12} /> {c.mobile}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{formatDate(c.created_at)}</div>
                    </td>
                    <td>
                      <span className="dash-badge" style={{ background: '#3b82f615', color: '#3b82f6', fontWeight: 600 }}>
                        {c.total_orders} Orders
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#10b981', fontSize: '15px' }}>
                        ₹{parseFloat(c.total_spent || 0).toFixed(0)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
