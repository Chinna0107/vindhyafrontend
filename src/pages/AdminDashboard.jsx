import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiPackage, FiShoppingBag, FiBarChart2, FiLogOut, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import './Dashboard.css';

import API from '../config';
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

const STATUS_COLOR = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/admin');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin');
  };

  const tabs = [
    { id: 'dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { id: 'products', icon: <FiShoppingBag />, label: 'Products' },
    { id: 'orders', icon: <FiPackage />, label: 'Orders' },
    { id: 'reports', icon: <FiBarChart2 />, label: 'Reports' },
  ];

  return (
    <div className="dash-page admin-dash">
      <aside className="dash-sidebar admin-sidebar">
        <div className="dash-brand">
          <span className="dash-brand-emoji">🛡️</span>
          <div>
            <div className="dash-brand-name">Vindhya Pickles</div>
            <div className="dash-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="dash-nav">
          {tabs.map(t => (
            <button key={t.id} className={`dash-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <button className="dash-nav-item logout" onClick={logout}><FiLogOut /> Logout</button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <h1 className="dash-page-title">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <span className="dash-admin-badge">Admin</span>
        </div>

        {activeTab === 'dashboard' && <AdminOverview />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'reports' && <AdminReports />}
      </main>
    </div>
  );
}

/* ─── OVERVIEW ─── */
function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetch(`${API}/admin/dashboard`, { headers: authHeader() })
      .then(r => r.json())
      .then(d => { setStats(d.stats); setRecentOrders(d.recentOrders || []); });
  }, []);

  if (!stats) return <div className="dash-loading-inline"><div className="dash-spinner" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

      <div className="dash-section-title">Recent Orders</div>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {recentOrders.map(o => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td>{o.email || '—'}</td>
                <td>₹{parseFloat(o.total).toFixed(0)}</td>
                <td><span className="dash-badge" style={{ background: (STATUS_COLOR[o.status] || '#6b7280') + '20', color: STATUS_COLOR[o.status] || '#6b7280' }}>{o.status}</span></td>
                <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─── PRODUCTS ─── */
const EMPTY_FORM = {
  name: '', slug: '', category: 'veg', tag: '', emoji: '', short_desc: '', full_desc: '',
  spice: 1, in_stock: true,
  prices: [{ weight: '', price: '', originalPrice: '' }],
  images: [''],
  benefits: [''],
  ingredients: [''],
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () =>
    fetch(`${API}/products`, { headers: authHeader() }).then(r => r.json()).then(setProducts);

  useEffect(() => { load(); }, []);

  const normalizeForm = (p) => ({
    ...p,
    name: p.name || '',
    slug: p.slug || '',
    tag: p.tag || '',
    emoji: p.emoji || '',
    short_desc: p.short_desc || '',
    full_desc: p.full_desc || '',
    prices: Array.isArray(p.prices) && p.prices.length ? p.prices : [{ weight: '', price: '', originalPrice: '' }],
    images: Array.isArray(p.images) && p.images.length ? p.images : [''],
    benefits: Array.isArray(p.benefits) && p.benefits.length ? p.benefits : [''],
    ingredients: Array.isArray(p.ingredients) && p.ingredients.length ? p.ingredients : [''],
  });

  const openEdit = (p) => { setEditing(p); setForm(normalizeForm(p)); setError(''); setShowForm(true); };
  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setShowForm(true); };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // prices
  const setPrice = (i, key, val) => setForm(f => { const p = [...f.prices]; p[i] = { ...p[i], [key]: val }; return { ...f, prices: p }; });
  const addPrice = () => setForm(f => ({ ...f, prices: [...f.prices, { weight: '', price: '', originalPrice: '' }] }));
  const removePrice = (i) => setForm(f => ({ ...f, prices: f.prices.filter((_, idx) => idx !== i) }));

  // images
  const setImage = (i, val) => setForm(f => { const imgs = [...f.images]; imgs[i] = val; return { ...f, images: imgs }; });
  const addImage = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  // array fields (benefits, ingredients)
  const setArr = (key, i, val) => setForm(f => { const a = [...f[key]]; a[i] = val; return { ...f, [key]: a }; });
  const addArr = (key) => setForm(f => ({ ...f, [key]: [...f[key], ''] }));
  const removeArr = (key, i) => setForm(f => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const save = async () => {
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      spice: parseInt(form.spice),
      prices: form.prices.filter(p => p.weight).map(p => ({ weight: p.weight, price: parseFloat(p.price), originalPrice: parseFloat(p.originalPrice) })),
      images: form.images.filter(Boolean),
      benefits: form.benefits.filter(Boolean),
      ingredients: form.ingredients.filter(Boolean),
    };
    const url = editing ? `${API}/products/${editing.id}` : `${API}/products`;
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || 'Save failed'); return; }
    setShowForm(false);
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: authHeader() });
    load();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dash-actions-bar">
        <button className="dash-btn-primary" onClick={openAdd}><FiPlus /> Add Product</button>
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>Emoji</th><th>Name</th><th>Category</th><th>Tag</th><th>Prices</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.emoji}</td>
                <td>{p.name}</td>
                <td><span className="dash-badge">{p.category}</span></td>
                <td>{p.tag}</td>
                <td style={{ fontSize: 12 }}>
                  {Array.isArray(p.prices) ? p.prices.map(pr => (
                    <div key={pr.weight}>{pr.weight}: <s style={{ color: '#9ca3af' }}>₹{pr.originalPrice}</s> ₹{pr.price}</div>
                  )) : '—'}
                </td>
                <td><span className="dash-badge" style={{ background: p.in_stock ? '#10b98120' : '#ef444420', color: p.in_stock ? '#10b981' : '#ef4444' }}>{p.in_stock ? 'In Stock' : 'Out'}</span></td>
                <td className="dash-actions">
                  <button className="dash-icon-btn edit" onClick={() => openEdit(p)}><FiEdit2 /></button>
                  <button className="dash-icon-btn del" onClick={() => del(p.id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="dash-modal-overlay" onClick={() => setShowForm(false)}>
          <motion.div className="dash-modal dash-modal-lg" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="dash-modal-header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowForm(false)}><FiX /></button>
            </div>
            <div className="dash-modal-body">
              {error && <div className="dash-form-error">{error}</div>}

              {/* Basic Info */}
              <div className="dash-form-section">Basic Info</div>
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="dash-form-group">
                  <label>Slug</label>
                  <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. mango-avakaya" />
                </div>
              </div>
              <div className="dash-form-row">
                <div className="dash-form-group">
                  <label>Emoji</label>
                  <input value={form.emoji} onChange={e => set('emoji', e.target.value)} placeholder="🥭" />
                </div>
                <div className="dash-form-group">
                  <label>Tag</label>
                  <input value={form.tag} onChange={e => set('tag', e.target.value)} placeholder="Bestseller" />
                </div>
                <div className="dash-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="veg">Veg</option>
                    <option value="nonveg">Non-Veg</option>
                    <option value="karam">Karam Podi</option>
                  </select>
                </div>
                <div className="dash-form-group">
                  <label>Spice (1–5)</label>
                  <input type="number" min="1" max="5" value={form.spice} onChange={e => set('spice', e.target.value)} />
                </div>
              </div>
              <div className="dash-form-group">
                <label>Short Description</label>
                <input value={form.short_desc} onChange={e => set('short_desc', e.target.value)} />
              </div>
              <div className="dash-form-group">
                <label>Full Description</label>
                <textarea rows={3} value={form.full_desc || ''} onChange={e => set('full_desc', e.target.value)} />
              </div>
              <div className="dash-form-group">
                <label className="dash-checkbox-label">
                  <input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} /> In Stock
                </label>
              </div>

              {/* Prices */}
              <div className="dash-form-section">Prices</div>
              {form.prices.map((pr, i) => (
                <div key={i} className="dash-form-row dash-form-price-row">
                  <div className="dash-form-group">
                    <label>Weight</label>
                    <input value={pr.weight} onChange={e => setPrice(i, 'weight', e.target.value)} placeholder="250g" />
                  </div>
                  <div className="dash-form-group">
                    <label>Original Price (₹) <span style={{color:'#9ca3af',fontSize:11}}>strikeoff</span></label>
                    <input type="number" value={pr.originalPrice} onChange={e => setPrice(i, 'originalPrice', e.target.value)} placeholder="220" />
                  </div>
                  <div className="dash-form-group">
                    <label>Our Price (₹)</label>
                    <input type="number" value={pr.price} onChange={e => setPrice(i, 'price', e.target.value)} placeholder="180" />
                  </div>
                  <button className="dash-icon-btn del" style={{ marginTop: 22 }} onClick={() => removePrice(i)} disabled={form.prices.length === 1}><FiX /></button>
                </div>
              ))}
              <button className="dash-btn-ghost" onClick={addPrice}><FiPlus /> Add Price Variant</button>

              {/* Images */}
              <div className="dash-form-section">Images <span style={{fontSize:12,color:'#9ca3af'}}>(paste URLs)</span></div>
              {form.images.map((img, i) => (
                <div key={i} className="dash-form-row" style={{ alignItems: 'center', gap: 8 }}>
                  <div className="dash-form-group" style={{ flex: 1 }}>
                    <input value={img} onChange={e => setImage(i, e.target.value)} placeholder="https://..." />
                  </div>
                  {img && <img src={img} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} onError={e => e.target.style.display='none'} />}
                  <button className="dash-icon-btn del" onClick={() => removeImage(i)} disabled={form.images.length === 1}><FiX /></button>
                </div>
              ))}
              <button className="dash-btn-ghost" onClick={addImage}><FiPlus /> Add Image</button>

              {/* Benefits */}
              <div className="dash-form-section">Benefits</div>
              {form.benefits.map((b, i) => (
                <div key={i} className="dash-form-row" style={{ gap: 8 }}>
                  <div className="dash-form-group" style={{ flex: 1 }}>
                    <input value={b} onChange={e => setArr('benefits', i, e.target.value)} placeholder="Rich in antioxidants" />
                  </div>
                  <button className="dash-icon-btn del" style={{ marginTop: 4 }} onClick={() => removeArr('benefits', i)} disabled={form.benefits.length === 1}><FiX /></button>
                </div>
              ))}
              <button className="dash-btn-ghost" onClick={() => addArr('benefits')}><FiPlus /> Add Benefit</button>

              {/* Ingredients */}
              <div className="dash-form-section">Ingredients</div>
              {form.ingredients.map((ing, i) => (
                <div key={i} className="dash-form-row" style={{ gap: 8 }}>
                  <div className="dash-form-group" style={{ flex: 1 }}>
                    <input value={ing} onChange={e => setArr('ingredients', i, e.target.value)} placeholder="Raw Mango" />
                  </div>
                  <button className="dash-icon-btn del" style={{ marginTop: 4 }} onClick={() => removeArr('ingredients', i)} disabled={form.ingredients.length === 1}><FiX /></button>
                </div>
              ))}
              <button className="dash-btn-ghost" onClick={() => addArr('ingredients')}><FiPlus /> Add Ingredient</button>
            </div>

            <div className="dash-modal-footer">
              <button className="dash-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="dash-btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving...' : <><FiCheck /> Save Product</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── ORDERS ─── */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    const url = filter ? `${API}/orders?status=${filter}` : `${API}/orders`;
    fetch(url, { headers: authHeader() }).then(r => r.json()).then(setOrders);
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/orders/${id}/status`, { method: 'PUT', headers: authHeader(), body: JSON.stringify({ status }) });
    load();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dash-actions-bar">
        <div className="dash-filter-tabs">
          {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} className={`dash-filter-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
          <tbody>
            {orders.map(o => {
              const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
              return (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>
                    <div>{o.email || '—'}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{o.mobile}</div>
                  </td>
                  <td>{Array.isArray(items) ? items.map(i => `${i.name} (${i.selectedWeight})`).join(', ') : '—'}</td>
                  <td>₹{parseFloat(o.total).toFixed(0)}</td>
                  <td><span className="dash-badge" style={{ background: (STATUS_COLOR[o.status] || '#6b7280') + '20', color: STATUS_COLOR[o.status] || '#6b7280' }}>{o.status}</span></td>
                  <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <select className="dash-status-select" value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ─── REPORTS ─── */
function AdminReports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetch(`${API}/reports`, { headers: authHeader() }).then(r => r.json()).then(setReport);
  }, []);

  if (!report) return <div className="dash-loading-inline"><div className="dash-spinner" /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dash-reports-grid">
        {/* Customer Stats */}
        <div className="dash-report-card">
          <h3>👥 Customer Stats</h3>
          <div className="dash-report-row"><span>Total Customers</span><strong>{report.customerStats?.total_customers}</strong></div>
          <div className="dash-report-row"><span>New This Month</span><strong>{report.customerStats?.new_this_month}</strong></div>
        </div>

        {/* Sales by Status */}
        <div className="dash-report-card">
          <h3>📦 Orders by Status</h3>
          {report.salesByStatus?.map(s => (
            <div key={s.status} className="dash-report-row">
              <span><span className="dash-badge" style={{ background: (STATUS_COLOR[s.status] || '#6b7280') + '20', color: STATUS_COLOR[s.status] || '#6b7280' }}>{s.status}</span></span>
              <strong>{s.count} orders · ₹{parseFloat(s.revenue).toFixed(0)}</strong>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div className="dash-report-card">
          <h3>🏆 Top Products</h3>
          {report.topProducts?.map((p, i) => (
            <div key={i} className="dash-report-row">
              <span>#{i + 1} {p.product}</span>
              <strong>{p.qty_sold} sold</strong>
            </div>
          ))}
        </div>

        {/* Monthly Sales */}
        <div className="dash-report-card full-width">
          <h3>📅 Monthly Revenue</h3>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Month</th><th>Orders</th><th>Revenue</th></tr></thead>
              <tbody>
                {report.monthlySales?.map(m => (
                  <tr key={m.month}>
                    <td>{m.month}</td>
                    <td>{m.orders}</td>
                    <td>₹{parseFloat(m.revenue).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Sales */}
        <div className="dash-report-card full-width">
          <h3>📈 Last 7 Days</h3>
          <div className="dash-bar-chart">
            {report.dailySales?.map((d, i) => {
              const max = Math.max(...report.dailySales.map(x => parseFloat(x.revenue)));
              const pct = max > 0 ? (parseFloat(d.revenue) / max) * 100 : 0;
              return (
                <div key={i} className="dash-bar-col">
                  <div className="dash-bar-value">₹{parseFloat(d.revenue).toFixed(0)}</div>
                  <div className="dash-bar" style={{ height: `${Math.max(pct, 4)}%` }} />
                  <div className="dash-bar-label">{new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
