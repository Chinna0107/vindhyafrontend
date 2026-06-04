import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiTruck, FiX, FiAlertTriangle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart } = useCart();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  
  const getPrice = (item) =>
    item.prices?.find(p => p.weight === item.selectedWeight)?.price || item.prices?.[0]?.price || 0;

  const subtotal = items.reduce((sum, i) => sum + getPrice(i) * i.qty, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  const handleRemoveClick = (item) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeItem(itemToRemove.id, itemToRemove.selectedWeight);
      setShowRemoveModal(false);
      setItemToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  return (
    <div className="cart-page page-enter">
      {/* PAGE HERO */}
      <section className="cart-hero">
        <div className="cart-hero-bg" />
        <div className="container cart-hero-content">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="cart-hero-tag">🛒 Your Cart</span>
            <h1>Shopping Cart</h1>
            <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </motion.div>
        </div>
        <div className="cart-hero-wave">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      <div className="container cart-layout">
        {items.length === 0 ? (
          <motion.div className="cart-empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}>
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any pickles yet!</p>
            <Link to="/products" className="btn-primary">
              <span>Browse Products</span>
              <FiArrowRight />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* CART ITEMS */}
            <div className="cart-items-col">
              <div className="cart-items-header">
                <h2>Order Items</h2>
                <button className="clear-btn" onClick={() => clearCart()}>Clear All</button>
              </div>

              <AnimatePresence>
                {items.map((item) => {
                  const price = getPrice(item);
                  const origPrice = item.prices?.find(p => p.weight === item.selectedWeight)?.originalPrice || price;
                  return (
                    <motion.div key={`${item.id}-${item.selectedWeight}`} className="cart-item"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}>
                      <Link to={`/products/${encodeURIComponent(item.slug || '')}`} className="cart-item-img">
                        <img src={item.images?.[0]} alt={item.name} />
                      </Link>
                      <div className="cart-item-info">
                        <div className="cart-item-top">
                          <div>
                            <span className="cart-item-tag">{item.tag}</span>
                            <Link to={`/products/${encodeURIComponent(item.slug || '')}`}><h3>{item.name}</h3></Link>
                            <p className="cart-item-weight">{item.selectedWeight} · {'🌶️'.repeat(item.spice)}</p>
                          </div>
                          <div className="cart-item-actions">
                            <button 
                              className="remove-btn" 
                              onClick={() => handleRemoveClick(item)}
                              title="Remove from cart"
                            >
                              <FiTrash2 size={16} />
                              <span className="remove-text">Remove</span>
                            </button>
                          </div>
                        </div>
                        <div className="cart-item-bottom">
                          <div className="cart-price-group">
                            <span className="cart-price">₹{price * item.qty}</span>
                            <span className="cart-unit">₹{price} each</span>
                            {origPrice > price && (
                              <span className="cart-orig">₹{origPrice}</span>
                            )}
                          </div>
                          <div className="qty-control">
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQty(item.id, item.selectedWeight, -1)}>
                              <FiMinus size={14} />
                            </motion.button>
                            <span>{item.qty}</span>
                            <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQty(item.id, item.selectedWeight, 1)}>
                              <FiPlus size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* DELIVERY BANNER */}
              <div className="delivery-banner">
                <FiTruck size={18} />
                <span>🎉 <strong>FREE delivery</strong> on all orders!</span>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <motion.div className="cart-summary"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}>
              <h2>Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="free">FREE</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <motion.button className="checkout-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/checkout')}>
                <FiShoppingBag size={18} />
                <span>Proceed to Checkout</span>
                <FiArrowRight size={16} />
              </motion.button>

              <Link to="/products" className="continue-shopping">
                ← Continue Shopping
              </Link>

              {/* TRUST BADGES */}
              <div className="trust-badges">
                <div className="trust-badge"><span>🔒</span><p>Secure Payment</p></div>
                <div className="trust-badge"><span>🚚</span><p>Fast Delivery</p></div>
                <div className="trust-badge"><span>↩️</span><p>Easy Returns</p></div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {showRemoveModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cancelRemove}
          >
            <motion.div 
              className="remove-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-icon">
                  <FiAlertTriangle size={24} />
                </div>
                <h3>Remove Item?</h3>
                <button className="modal-close" onClick={cancelRemove}>
                  <FiX size={20} />
                </button>
              </div>
              
              {itemToRemove && (
                <div className="modal-content">
                  <div className="item-preview">
                    <img src={itemToRemove.images?.[0]} alt={itemToRemove.name} />
                    <div className="item-details">
                      <h4>{itemToRemove.name}</h4>
                      <p>{itemToRemove.selectedWeight} • Qty: {itemToRemove.qty}</p>
                    </div>
                  </div>
                  <p className="modal-message">
                    Are you sure you want to remove this item from your cart?
                  </p>
                </div>
              )}
              
              <div className="modal-actions">
                <button className="modal-btn cancel" onClick={cancelRemove}>
                  Cancel
                </button>
                <button className="modal-btn confirm" onClick={confirmRemove}>
                  <FiTrash2 size={16} />
                  Remove Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
