import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiTag, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import API from '../../config';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json',
});

const EMPTY = {
  code: '', discount_percent: '', description: '',
  min_order_value: '', max_uses: '', expiry_date: '', is_active: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () =>
    fetch(`${API}/coupons`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => setCoupons(Array.isArray(d) ? d : []));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setShowForm(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      ...c,
      min_order_value: c.min_order_value || '',
      max_uses: c.max_uses || '',
      expiry_date: c.expiry_date ? c.expiry_date.split('T')[0] : '',
    });
    setError(''); setShowForm(true);
  };

  const save = async () => {
    if (!form.code.trim() || !form.discount_percent) { setError('Code and discount % are required'); return; }
    setSaving(true); setError('');
    const url = editing ? `${API}/coupons/${editing.id}` : `${API}/coupons`;
    const method = editing ? 'PUT' : 'POST';
    const payload = {
      ...form,
      discount_percent: parseFloat(form.discount_percent),
      min_order_value: form.min_order_value ? parseFloat(form.min_order_value) : null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expiry_date: form.expiry_date || null,
    };
    try {
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Save failed'); setSaving(false); return; }
      setShowForm(false); load();
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`${API}/coupons/${id}`, { method: 'DELETE', headers: authHeader() });
    load();
  };

  const toggle = async (c) => {
    await fetch(`${API}/coupons/${c.id}`, {
      method: 'PUT', headers: authHeader(),
      body: JSON.stringify({ ...c, is_active: !c.is_active }),
    });
    load();
  };

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const active = coupons.filter(c => c.is_active).length;
  const inactive = coupons.length - active;
  const totalUses = coupons.reduce((s, c) => s + (c.used_count || 0), 0);

  const isExpired = (c) => c.expiry_date && new Date(c.expiry_date) < new Date();
  const isExhausted = (c) => c.max_uses && (c.used_count || 0) >= c.max_uses;

  const getStatusLabel = (c) => {
    if (isExpired(c)) return { label: 'Expired', color: '#f59e0b' };
    if (isExhausted(c)) return { label: 'Exhausted', color: '#6366f1' };
    if (!c.is_active) return { label: 'Inactive', color: '#ef4444' };
    return { label: 'Active', color: '#10b981' };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Stats */}
      <div className="dash-stats" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Coupons', value: coupons.length, icon: '🎟️', color: '#3b82f6' },
          { label: 'Active', value: active, icon: '✅', color: '#10b981' },
          { label: 'Inactive', value: inactive, icon: '⛔', color: '#ef4444' },
          { label: 'Total Uses', value: totalUses, icon: '🔁', color: '#8b5cf6' },
        ].map((s, i) => (
          <motion.div key={i} className="dash-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className="dash-stat-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
            <div className="dash-stat-value">{s.value}</div>
            <div className="dash-stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="dash-actions-bar" style={{ gap: 12 }}>
        <input
          className="dash-search-input"
          placeholder="🔍 Search coupons..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 280, padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14 }}
        />
        <button className="dash-btn-primary" onClick={openAdd}><FiPlus /> Add Coupon</button>
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min Order</th>
              <th>Uses</th>
              <th>Expiry</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map(c => {
                const { label, color } = getStatusLabel(c);
                return (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td>
                      <span style={{
                        background: '#fef3c7', color: '#92400e', fontWeight: 700,
                        padding: '3px 10px', borderRadius: 6, letterSpacing: 1, fontSize: 13,
                      }}>
                        <FiTag size={11} style={{ marginRight: 4 }} />{c.code}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#10b981', fontSize: 15 }}>{c.discount_percent}%</span>
                    </td>
                    <td>{c.min_order_value ? `₹${c.min_order_value}` : <span style={{ color: '#9ca3af' }}>—</span>}</td>
                    <td>
                      <span style={{ color: '#6b7280', fontSize: 13 }}>
                        {c.used_count || 0}{c.max_uses ? `/${c.max_uses}` : ''}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: isExpired(c) ? '#f59e0b' : '#6b7280' }}>
                      {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString('en-IN') : <span style={{ color: '#9ca3af' }}>Never</span>}
                    </td>
                    <td style={{ fontSize: 13, color: '#6b7280', maxWidth: 160 }}>{c.description || '—'}</td>
                    <td>
                      <button onClick={() => toggle(c)} title="Toggle active" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: color + '18', color, border: `1px solid ${color}40`,
                        borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>
                        {c.is_active && !isExpired(c) && !isExhausted(c)
                          ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                        {label}
                      </button>
                    </td>
                    <td className="dash-actions">
                      <button className="dash-icon-btn edit" onClick={() => openEdit(c)}><FiEdit2 /></button>
                      <button className="dash-icon-btn del" onClick={() => del(c.id)}><FiTrash2 /></button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>
                {search ? 'No matching coupons' : 'No coupons yet. Click "Add Coupon" to create one.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="dash-modal-overlay" onClick={() => setShowForm(false)}>
            <motion.div className="dash-modal" onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="dash-modal-header">
                <h3>{editing ? '✏️ Edit Coupon' : '🎟️ New Coupon'}</h3>
                <button onClick={() => setShowForm(false)}><FiX /></button>
              </div>
              <div className="dash-modal-body">
                {error && <div className="dash-form-error">{error}</div>}

                <div className="dash-form-section">Basic Info</div>
                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Coupon Code *</label>
                    <input
                      value={form.code}
                      onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                      placeholder="e.g. SAVE10"
                      style={{ fontWeight: 700, letterSpacing: 1 }}
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>Discount % *</label>
                    <input type="number" min="1" max="100" value={form.discount_percent}
                      onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))}
                      placeholder="e.g. 10" />
                  </div>
                </div>

                <div className="dash-form-group">
                  <label>Description</label>
                  <input value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="e.g. Flat 10% off on all orders above ₹299" />
                </div>

                <div className="dash-form-section">Conditions</div>
                <div className="dash-form-row">
                  <div className="dash-form-group">
                    <label>Min Order Value (₹)</label>
                    <input type="number" min="0" value={form.min_order_value}
                      onChange={e => setForm(f => ({ ...f, min_order_value: e.target.value }))}
                      placeholder="e.g. 299 (leave blank for no minimum)" />
                  </div>
                  <div className="dash-form-group">
                    <label>Max Uses</label>
                    <input type="number" min="1" value={form.max_uses}
                      onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                      placeholder="e.g. 100 (leave blank for unlimited)" />
                  </div>
                  <div className="dash-form-group">
                    <label>Expiry Date</label>
                    <input type="date" value={form.expiry_date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))} />
                  </div>
                </div>

                <div className="dash-form-group" style={{ marginTop: 8 }}>
                  <label className="dash-checkbox-label">
                    <input type="checkbox" checked={form.is_active}
                      onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                    Active (coupon usable by customers)
                  </label>
                </div>

                {(form.min_order_value || form.discount_percent) && (
                  <div style={{
                    marginTop: 16, padding: '12px 16px', background: '#fef3c720',
                    border: '1px dashed #d97706', borderRadius: 10, fontSize: 13, color: '#92400e',
                  }}>
                    🎟️ Preview: <strong>{form.code || 'CODE'}</strong> gives <strong>{form.discount_percent || '?'}% off</strong>
                    {form.min_order_value ? ` on orders above ₹${form.min_order_value}` : ' on any order'}
                    {form.expiry_date ? `, valid till ${new Date(form.expiry_date).toLocaleDateString('en-IN')}` : ''}
                  </div>
                )}
              </div>
              <div className="dash-modal-footer">
                <button className="dash-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="dash-btn-primary" onClick={save} disabled={saving}>
                  {saving ? 'Saving...' : <><FiCheck /> {editing ? 'Update Coupon' : 'Create Coupon'}</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
