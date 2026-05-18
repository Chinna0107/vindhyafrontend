import { motion } from 'framer-motion';
import { FiPhone, FiMail } from 'react-icons/fi';
import useSEO from '../hooks/useSEO';
import './Policy.css';

const sections = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    content: (
      <>
        <p>By accessing or using <strong>vindhyapicklesandfoods.in</strong> ("the Website"), placing an order, or creating an account, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.</p>
        <div className="policy-highlight">
          These Terms constitute a legally binding agreement between you ("Customer") and <strong>vindhya pickles and foods</strong>, owned and operated by <strong>Divya</strong>, Amaravathi, Guntur, Andhra Pradesh – 500000.
        </div>
      </>
    ),
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Account',
    content: (
      <>
        <p>To use our website and place orders, you must:</p>
        <ul className="policy-list">
          <li>Be at least 18 years of age</li>
          <li>Provide accurate and complete registration information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Not share your account with others</li>
          <li>Notify us immediately of any unauthorised use of your account</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
      </>
    ),
  },
  {
    id: 'products',
    title: 'Products & Pricing',
    content: (
      <>
        <p>All products listed on our website are subject to availability. We reserve the right to:</p>
        <ul className="policy-list">
          <li>Modify product descriptions, images, and prices without prior notice</li>
          <li>Discontinue any product at any time</li>
          <li>Limit quantities available for purchase</li>
          <li>Refuse or cancel orders at our discretion</li>
        </ul>
        <div className="policy-highlight">
          <strong>Pricing:</strong> All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes. Shipping charges are additional and calculated at checkout based on your location.
        </div>
        <div className="policy-warning">
          Product images are for illustrative purposes only. Actual product appearance may vary slightly due to natural ingredients and handcrafted preparation.
        </div>
      </>
    ),
  },
  {
    id: 'orders',
    title: 'Orders & Contract',
    content: (
      <>
        <p>When you place an order on our website:</p>
        <ul className="policy-list">
          <li>Your order is an offer to purchase the product(s) at the listed price</li>
          <li>A contract is formed only when we send you an <strong>Order Confirmation</strong> email</li>
          <li>We reserve the right to reject any order due to stock unavailability, pricing errors, or suspected fraud</li>
          <li>If we reject your order after payment, a full refund will be issued within 5–7 business days</li>
        </ul>
      </>
    ),
  },
  {
    id: 'payments',
    title: 'Payments via Razorpay',
    content: (
      <>
        <p>All payments on vindhyapicklesandfoods.in are processed through <strong>Razorpay</strong>, a secure and RBI-compliant payment gateway.</p>
        <div className="razorpay-badge">💳 Payments Powered by <span>Razorpay</span></div>
        <ul className="policy-list">
          <li>We accept UPI, Credit Cards, Debit Cards, Net Banking, Wallets, and EMI via Razorpay</li>
          <li>All transactions are encrypted using 256-bit SSL technology</li>
          <li>vindhya pickles and foods does not store any card or banking credentials</li>
          <li>Payment disputes must be raised within 30 days of the transaction</li>
          <li>Chargeback requests must be made through your bank or Razorpay support</li>
        </ul>
        <div className="policy-highlight">
          By completing a payment, you also agree to <strong>Razorpay's Terms of Service</strong> available at razorpay.com/terms. Vindhya Pickles & Foods is not responsible for payment failures caused by your bank or Razorpay's systems.
        </div>
      </>
    ),
  },
  {
    id: 'intellectual',
    title: 'Intellectual Property',
    content: (
      <>
        <p>All content on this website — including but not limited to text, images, logos, product names, recipes, and design — is the exclusive property of <strong>vindhya pickles and foods</strong> and is protected by applicable intellectual property laws.</p>
        <ul className="policy-list">
          <li>You may not copy, reproduce, distribute, or use our content without written permission</li>
          <li>The "vindhya pickles and foods" brand name and logo are proprietary trademarks</li>
          <li>Unauthorised use of our intellectual property may result in legal action</li>
        </ul>
      </>
    ),
  },
  {
    id: 'prohibited',
    title: 'Prohibited Activities',
    content: (
      <>
        <p>You agree not to engage in any of the following activities on our website:</p>
        <ul className="policy-list">
          <li>Placing fraudulent or fake orders</li>
          <li>Using automated bots or scrapers to access our website</li>
          <li>Attempting to hack, disrupt, or damage our systems</li>
          <li>Posting false reviews or misleading information</li>
          <li>Reselling our products without prior written authorisation</li>
          <li>Impersonating vindhya pickles and foods or its representatives</li>
        </ul>
        <div className="policy-warning">
          Violation of these terms may result in immediate account termination and legal action under applicable Indian laws including the IT Act, 2000.
        </div>
      </>
    ),
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    content: (
      <>
        <p>To the maximum extent permitted by law, vindhya pickles and foods shall not be liable for:</p>
        <ul className="policy-list">
          <li>Indirect, incidental, or consequential damages arising from use of our website or products</li>
          <li>Delays caused by courier partners, natural disasters, or circumstances beyond our control</li>
          <li>Allergic reactions — customers are responsible for reviewing ingredient lists before purchase</li>
          <li>Technical issues, downtime, or data loss on our website</li>
          <li>Losses arising from unauthorised access to your account</li>
        </ul>
        <p>Our total liability in any case shall not exceed the amount paid by you for the specific order in question.</p>
      </>
    ),
  },
  {
    id: 'governing',
    title: 'Governing Law & Disputes',
    content: (
      <>
        <p>These Terms and Conditions are governed by the laws of <strong>India</strong>. Any disputes arising from these terms or your use of our website shall be subject to the exclusive jurisdiction of the courts in <strong>Amaravathi, Guntur, Andhra Pradesh</strong>.</p>
        <p>We encourage you to contact us first to resolve any disputes amicably before pursuing legal action.</p>
        <div className="policy-info-grid">
          <div className="policy-info-card"><div className="pic-label">Governing Law</div><div className="pic-value">Laws of India</div></div>
          <div className="policy-info-card"><div className="pic-label">Jurisdiction</div><div className="pic-value">Amaravathi, Guntur, Andhra Pradesh</div></div>
        </div>
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    content: (
      <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the revised terms. We recommend reviewing this page periodically.</p>
    ),
  },
];

export default function TermsConditions() {
  useSEO({
    title: 'Terms & Conditions — vindhya pickles and foods',
    description: 'Terms and Conditions for vindhya pickles and foods. Covers orders, payments via Razorpay, intellectual property, prohibited activities, and governing law (Hyderabad, India).',
    canonical: '/terms-conditions',
  });

  return (
    <div className="policy-page page-enter">
      <section className="policy-hero">
        <div className="policy-hero-inner">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="policy-hero-icon">📜</div>
            <h1>Terms & Conditions</h1>
            <p>Please read these terms carefully before using our website or placing an order.</p>
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
            <h3>Questions About Our Terms?</h3>
            <p>We're happy to clarify — reach out to our team</p>
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
