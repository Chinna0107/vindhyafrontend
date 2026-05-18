import { motion } from 'framer-motion';
import { FiPhone, FiMail } from 'react-icons/fi';
import useSEO from '../hooks/useSEO';
import './Policy.css';

const sections = [
  {
    id: 'processing',
    title: 'Order Processing Time',
    content: (
      <>
        <p>All orders placed on <strong>vindhyapicklesandfoods.in</strong> are processed within <strong>1–2 business days</strong> after payment confirmation. Orders placed on weekends or public holidays will be processed on the next working day.</p>
        <div className="policy-highlight">
          <strong>Note:</strong> During peak seasons (festivals, holidays), processing may take up to 3 business days. We will notify you via email/SMS if there is any delay.
        </div>
        <div className="policy-info-grid">
          <div className="policy-info-card"><div className="pic-label">Processing Time</div><div className="pic-value">1–2 Business Days</div></div>
          <div className="policy-info-card"><div className="pic-label">Order Cutoff</div><div className="pic-value">5:00 PM IST</div></div>
          <div className="policy-info-card"><div className="pic-label">Working Days</div><div className="pic-value">Mon – Sat</div></div>
        </div>
      </>
    ),
  },
  {
    id: 'delivery',
    title: 'Delivery Timeframes',
    content: (
      <>
        <p>We deliver across India through trusted courier partners. Estimated delivery times from the date of dispatch:</p>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <thead><tr><th>Location</th><th>Estimated Delivery</th><th>Shipping Charge</th></tr></thead>
            <tbody>
              <tr><td>Hyderabad & Secunderabad</td><td>1–2 Business Days</td><td>₹40 (Free above ₹499)</td></tr>
              <tr><td>Andhra Pradesh & Telangana</td><td>2–3 Business Days</td><td>₹60 (Free above ₹499)</td></tr>
              <tr><td>Metro Cities (Bangalore, Chennai, Mumbai, Delhi)</td><td>3–5 Business Days</td><td>₹80 (Free above ₹499)</td></tr>
              <tr><td>Rest of India</td><td>5–7 Business Days</td><td>₹100 (Free above ₹699)</td></tr>
              <tr><td>Remote / Hilly Areas</td><td>7–10 Business Days</td><td>₹150</td></tr>
            </tbody>
          </table>
        </div>
        <div className="policy-highlight">
          <strong>🚚 Free Shipping:</strong> Orders above ₹499 qualify for free shipping to most locations across India.
        </div>
      </>
    ),
  },
  {
    id: 'tracking',
    title: 'Order Tracking',
    content: (
      <>
        <p>Once your order is dispatched, you will receive a <strong>tracking number</strong> via SMS and email. You can use this to track your shipment on the courier partner's website.</p>
        <ul className="policy-list">
          <li>Tracking details are sent within 24 hours of dispatch</li>
          <li>You can also track your order from your Customer Dashboard under "My Orders"</li>
          <li>For any tracking issues, contact us at <strong>+91 9949085469</strong></li>
        </ul>
      </>
    ),
  },
  {
    id: 'packaging',
    title: 'Packaging',
    content: (
      <>
        <p>We take great care in packaging our pickles to ensure they reach you in perfect condition:</p>
        <ul className="policy-list">
          <li>All jars are sealed with tamper-proof lids and food-grade packaging</li>
          <li>Bubble wrap and foam padding are used for fragile glass jars</li>
          <li>Outer boxes are sturdy corrugated cardboard to prevent breakage</li>
          <li>Each package includes an invoice and a thank-you note</li>
        </ul>
        <div className="policy-highlight">
          If your order arrives with broken or damaged packaging, please photograph it immediately and contact us within <strong>24 hours</strong> of delivery.
        </div>
      </>
    ),
  },
  {
    id: 'failed',
    title: 'Failed Delivery & Re-attempts',
    content: (
      <>
        <p>Our courier partners will attempt delivery <strong>up to 3 times</strong>. If delivery fails due to an incorrect address or unavailability:</p>
        <ul className="policy-list">
          <li>The package will be held at the nearest courier hub for 5 days</li>
          <li>You will be notified via SMS/email to arrange re-delivery</li>
          <li>After 5 days, the package will be returned to us</li>
          <li>Re-shipping charges will apply for returned orders</li>
        </ul>
        <div className="policy-warning">
          Please ensure your delivery address and phone number are correct at the time of placing the order. vindhya pickles and foods is not responsible for delays caused by incorrect address details.
        </div>
      </>
    ),
  },
  {
    id: 'international',
    title: 'International Shipping',
    content: (
      <>
        <p>Currently, we <strong>do not offer international shipping</strong>. We deliver only within India. We are working on expanding our delivery to international locations in the future.</p>
        <p>For bulk or corporate orders outside India, please contact us directly at <strong>vindhyapicklesandfoods@gmail.com</strong>.</p>
      </>
    ),
  },
];

export default function ShippingPolicy() {
  useSEO({
    title: 'Shipping Policy — Delivery & Tracking',
    description: 'vindhya pickles and foods shipping policy. Free delivery above ₹499, pan-India delivery in 1–7 business days. Learn about processing times, tracking, and packaging.',
    canonical: '/shipping-policy',
  });

  return (
    <div className="policy-page page-enter">
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="policy-hero-icon">🚚</div>
            <h1>Shipping Policy</h1>
            <p>Everything you need to know about how we deliver your favourite pickles safely to your doorstep.</p>
            <div className="policy-updated">📅 Last updated: January 2025</div>
          </motion.div>
        </div>
      </section>

      <div className="policy-body">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="policy-toc">
            <h3>📋 Contents</h3>
            <ol>
              {sections.map(s => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
            </ol>
          </div>

          {sections.map((s, i) => (
            <div key={s.id} id={s.id} className="policy-section">
              <div className="policy-section-header">
                <div className="policy-section-num">{String(i + 1).padStart(2, '0')}</div>
                <h2>{s.title}</h2>
              </div>
              {s.content}
            </div>
          ))}

          <div className="policy-contact-card">
            <h3>Questions About Your Shipment?</h3>
            <p>Our team is available Mon–Sat, 9 AM – 8 PM IST</p>
            <div className="policy-contact-methods">
              <a href="tel:+919949085469" className="policy-contact-link"><FiPhone /> +91 9949085469</a>
              <a href="mailto:vindhyapicklesandfoods@gmail.com" className="policy-contact-link"><FiMail /> vindhyapicklesandfoods@gmail.com</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
