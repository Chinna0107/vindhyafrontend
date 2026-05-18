import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiArrowLeft, FiTag, FiTruck, FiCheck,
  FiUser, FiPhone, FiMapPin, FiMail,
  FiCreditCard, FiEdit2, FiShield
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import API from '../config';
import './Checkout.css';

const COUPONS = { OM10: 0, PICKLE20: 0, FIRST15: 0, GET10: 10 };

const STEPS = ['Cart & Promo', 'Review Order', 'Payment'];

function StepBar({ current }) {
  return (
    <div className="ck-stepbar">
      {STEPS.map((label, i) => (
        <div key={i} className={`ck-step ${i < current ? 'done' : i === current ? 'active' : ''}`}>
          <div className="ck-step-circle">
            {i < current ? <FiCheck size={14} /> : <span>{i + 1}</span>}
          </div>
          <span className="ck-step-label">{label}</span>
          {i < STEPS.length - 1 && <div className="ck-step-line" />}
        </div>
      ))}
    </div>
  );
}

function ItemRow({ item, getPrice }) {
  const price = getPrice(item);
  return (
    <div className="ck-item">
      <img src={item.images[0]} alt={item.name} />
      <div className="ck-item-info">
        <div className="ck-item-name">{item.name}</div>
        <div className="ck-item-meta">{item.selectedWeight} · Qty {item.qty}</div>
      </div>
      <div className="ck-item-price">₹{price * item.qty}</div>
    </div>
  );
}

/* ─── STEP 1 ─── */
function Step1({ items, setItems, coupon, setCoupon, couponApplied, setCouponApplied, couponDiscount, setCouponDiscount, onNext }) {
  const [couponError, setCouponError] = useState('');

  const getPrice = (item) =>
    item.prices.find(p => p.weight === item.selectedWeight)?.price || item.prices[0].price;

  const updateQty = (id, weight, delta) =>
    setItems(prev => prev.map(i =>
      i.id === id && i.selectedWeight === weight
        ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ));

  const removeItem = (id, weight) =>
    setItems(prev => prev.filter(i => !(i.id === id && i.selectedWeight === weight)));

  const subtotal = items.reduce((s, i) => s + getPrice(i) * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * couponDiscount / 100) : 0;
  const delivery = 0;
  const total = subtotal - discount + delivery;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setCouponApplied(true);
      setCouponDiscount(COUPONS[code]);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  return (
    <div className="ck-step1">
      <div className="ck-items-col">
        <h3 className="ck-section-title">Your Items ({items.length})</h3>
        <AnimatePresence>
          {items.map(item => {
            const price = getPrice(item);
            const orig = item.prices.find(p => p.weight === item.selectedWeight)?.originalPrice || price;
            return (
              <motion.div key={`${item.id}-${item.selectedWeight}`} className="ck-cart-item"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }} transition={{ duration: 0.25 }}>
                <img src={item.images[0]} alt={item.name} className="ck-cart-img" />
                <div className="ck-cart-info">
                  <div className="ck-cart-name">{item.name}</div>
                  <div className="ck-cart-meta">{item.selectedWeight} · {'🌶️'.repeat(item.spice)}</div>
                  <div className="ck-cart-prices">
                    <span className="ck-price">₹{price * item.qty}</span>
                    {orig > price && <span className="ck-orig">₹{orig}</span>}
                  </div>
                </div>
                <div className="ck-cart-actions">
                  <div className="ck-qty">
                    <button onClick={() => updateQty(item.id, item.selectedWeight, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.selectedWeight, 1)}>+</button>
                  </div>
                  <button className="ck-remove" onClick={() => removeItem(item.id, item.selectedWeight)}>✕</button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="ck-empty">
            <span>🛒</span>
            <p>Your cart is empty</p>
            <Link to="/products" className="btn-primary"><span>Shop Now</span><FiArrowRight /></Link>
          </div>
        )}
      </div>

      <div className="ck-summary-col">
        <h3 className="ck-section-title">Order Summary</h3>

        <div className="ck-coupon-box">
          <FiTag size={15} />
          <input
            type="text" placeholder="Promo code (try GET10)"
            value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
            disabled={couponApplied}
          />
          <button className={`ck-coupon-btn ${couponApplied ? 'applied' : ''}`}
            onClick={applyCoupon} disabled={couponApplied}>
            {couponApplied ? <FiCheck size={14} /> : 'Apply'}
          </button>
        </div>
        {couponApplied && <p className="ck-coupon-ok">🎉 {couponDiscount}% discount applied!</p>}
        {couponError && <p className="ck-coupon-err">{couponError}</p>}

        <div className="ck-summary-rows">
          <div className="ck-summary-row">
            <span>Subtotal</span><span>₹{subtotal}</span>
          </div>
          {couponApplied && (
            <div className="ck-summary-row green">
              <span>Promo ({coupon.toUpperCase()})</span><span>−₹{discount}</span>
            </div>
          )}
          <div className="ck-summary-row">
            <span>Delivery</span><span className="green">FREE</span>
          </div>
          <div className="ck-summary-divider" />
          <div className="ck-summary-row total">
            <span>Total</span><span>₹{total}</span>
          </div>
        </div>

        <motion.button className="ck-next-btn" onClick={onNext}
          disabled={items.length === 0}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <span>Continue to Review</span><FiArrowRight size={16} />
        </motion.button>

        <div className="ck-trust">
          <span>🔒 Secure Checkout</span>
          <span>🚚 Fast Delivery</span>
          <span>↩️ Easy Returns</span>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 2 ─── */
function Step2({ items, coupon, couponApplied, couponDiscount, address, setAddress, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const getPrice = (item) =>
    item.prices.find(p => p.weight === item.selectedWeight)?.price || item.prices[0].price;

  const subtotal = items.reduce((s, i) => s + getPrice(i) * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * couponDiscount / 100) : 0;
  const delivery = 0;
  const total = subtotal - discount + delivery;

  const validate = () => {
    const e = {};
    if (!address.name.trim()) e.name = 'Required';
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone)) e.phone = 'Valid 10-digit number required';
    if (!address.email.trim() || !/\S+@\S+\.\S+/.test(address.email)) e.email = 'Valid email required';
    if (!address.line1.trim()) e.line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state.trim()) e.state = 'Required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) e.pincode = '6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const field = (key, label, icon, type = 'text', placeholder = '') => (
    <div className="ck-field">
      <label>{icon} {label}</label>
      <input type={type} placeholder={placeholder || label}
        value={address[key]}
        onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
        className={errors[key] ? 'error' : ''}
      />
      {errors[key] && <span className="ck-field-err">{errors[key]}</span>}
    </div>
  );

  return (
    <div className="ck-step2">
      <div className="ck-address-col">
        <h3 className="ck-section-title">Delivery Address</h3>
        <div className="ck-form-grid">
          {field('name', 'Full Name', <FiUser size={13} />)}
          {field('phone', 'Phone', <FiPhone size={13} />, 'tel', '10-digit mobile')}
          {field('email', 'Email', <FiMail size={13} />, 'email')}
          <div className="ck-field full">
            <label><FiMapPin size={13} /> Address Line 1</label>
            <input type="text" placeholder="House / Flat / Street"
              value={address.line1}
              onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))}
              className={errors.line1 ? 'error' : ''}
            />
            {errors.line1 && <span className="ck-field-err">{errors.line1}</span>}
          </div>
          <div className="ck-field full">
            <label>Address Line 2 <span className="optional">(optional)</span></label>
            <input type="text" placeholder="Landmark / Area"
              value={address.line2}
              onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))}
            />
          </div>
          {field('city', 'City', <FiMapPin size={13} />)}
          {field('state', 'State', <FiMapPin size={13} />)}
          {field('pincode', 'Pincode', <FiMapPin size={13} />, 'text', '6-digit pincode')}
        </div>
      </div>

      <div className="ck-review-col">
        <h3 className="ck-section-title">Order Review</h3>
        <div className="ck-review-items">
          {items.map(item => (
            <ItemRow key={`${item.id}-${item.selectedWeight}`} item={item} getPrice={getPrice} />
          ))}
        </div>

        <div className="ck-summary-rows">
          <div className="ck-summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          {couponApplied && (
            <div className="ck-summary-row green"><span>Promo</span><span>−₹{discount}</span></div>
          )}
          <div className="ck-summary-row">
            <span>Delivery</span><span className="green">FREE</span>
          </div>
          <div className="ck-summary-divider" />
          <div className="ck-summary-row total"><span>Total</span><span>₹{total}</span></div>
        </div>

        <div className="ck-btn-row">
          <button className="ck-back-btn" onClick={onBack}><FiArrowLeft size={15} /> Back</button>
          <motion.button className="ck-next-btn" onClick={handleNext}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <span>Proceed to Pay</span><FiArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 3 ─── */
function Step3({ items, coupon, couponApplied, couponDiscount, address, onBack, onSuccess }) {
  const [paying, setPaying] = useState(false);

  const getPrice = (item) =>
    item.prices.find(p => p.weight === item.selectedWeight)?.price || item.prices[0].price;

  const subtotal = items.reduce((s, i) => s + getPrice(i) * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * couponDiscount / 100) : 0;
  const delivery = 0;
  const total = subtotal - discount + delivery;

  const loadRazorpay = () =>
    new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const handlePay = async () => {
    setPaying(true);
    const loaded = await loadRazorpay();
    if (!loaded) { alert('Failed to load Razorpay. Check your connection.'); setPaying(false); return; }

    try {
      const orderRes = await fetch(`${API}/orders/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Vindhya Pickles & Foods',
        description: `Order of ${items.length} item(s)`,
        image: '/logo.jpeg',
        prefill: { name: address.name, email: address.email, contact: address.phone },
        notes: { address: `${address.line1}, ${address.city}, ${address.state} - ${address.pincode}` },
        theme: { color: '#ebb812' },
        handler: async (response) => {
          const verifyRes = await fetch(`${API}/orders/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                mobile: address.phone,
                email: address.email,
                name: address.name,
                items, subtotal, discount, delivery, total,
                coupon: couponApplied ? coupon : null,
                address: `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} - ${address.pincode}`,
              },
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) { alert(verifyData.error); setPaying(false); return; }
          onSuccess(verifyData.paymentId);
        },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => { alert('Payment failed. Please try again.'); setPaying(false); });
      rzp.open();
    } catch (err) {
      alert(err.message);
      setPaying(false);
    }
  };

  return (
    <div className="ck-step3">
      <div className="ck-payment-col">
        <h3 className="ck-section-title">Payment Method</h3>

        <div className="ck-pay-methods">
          <label className="ck-pay-option selected">
            <div className="ck-pay-icon"><FiCreditCard size={22} /></div>
            <div>
              <div className="ck-pay-name">Pay Online</div>
              <div className="ck-pay-sub">UPI · Cards · Net Banking · Wallets via Razorpay</div>
            </div>
            <div className="ck-pay-badge">Recommended</div>
          </label>
        </div>

        <div className="ck-address-review">
          <div className="ck-address-review-header">
            <FiMapPin size={14} /> Delivering to
            <button className="ck-edit-addr" onClick={onBack}><FiEdit2 size={13} /> Edit</button>
          </div>
          <div className="ck-address-review-body">
            <strong>{address.name}</strong> · {address.phone}<br />
            {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
            {address.city}, {address.state} — {address.pincode}
          </div>
        </div>

        <div className="ck-secure-note">
          <FiShield size={14} /> 100% secure & encrypted payment
        </div>
      </div>

      <div className="ck-review-col">
        <h3 className="ck-section-title">Final Summary</h3>
        <div className="ck-review-items">
          {items.map(item => (
            <ItemRow key={`${item.id}-${item.selectedWeight}`} item={item} getPrice={getPrice} />
          ))}
        </div>

        <div className="ck-summary-rows">
          <div className="ck-summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          {couponApplied && (
            <div className="ck-summary-row green"><span>Promo ({coupon.toUpperCase()})</span><span>−₹{discount}</span></div>
          )}
          <div className="ck-summary-row">
            <span>Delivery</span><span className="green">FREE</span>
          </div>
          <div className="ck-summary-divider" />
          <div className="ck-summary-row total"><span>Total Payable</span><span>₹{total}</span></div>
        </div>

        <div className="ck-btn-row">
          <button className="ck-back-btn" onClick={onBack}><FiArrowLeft size={15} /> Back</button>
          <motion.button className="ck-pay-btn" onClick={handlePay} disabled={paying}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            {paying ? <span className="ck-spinner" /> : <><FiCreditCard size={16} /><span>Pay ₹{total}</span></>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── SUCCESS ─── */
function Success({ paymentId, total, navigate }) {
  return (
    <motion.div className="ck-success"
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}>
      
      <motion.div className="ck-success-icon-container"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}>
        <div className="ck-success-icon">
          <motion.div className="ck-checkmark"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}>
            <svg viewBox="0 0 52 52" className="ck-checkmark-svg">
              <circle className="ck-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <motion.path 
                className="ck-checkmark-check" 
                fill="none" 
                d="m14.1 27.2l7.1 7.2 16.7-16.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.5, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}>
        Order Placed Successfully!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}>
        Thank you for your order. We'll start preparing your delicious pickles right away!
      </motion.p>
      
      <motion.div className="ck-success-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}>
        <div className="ck-payment-id">Payment ID: <strong>{paymentId}</strong></div>
        <div className="ck-success-total">Total Paid: <strong>₹{total}</strong></div>
      </motion.div>
      
      <motion.div className="ck-success-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}>
        <motion.button className="btn-primary" onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}>
          <span>Back to Home</span><FiArrowRight />
        </motion.button>
        <Link to="/products" className="ck-back-btn">Continue Shopping</Link>
      </motion.div>
    </motion.div>
  );
}

/* ─── MAIN ─── */
export default function Checkout() {
  const navigate = useNavigate();
  const { items: cartItems, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [items, setItems] = useState(cartItems);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [address, setAddress] = useState({
    name: '', phone: '', email: '', line1: '', line2: '', city: '', state: '', pincode: ''
  });
  const [paymentId, setPaymentId] = useState(null);

  const getPrice = (item) =>
    item.prices.find(p => p.weight === item.selectedWeight)?.price || item.prices[0].price;
  const subtotal = items.reduce((s, i) => s + getPrice(i) * i.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * couponDiscount / 100) : 0;
  const delivery = 0;
  const total = subtotal - discount + delivery;

  if (paymentId) return <div className="ck-page page-enter"><div className="container"><Success paymentId={paymentId} total={total} navigate={navigate} /></div></div>;

  return (
    <div className="ck-page page-enter">
      <div className="ck-hero">
        <div className="ck-hero-bg" />
        <div className="container ck-hero-content">
          <h1>Checkout</h1>
          <p>Complete your order in 3 simple steps</p>
        </div>
      </div>

      <div className="container ck-body">
        <StepBar current={step} />

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>

            {step === 0 && (
              <Step1
                items={items} setItems={setItems}
                coupon={coupon} setCoupon={setCoupon}
                couponApplied={couponApplied} setCouponApplied={setCouponApplied}
                couponDiscount={couponDiscount} setCouponDiscount={setCouponDiscount}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <Step2
                items={items} coupon={coupon}
                couponApplied={couponApplied} couponDiscount={couponDiscount}
                address={address} setAddress={setAddress}
                onNext={() => setStep(2)} onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <Step3
                items={items} coupon={coupon}
                couponApplied={couponApplied} couponDiscount={couponDiscount}
                address={address}
                onBack={() => setStep(1)}
                onSuccess={(pid) => { clearCart(); setPaymentId(pid); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
