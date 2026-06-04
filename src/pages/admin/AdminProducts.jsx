import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiStar } from 'react-icons/fi';
import CloudinaryImageUpload from '../../components/CloudinaryImageUpload';
import '../../components/CloudinaryImageUpload.css';
import API from '../../config';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

const EMPTY_FORM = {
  name: '', slug: '', category: 'veg', subcategory: '', tag: '', emoji: '', short_desc: '', full_desc: '',
  spice: 1, in_stock: true, rating: 4.5, reviews: [],
  prices: [{ weight: '', price: '', originalPrice: '' }],
  images: [''], benefits: '', ingredients: '',
};

export default function AdminProducts() {
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
    name: p.name || '', slug: p.slug || '', tag: p.tag || '', emoji: p.emoji || '',
    subcategory: p.subcategory || '',
    short_desc: p.short_desc || '', full_desc: p.full_desc || '',
    rating: p.rating ?? 4.5,
    reviews: Array.isArray(p.reviews) ? p.reviews : [],
    prices: Array.isArray(p.prices) && p.prices.length ? p.prices : [{ weight: '', price: '', originalPrice: '' }],
    images: Array.isArray(p.images) && p.images.length ? p.images : [''],
    benefits: Array.isArray(p.benefits) && p.benefits.length ? p.benefits.join(', ') : (p.benefits || ''),
    ingredients: Array.isArray(p.ingredients) && p.ingredients.length ? p.ingredients.join(', ') : (p.ingredients || ''),
  });

  const openEdit = async (p) => {
    setEditing(p);
    setError('');
    let productReviews = [];
    try {
      const res = await fetch(`${API}/products/${p.id}/reviews`);
      if (res.ok) {
        productReviews = await res.json();
      }
    } catch (err) {
      console.error(err);
    }
    setForm({
      ...normalizeForm(p),
      reviews: productReviews
    });
    setShowForm(true);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const setPrice = (i, key, val) => setForm(f => { const p = [...f.prices]; p[i] = { ...p[i], [key]: val }; return { ...f, prices: p }; });
  const addPrice = () => setForm(f => ({ ...f, prices: [...f.prices, { weight: '', price: '', originalPrice: '' }] }));
  const removePrice = (i) => setForm(f => ({ ...f, prices: f.prices.filter((_, idx) => idx !== i) }));

  const setImage = (i, val) => setForm(f => { const imgs = [...f.images]; imgs[i] = val; return { ...f, images: imgs }; });
  const addImage = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImage = (i) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const handleImageUploaded = (index, imageUrl) => {
    setImage(index, imageUrl);
  };

  const handleImageRemove = (index) => {
    if (form.images.length === 1) {
      setImage(index, '');
    } else {
      removeImage(index);
    }
  };


  const save = async () => {
    setError(''); setSaving(true);
    const payload = {
      ...form,
      spice: parseInt(form.spice),
      subcategory: ['snacks','vadiyalu'].includes(form.category) ? form.subcategory : null,
      rating: parseFloat(form.rating) || 0,
      reviews: Array.isArray(form.reviews) ? form.reviews.length : 0,
      prices: form.prices.filter(p => p.weight).map(p => ({ weight: p.weight, price: parseFloat(p.price), originalPrice: parseFloat(p.originalPrice) })),
      images: form.images.filter(Boolean),
      benefits: form.benefits,
      ingredients: form.ingredients,
    };
    const url = editing ? `${API}/products/${editing.id}` : `${API}/products`;
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: authHeader(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { 
        setError(data.error || 'Save failed'); 
        setSaving(false);
        return; 
      }
      
      const productId = data.product?.id || data.id || editing?.id;
      if (productId) {
        // Sync reviews
        await fetch(`${API}/products/${productId}/reviews`, {
          method: 'PUT',
          headers: authHeader(),
          body: JSON.stringify({ reviews: form.reviews || [] }),
        });
      }
      
      setSaving(false);
      setShowForm(false); 
      load();
    } catch (err) {
      setError(err.message || 'Save failed');
      setSaving(false);
    }
  };


  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', headers: authHeader() });
    load();
  };

  const toggleCoupon = async (p) => {
    await fetch(`${API}/products/${p.id}`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ ...p, coupon_applicable: !p.coupon_applicable }),
    });
    load();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="dash-actions-bar">
        <button className="dash-btn-primary" onClick={openAdd}><FiPlus /> Add Product</button>
      </div>

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead><tr><th>Emoji</th><th>Name</th><th>Category</th><th>Tag</th><th>Prices</th><th>Stock</th><th>Coupon</th><th>Actions</th></tr></thead>
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
                <td>
                  <button
                    onClick={() => toggleCoupon(p)}
                    style={{
                      background: p.coupon_applicable ? '#10b98120' : '#ef444420',
                      color: p.coupon_applicable ? '#10b981' : '#ef4444',
                      border: 'none', cursor: 'pointer', padding: '4px 10px',
                      borderRadius: 6, fontSize: 12, fontWeight: 600,
                    }}
                  >
                    {p.coupon_applicable ? 'Applicable' : 'Not Applicable'}
                  </button>
                </td>
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

              <div className="dash-form-section">Basic Info</div>
              <div className="dash-form-row">
                <div className="dash-form-group"><label>Name</label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
                <div className="dash-form-group"><label>Slug</label><input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="e.g. mango-avakaya" /></div>
              </div>
              <div className="dash-form-row">
                <div className="dash-form-group"><label>Emoji</label><input value={form.emoji} onChange={e => set('emoji', e.target.value)} /></div>
                <div className="dash-form-group"><label>Tag</label><input value={form.tag} onChange={e => set('tag', e.target.value)} /></div>
                <div className="dash-form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="veg">Veg Pickles</option>
                    <option value="nonveg">Non-Veg Pickles</option>
                    <option value="karam">Podi's</option>
                    <option value="snacks">Snacks</option>
                    <option value="vadiyalu">Vadiyalu</option>
                  </select>
                </div>
                {form.category === 'snacks' && (
                  <div className="dash-form-group">
                    <label>Subcategory</label>
                    <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)}>
                      <option value="">Select Subcategory</option>
                      <option value="sweet items">Sweet Items</option>
                      <option value="hot items">Hot Items</option>
                    </select>
                  </div>
                )}
                {form.category === 'vadiyalu' && (
                  <div className="dash-form-group">
                    <label>Subcategory</label>
                    <select value={form.subcategory} onChange={e => set('subcategory', e.target.value)}>
                      <option value="">Select Subcategory</option>
                      <option value="rice">Rice Vadiyalu</option>
                      <option value="urad">Urad Vadiyalu</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </div>
                )}
                <div className="dash-form-group"><label>Spice (0–5)</label><input type="number" min="0" max="5" value={form.spice} onChange={e => set('spice', e.target.value)} /></div>
              </div>
              <div className="dash-form-group"><label>Short Description</label><input value={form.short_desc} onChange={e => set('short_desc', e.target.value)} /></div>

              <div className="dash-form-group"><label>Full Description</label><textarea rows={3} value={form.full_desc || ''} onChange={e => set('full_desc', e.target.value)} /></div>
              <div className="dash-form-group">
                <label className="dash-checkbox-label"><input type="checkbox" checked={form.in_stock} onChange={e => set('in_stock', e.target.checked)} /> In Stock</label>
              </div>

              <div className="dash-form-section">Prices</div>
              {form.prices.map((pr, i) => (
                <div key={i} className="dash-form-row dash-form-price-row">
                  <div className="dash-form-group"><label>Weight</label><input value={pr.weight} onChange={e => setPrice(i, 'weight', e.target.value)} placeholder="250g" /></div>
                  <div className="dash-form-group"><label>Original ₹ <span style={{color:'#9ca3af',fontSize:11}}>strikeoff</span></label><input type="number" value={pr.originalPrice} onChange={e => setPrice(i, 'originalPrice', e.target.value)} /></div>
                  <div className="dash-form-group"><label>Our Price ₹</label><input type="number" value={pr.price} onChange={e => setPrice(i, 'price', e.target.value)} /></div>
                  <button className="dash-icon-btn del" style={{ marginTop: 22 }} onClick={() => removePrice(i)} disabled={form.prices.length === 1}><FiX /></button>
                </div>
              ))}
              <button className="dash-btn-ghost" onClick={addPrice}><FiPlus /> Add Price Variant</button>

              <div className="dash-form-section">Images</div>
              <div className="images-upload-container">
                {form.images.map((img, i) => (
                  <CloudinaryImageUpload
                    key={i}
                    currentImage={img}
                    onImageUploaded={(imageUrl) => handleImageUploaded(i, imageUrl)}
                    onRemove={handleImageRemove}
                    index={i}
                  />
                ))}
              </div>
              <button 
                type="button"
                className="dash-btn-ghost" 
                onClick={addImage}
                style={{ marginTop: '12px' }}
              >
                <FiPlus /> Add Another Image
              </button>

              <div className="dash-form-section">Benefits</div>
              <div className="dash-form-group">
                <label style={{ fontSize: 12, color: '#9ca3af' }}>Comma separated — e.g. Rich in antioxidants, Boosts immunity</label>
                <textarea rows={2} value={form.benefits} onChange={e => set('benefits', e.target.value)} placeholder="Rich in antioxidants, Boosts immunity, Aids digestion" />
              </div>

              <div className="dash-form-section">Ingredients</div>
              <div className="dash-form-group">
                <label style={{ fontSize: 12, color: '#9ca3af' }}>Comma separated — e.g. Raw Mango, Salt, Chili</label>
                <textarea rows={2} value={form.ingredients} onChange={e => set('ingredients', e.target.value)} placeholder="Raw Mango, Salt, Red Chili, Mustard seeds" />
              </div>

              <div className="dash-form-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30 }}>
                <span>Customer Reviews</span>
                <button type="button" className="dash-btn-ghost" style={{ padding: '4px 10px', fontSize: 12, margin: 0 }}
                  onClick={() => setForm(f => ({ ...f, reviews: [...(f.reviews || []), { customer_name: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] }] }))}>
                  <FiPlus /> Add Review
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                {(form.reviews || []).map((rev, idx) => (
                  <div key={idx} style={{ background: '#fcfbf8', border: '1px solid rgba(212, 160, 23, 0.18)', borderRadius: 16, padding: 16 }}>
                    <div className="dash-form-row" style={{ gap: 8, marginBottom: 8 }}>
                      <div className="dash-form-group" style={{ flex: 2 }}>
                        <label>Customer Name</label>
                        <input value={rev.customer_name || rev.name || ''} 
                          onChange={e => {
                            const r = [...form.reviews];
                            r[idx] = { ...r[idx], customer_name: e.target.value };
                            setForm(f => ({ ...f, reviews: r }));
                          }} 
                          placeholder="e.g. Ramesh Kumar"
                        />
                      </div>
                      <div className="dash-form-group" style={{ flex: 1 }}>
                        <label>Rating</label>
                        <select value={rev.rating} 
                          onChange={e => {
                            const r = [...form.reviews];
                            r[idx] = { ...r[idx], rating: parseInt(e.target.value) || 5 };
                            setForm(f => ({ ...f, reviews: r }));
                          }}
                        >
                          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                        </select>
                      </div>
                      <div className="dash-form-group" style={{ flex: 1.5 }}>
                        <label>Date</label>
                        <input type="date" 
                          value={rev.created_at ? new Date(rev.created_at).toISOString().split('T')[0] : (rev.date || new Date().toISOString().split('T')[0])} 
                          onChange={e => {
                            const r = [...form.reviews];
                            r[idx] = { ...r[idx], date: e.target.value, created_at: e.target.value };
                            setForm(f => ({ ...f, reviews: r }));
                          }} 
                        />
                      </div>
                      <button type="button" className="dash-icon-btn del" style={{ marginTop: 22 }}
                        onClick={() => setForm(f => ({ ...f, reviews: f.reviews.filter((_, j) => j !== idx) }))}>
                        <FiX />
                      </button>
                    </div>
                    <div className="dash-form-group">
                      <label>Comment</label>
                      <textarea rows={2} value={rev.comment || ''} 
                        onChange={e => {
                          const r = [...form.reviews];
                          r[idx] = { ...r[idx], comment: e.target.value };
                          setForm(f => ({ ...f, reviews: r }));
                        }} 
                        placeholder="Delicious! True authentic flavors..."
                      />
                    </div>
                  </div>
                ))}
                {(form.reviews || []).length === 0 && (
                  <p style={{ color: 'var(--text-light)', fontSize: 13, fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                    No reviews added. Click "Add Review" to add mock/manual reviews.
                  </p>
                )}
              </div>
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

