import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPrinter, FiTruck, FiEdit2, FiSave, FiX, FiEye, FiFilter, FiSearch, FiDownload, FiRefreshCw } from 'react-icons/fi';
import API from '../../config';
import { formatDate, formatTime, formatDateTime } from '../../utils/dateUtils';
import './AdminOrders.css';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}`, 'Content-Type': 'application/json' });

const STATUS_COLOR = {
  pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
  shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTracking, setEditingTracking] = useState(null);
  const [trackingData, setTrackingData] = useState({ id: '', link: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const load = () => {
    setLoading(true);
    const url = filter ? `${API}/orders?status=${filter}` : `${API}/orders`;
    fetch(url, { headers: authHeader() })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/orders/${id}/status`, { method: 'PUT', headers: authHeader(), body: JSON.stringify({ status }) });
    load();
  };

  const updateTracking = async (orderId) => {
    try {
      await fetch(`${API}/orders/${orderId}/tracking`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ trackingId: trackingData.id, trackingLink: trackingData.link })
      });
      setEditingTracking(null);
      setTrackingData({ id: '', link: '' });
      load();
    } catch (err) {
      alert('Failed to update tracking info');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mobile?.includes(searchTerm) ||
      order.id.toString().includes(searchTerm) ||
      order.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusStats = () => {
    const stats = {};
    orders.forEach(order => {
      stats[order.status] = (stats[order.status] || 0) + 1;
    });
    return stats;
  };

  const statusStats = getStatusStats();

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const printOrder = (order) => {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const printContent = `
      <html>
        <head>
          <title>Shipping Label - Order #${order.id}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              background: white;
              color: black;
            }
            .shipping-label {
              max-width: 400px;
              margin: 0 auto;
              border: 3px solid #000;
              padding: 0;
            }
            .header {
              background: #000;
              color: white;
              text-align: center;
              padding: 15px;
              margin: 0;
            }
            .company-name {
              font-size: 20px;
              font-weight: bold;
              margin: 0;
            }
            .tagline {
              font-size: 12px;
              margin: 5px 0 0 0;
              opacity: 0.9;
            }
            .addresses {
              display: flex;
              border-bottom: 2px solid #000;
            }
            .from-address, .to-address {
              flex: 1;
              padding: 15px;
            }
            .from-address {
              border-right: 2px solid #000;
              background: #f8f8f8;
            }
            .address-label {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .address-content {
              font-size: 12px;
              line-height: 1.4;
            }
            .order-details {
              padding: 15px;
            }
            .order-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ddd;
            }
            .order-id {
              font-size: 18px;
              font-weight: bold;
            }
            .order-date {
              font-size: 12px;
              color: #666;
            }
            .status-badge {
              background: #000;
              color: white;
              padding: 4px 12px;
              border-radius: 15px;
              font-size: 11px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .items-section {
              margin: 15px 0;
            }
            .section-title {
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              padding: 5px 0;
              font-size: 12px;
              border-bottom: 1px dotted #ccc;
            }
            .item:last-child {
              border-bottom: none;
            }
            .item-details {
              flex: 1;
            }
            .item-name {
              font-weight: bold;
            }
            .item-meta {
              color: #666;
              font-size: 11px;
            }
            .item-total {
              font-weight: bold;
              white-space: nowrap;
              margin-left: 10px;
            }
            .totals {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px solid #000;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 3px 0;
              font-size: 12px;
            }
            .total-row.final {
              font-weight: bold;
              font-size: 14px;
              margin-top: 5px;
              padding-top: 8px;
              border-top: 1px solid #000;
            }
            .footer {
              text-align: center;
              padding: 10px;
              background: #f8f8f8;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
            }
            .tracking-info {
              margin: 10px 0;
              padding: 8px;
              background: #f0f0f0;
              border-radius: 4px;
              font-size: 11px;
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .shipping-label { max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="shipping-label">
            <div class="header">
              <div class="company-name">VINDHYA PICKLES & FOODS</div>
              <div class="tagline">Authentic Homemade Pickles</div>
            </div>
            
            <div class="addresses">
              <div class="from-address">
                <div class="address-label">From:</div>
                <div class="address-content">
                  <strong>Vindhya Pickles & Foods</strong><br>
                  D.No: 12-34-56, Pickle Street<br>
                  Spice Colony, Hyderabad<br>
                  Telangana - 500001<br>
                  Phone: +91 8142128079<br>
                  Email: vindhyapicklesandfoods@gmail.com
                </div>
              </div>
              
              <div class="to-address">
                <div class="address-label">To:</div>
                <div class="address-content">
                  <strong>${order.name || order.email || 'Customer'}</strong><br>
                  Phone: ${order.mobile}<br>
                  ${order.address ? order.address.replace(/,/g, '<br>') : 'Address not provided'}
                </div>
              </div>
            </div>
            
            <div class="order-details">
              <div class="order-header">
                <div>
                  <div class="order-id">Order #${order.id}</div>
                  <div class="order-date">${new Date(order.created_at).toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                  })} ${new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                </div>
                <div class="status-badge">${order.status}</div>
              </div>
              
              ${order.tracking_id ? `
                <div class="tracking-info">
                  <strong>Tracking ID:</strong> ${order.tracking_id}
                  ${order.tracking_link ? `<br><strong>Track:</strong> ${order.tracking_link}` : ''}
                </div>
              ` : ''}
              
              <div class="items-section">
                <div class="section-title">Items Ordered:</div>
                ${Array.isArray(items) ? items.map(item => {
                  // Get price from the item's prices array based on selected weight
                  let itemPrice = 0;
                  if (item.prices && Array.isArray(item.prices)) {
                    const priceObj = item.prices.find(p => p.weight === item.selectedWeight);
                    itemPrice = priceObj ? priceObj.price : (item.prices[0]?.price || 0);
                  } else if (item.price) {
                    itemPrice = item.price;
                  }
                  
                  return `
                    <div class="item">
                      <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-meta">${item.selectedWeight} × ${item.qty}</div>
                      </div>
                      ${itemPrice > 0 ? `<div class="item-total">₹${(itemPrice * item.qty).toFixed(0)}</div>` : ''}
                    </div>
                  `;
                }).join('') : '<div class="item">No items found</div>'}
              </div>
              
              <div class="totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>₹${parseFloat(order.subtotal || 0).toFixed(0)}</span>
                </div>
                ${parseFloat(order.discount || 0) > 0 ? `
                  <div class="total-row">
                    <span>Discount:</span>
                    <span>-₹${parseFloat(order.discount).toFixed(0)}</span>
                  </div>
                ` : ''}
                <div class="total-row">
                  <span>Delivery:</span>
                  <span>FREE</span>
                </div>
                <div class="total-row final">
                  <span>Total Amount:</span>
                  <span>₹${parseFloat(order.total).toFixed(0)}</span>
                </div>
              </div>
            </div>
            
            <div class="footer">
              Thank you for choosing Vindhya Pickles & Foods!<br>
              For support: +91 8142128079 | vindhyapicklesandfoods@gmail.com
            </div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <motion.div 
        className="admin-orders-container"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="orders-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">Orders Management</h1>
              <p className="page-subtitle">Manage and track all customer orders</p>
            </div>
            <div className="header-actions">
              <motion.button 
                className="refresh-btn"
                onClick={load}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw size={16} />
                Refresh
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(status => (
            <motion.div 
              key={status}
              className={`stat-card ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(filter === status ? '' : status)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="stat-number">{statusStats[status] || 0}</div>
              <div className="stat-label">{status}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="controls-section">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID, email, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
              <button 
                key={s} 
                className={`filter-tab ${filter === s ? 'active' : ''}`} 
                onClick={() => setFilter(s)}
              >
                {s || 'All'} {s && statusStats[s] ? `(${statusStats[s]})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Tracking</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => {
                      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                      return (
                        <motion.tr 
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="order-row"
                        >
                          <td className="order-id-cell">
                            <div className="order-id">#{order.id}</div>
                          </td>
                          
                          <td className="customer-cell">
                            <div className="customer-info">
                              <div className="customer-name">{order.name || order.email?.split('@')[0] || '—'}</div>
                              <div className="customer-email">{order.email || '—'}</div>
                              <div className="customer-phone">{order.mobile}</div>
                            </div>
                          </td>
                          
                          <td className="items-cell">
                            <div className="items-preview">
                              {Array.isArray(items) ? (
                                <>
                                  <span className="items-count">{items.length} item{items.length > 1 ? 's' : ''}</span>
                                  <button 
                                    className="view-items-btn"
                                    onClick={() => viewOrderDetails(order)}
                                  >
                                    <FiEye size={12} />
                                  </button>
                                </>
                              ) : '—'}
                            </div>
                          </td>
                          
                          <td className="amount-cell">
                            <div className="amount">₹{parseFloat(order.total).toFixed(0)}</div>
                          </td>
                          
                          <td className="status-cell">
                            <select 
                              className={`status-select status-${order.status}`}
                              value={order.status} 
                              onChange={e => updateStatus(order.id, e.target.value)}
                            >
                              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          
                          <td className="tracking-cell">
                            {editingTracking === order.id ? (
                              <div className="tracking-edit">
                                <input
                                  type="text"
                                  placeholder="Tracking ID"
                                  value={trackingData.id}
                                  onChange={(e) => setTrackingData(prev => ({ ...prev, id: e.target.value }))}
                                  className="tracking-input"
                                />
                                <input
                                  type="text"
                                  placeholder="Tracking Link"
                                  value={trackingData.link}
                                  onChange={(e) => setTrackingData(prev => ({ ...prev, link: e.target.value }))}
                                  className="tracking-input"
                                />
                                <div className="tracking-actions">
                                  <button
                                    onClick={() => updateTracking(order.id)}
                                    className="save-btn"
                                  >
                                    <FiSave size={12} />
                                  </button>
                                  <button
                                    onClick={() => { setEditingTracking(null); setTrackingData({ id: '', link: '' }); }}
                                    className="cancel-btn"
                                  >
                                    <FiX size={12} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="tracking-display">
                                {order.tracking_id ? (
                                  <div className="tracking-info">
                                    <div className="tracking-id">{order.tracking_id}</div>
                                    {order.tracking_link && (
                                      <a href={order.tracking_link} target="_blank" rel="noopener noreferrer" className="tracking-link">
                                        Track
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setEditingTracking(order.id);
                                      setTrackingData({ id: order.tracking_id || '', link: order.tracking_link || '' });
                                    }}
                                    className="add-tracking-btn"
                                  >
                                    <FiTruck size={12} /> Add
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                          
                          <td className="date-cell">
                            <div className="order-date">
                              {formatDate(order.created_at)}
                              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                {formatTime(order.created_at)}
                              </div>
                            </div>
                          </td>
                          
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <motion.button
                                onClick={() => printOrder(order)}
                                className="action-btn print-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Print Order"
                              >
                                <FiPrinter size={14} />
                              </motion.button>
                              <motion.button
                                onClick={() => viewOrderDetails(order)}
                                className="action-btn view-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="View Details"
                              >
                                <FiEye size={14} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No orders found</h3>
                  <p>No orders match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div 
              className="order-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Order Details #{selectedOrder.id}</h2>
                <button 
                  className="close-modal-btn"
                  onClick={() => setShowOrderModal(false)}
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="order-info-grid">
                  <div className="info-section">
                    <h3>Customer Information</h3>
                    <div className="info-item">
                      <span className="label">Name:</span>
                      <span className="value">{selectedOrder.name || '—'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email:</span>
                      <span className="value">{selectedOrder.email || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedOrder.mobile}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address:</span>
                      <span className="value">{selectedOrder.address || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h3>Order Information</h3>
                    <div className="info-item">
                      <span className="label">Status:</span>
                      <span className={`value status-${selectedOrder.status}`}>{selectedOrder.status}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Date:</span>
                      <span className="value">
                        <div>{formatDate(selectedOrder.created_at)}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{formatTime(selectedOrder.created_at)}</div>
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Total:</span>
                      <span className="value amount">₹{parseFloat(selectedOrder.total).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="items-section">
                  <h3>Items Ordered</h3>
                  <div className="items-list">
                    {(() => {
                      const items = typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items;
                      return Array.isArray(items) ? items.map((item, index) => (
                        <div key={index} className="item-card">
                          <div className="item-info">
                            <div className="item-name">{item.name}</div>
                            <div className="item-details">{item.selectedWeight} × {item.qty}</div>
                          </div>
                        </div>
                      )) : <p>No items found</p>;
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="modal-btn secondary"
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </button>
                <button 
                  className="modal-btn primary"
                  onClick={() => {
                    printOrder(selectedOrder);
                    setShowOrderModal(false);
                  }}
                >
                  <FiPrinter size={16} /> Print Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
