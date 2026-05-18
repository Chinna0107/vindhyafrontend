import { motion } from 'framer-motion';
import { FiPhone, FiMail } from 'react-icons/fi';
import useSEO from '../hooks/useSEO';
import './Policy.css';

const sections = [
  {
    id: 'collection',
    title: 'Information We Collect',
    content: (
      <>
        <p>When you use vindhyafoodsandsnacks.in, we collect the following types of information:</p>
        <div className="policy-table-wrap">
          <table className="policy-table">
            <thead><tr><th>Type</th><th>Data Collected</th><th>Purpose</th></tr></thead>
            <tbody>
              <tr><td><strong>Account Info</strong></td><td>Name, email address, mobile number</td><td>Account creation, order communication</td></tr>
              <tr><td><strong>Order Info</strong></td><td>Delivery address, order history, payment status</td><td>Order processing and delivery</td></tr>
              <tr><td><strong>Payment Info</strong></td><td>Transaction ID, payment method type (via Razorpay)</td><td>Payment processing — we do NOT store card details</td></tr>
              <tr><td><strong>Device Info</strong></td><td>IP address, browser type, device type</td><td>Security, fraud prevention, analytics</td></tr>
              <tr><td><strong>Usage Data</strong></td><td>Pages visited, products viewed, time on site</td><td>Improving user experience</td></tr>
            </tbody>
          </table>
        </div>
        <div className="policy-highlight">
          <strong>We do NOT collect or store:</strong> Credit/debit card numbers, CVV, UPI PINs, or any sensitive banking credentials. All payment data is handled exclusively by <strong>Razorpay</strong>.
        </div>
      </>
    ),
  },
  {
    id: 'razorpay',
    title: 'Razorpay Payment Processing',
    content: (
      <>
        <p>All payments on our website are processed by <strong>Razorpay Software Private Limited</strong>, a PCI-DSS compliant payment gateway.</p>
        <div className="razorpay-badge">🔒 Secured by <span>Razorpay</span> — PCI-DSS Level 1 Certified</div>
        <ul className="policy-list">
          <li>Razorpay collects and processes your payment information directly on their secure servers</li>
          <li>vindhya pickles and foods only receives a transaction confirmation and order ID — never your card or banking details</li>
          <li>Razorpay uses 256-bit SSL encryption for all transactions</li>
          <li>Your payment data is governed by Razorpay's Privacy Policy: <strong>razorpay.com/privacy</strong></li>
        </ul>
        <p>By making a payment on our website, you also agree to Razorpay's Terms of Service and Privacy Policy.</p>
      </>
    ),
  },
  {
    id: 'usage',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="policy-list">
          <li>Processing and fulfilling your orders</li>
          <li>Sending order confirmations, shipping updates, and delivery notifications</li>
          <li>Providing customer support and responding to queries</li>
          <li>Improving our website, products, and services</li>
          <li>Sending promotional offers and updates (only with your consent)</li>
          <li>Preventing fraud and ensuring platform security</li>
          <li>Complying with legal obligations</li>
        </ul>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Information Sharing & Disclosure',
    content: (
      <>
        <p>We do <strong>not sell, rent, or trade</strong> your personal information to third parties. We share your data only in the following limited circumstances:</p>
        <ul className="policy-list">
          <li><strong>Courier Partners:</strong> Your name, address, and phone number are shared with our delivery partners to fulfil your order</li>
          <li><strong>Razorpay:</strong> Payment information is shared with Razorpay for transaction processing</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or government authority</li>
          <li><strong>Business Transfer:</strong> In the event of a merger or acquisition, your data may be transferred to the new entity</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    content: (
      <>
        <p>Our website uses cookies to enhance your browsing experience:</p>
        <ul className="policy-list">
          <li><strong>Essential Cookies:</strong> Required for the website to function (cart, login sessions)</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (Google Analytics)</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
        </ul>
        <p>You can disable cookies in your browser settings, but this may affect some website functionality such as the shopping cart.</p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your Rights & Data Control',
    content: (
      <>
        <p>You have the following rights regarding your personal data:</p>
        <ul className="policy-list">
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
          <li><strong>Portability:</strong> Request your data in a portable format</li>
        </ul>
        <p>To exercise any of these rights, contact us at <strong>vindhyapicklesandfoods@gmail.com</strong>. We will respond within 30 days.</p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Data Security',
    content: (
      <>
        <p>We implement industry-standard security measures to protect your personal information:</p>
        <ul className="policy-list">
          <li>HTTPS/SSL encryption on all pages</li>
          <li>Secure, encrypted storage of passwords (bcrypt hashing)</li>
          <li>JWT-based authentication for customer accounts</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access to personal data is restricted to authorised personnel only</li>
        </ul>
        <div className="policy-warning">
          While we take all reasonable precautions, no method of internet transmission is 100% secure. We cannot guarantee absolute security of your data.
        </div>
      </>
    ),
  },
  {
    id: 'children',
    title: "Children's Privacy",
    content: (
      <p>Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete it.</p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to This Policy',
    content: (
      <>
        <p>We may update this Privacy Policy from time to time. When we make significant changes, we will:</p>
        <ul className="policy-list">
          <li>Update the "Last Updated" date at the top of this page</li>
          <li>Notify registered customers via email for material changes</li>
          <li>Display a notice on our website</li>
        </ul>
        <p>Continued use of our website after changes constitutes acceptance of the updated policy.</p>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy — vindhya pickles and foods',
    description: 'vindhya pickles and foods privacy policy. Learn how we collect, use, and protect your personal data. Payments secured by Razorpay. We never sell your data.',
    canonical: '/privacy-policy',
  });

  return (
    <div className="policy-page page-enter">
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="policy-hero-icon">🔒</div>
            <h1>Privacy Policy</h1>
            <p>We respect your privacy. Here's exactly what data we collect, how we use it, and how we keep it safe.</p>
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
            <h3>Privacy Concerns or Data Requests?</h3>
            <p>Contact our team — we respond within 30 days</p>
            <div className="policy-contact-methods">
              <a href="tel:+918142128079" className="policy-contact-link"><FiPhone /> +91 8142128079</a>
              <a href="mailto:vindhyapicklesandfoods@gmail.com" className="policy-contact-link"><FiMail /> vindhyapicklesandfoods@gmail.com</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
