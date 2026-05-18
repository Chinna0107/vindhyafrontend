import { motion } from 'framer-motion';
import { FiPhone, FiMail } from 'react-icons/fi';
import useSEO from '../hooks/useSEO';
import './Policy.css';

const sections = [
  {
    id: 'overview',
    title: 'Refund & Return Overview',
    content: (
      <>
        <p>At vindhya pickles and foods, we take pride in the quality of every jar we make. If you are not completely satisfied with your purchase, we are here to help.</p>
        <div className="policy-highlight">
          <strong>Our Promise:</strong> We offer refunds or replacements for damaged, defective, or incorrect products. All refund requests must be raised within <strong>48 hours</strong> of delivery.
        </div>
        <div className="policy-info-grid">
          <div className="policy-info-card"><div className="pic-label">Refund Window</div><div className="pic-value">48 Hours from Delivery</div></div>
          <div className="policy-info-card"><div className="pic-label">Refund Method</div><div className="pic-value">Original Payment Source</div></div>
          <div className="policy-info-card"><div className="pic-label">Processing Time</div><div className="pic-value">5–7 Business Days</div></div>
        </div>
      </>
    ),
  },
  {
    id: 'eligible',
    title: 'Eligible Refund Conditions',
    content: (
      <>
        <p>You are eligible for a full refund or replacement in the following cases:</p>
        <ul className="policy-list">
          <li>Product received is damaged, broken, or leaking</li>
          <li>Wrong product delivered (different from what was ordered)</li>
          <li>Product is expired or has a compromised seal</li>
          <li>Order not delivered within 15 business days of dispatch</li>
          <li>Duplicate payment charged for the same order</li>
        </ul>
        <div className="policy-warning">
          <strong>Not Eligible:</strong> Refunds are not applicable for change of mind, dislike of taste/spice level, or if the product has been partially consumed. Please check product descriptions carefully before ordering.
        </div>
      </>
    ),
  },
  {
    id: 'process',
    title: 'How to Raise a Refund Request',
    content: (
      <>
        <p>Follow these steps to initiate a refund or replacement:</p>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <thead><tr><th>Step</th><th>Action</th><th>Timeframe</th></tr></thead>
            <tbody>
              <tr><td><strong>Step 1</strong></td><td>Contact us via WhatsApp/email within 48 hours of delivery</td><td>Within 48 hrs of delivery</td></tr>
              <tr><td><strong>Step 2</strong></td><td>Share your Order ID, photos/video of the damaged product</td><td>Same day as contact</td></tr>
              <tr><td><strong>Step 3</strong></td><td>Our team reviews your request and approves/rejects within 24 hours</td><td>Within 24 hrs of request</td></tr>
              <tr><td><strong>Step 4</strong></td><td>Approved refunds are processed to your original payment method</td><td>5–7 business days</td></tr>
            </tbody>
          </table>
        </div>
        <div className="policy-highlight">
          <strong>Required:</strong> Clear photos or a short video of the damaged/incorrect product are mandatory for processing your refund request.
        </div>
      </>
    ),
  },
  {
    id: 'razorpay',
    title: 'Razorpay Payment Refunds',
    content: (
      <>
        <p>All payments on vindhyafoodsandsnacks.in are processed securely through <strong>Razorpay</strong>. Refunds are credited back to the original payment source:</p>
        <div className="razorpay-badge">💳 Powered by <span>Razorpay</span> — Secure Payment Gateway</div>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <thead><tr><th>Payment Method</th><th>Refund Timeline</th></tr></thead>
            <tbody>
              <tr><td>UPI (GPay, PhonePe, Paytm)</td><td>Instant – 2 Business Days</td></tr>
              <tr><td>Debit Card</td><td>5–7 Business Days</td></tr>
              <tr><td>Credit Card</td><td>5–7 Business Days (reflects in next billing cycle)</td></tr>
              <tr><td>Net Banking</td><td>3–5 Business Days</td></tr>
              <tr><td>Razorpay Wallet</td><td>Instant – 1 Business Day</td></tr>
              <tr><td>EMI</td><td>5–7 Business Days (EMI cancellation may apply)</td></tr>
            </tbody>
          </table>
        </div>
        <div className="policy-highlight">
          Razorpay refund timelines are subject to your bank's processing time. vindhya pickles and foods initiates the refund within <strong>2 business days</strong> of approval. The actual credit depends on your bank.
        </div>
        <p>For payment-related disputes, you can also contact Razorpay support at <strong>support@razorpay.com</strong> or call <strong>1800-123-1272</strong>.</p>
      </>
    ),
  },
  {
    id: 'cancellation',
    title: 'Order Cancellation',
    content: (
      <>
        <p>Orders can be cancelled <strong>before dispatch</strong> only. Once the order is shipped, cancellation is not possible.</p>
        <ul className="policy-list">
          <li>To cancel, contact us within <strong>2 hours</strong> of placing the order</li>
          <li>Cancellations after 2 hours but before dispatch are subject to a ₹50 processing fee</li>
          <li>Full refund is issued for cancellations before dispatch</li>
          <li>No cancellations accepted after the order has been dispatched</li>
        </ul>
      </>
    ),
  },
  {
    id: 'returns',
    title: 'Return of Products',
    content: (
      <>
        <p>Due to the perishable nature of food products, we generally <strong>do not accept physical returns</strong>. However, in cases of damaged or incorrect products:</p>
        <ul className="policy-list">
          <li>We may request you to return the product at our cost</li>
          <li>A prepaid return label will be provided if return is required</li>
          <li>Do not return products without prior approval from our team</li>
          <li>Unapproved returns will not be eligible for refund</li>
        </ul>
      </>
    ),
  },
];

export default function RefundPolicy() {
  useSEO({
    title: 'Refund & Return Policy — vindhya pickles and foods',
    description: 'vindhya pickles and foods refund and return policy. Razorpay payment refunds processed in 5–7 business days. Damaged or wrong products eligible for full refund within 48 hours.',
    canonical: '/refund-policy',
  });

  return (
    <div className="policy-page page-enter">
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="policy-hero-icon">↩️</div>
            <h1>Refund & Return Policy</h1>
            <p>We stand behind the quality of every jar. Here's how we handle refunds, returns, and cancellations.</p>
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
            <h3>Need Help With a Refund?</h3>
            <p>Contact us within 48 hours of delivery — Mon–Sat, 9 AM – 8 PM IST</p>
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
