import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiSend, FiClock, FiInstagram, FiFacebook, FiMessageCircle, FiChevronDown } from 'react-icons/fi';
import useSEO from '../hooks/useSEO';
import './Contact.css';

export default function Contact() {
  useSEO({
    title: 'Contact Us — Order Andhra Pickles | Vindhya Pickles & Foods',
    description: 'Contact Vindhya Pickles & Foods for orders, bulk inquiries, or queries. Call +91 8142128079 or email vindhyapicklesandfoods@gmail.com. Located in Amaravathi, Guntur, Andhra Pradesh.',
    canonical: '/contact',
  });
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const whatsappBase = 'https://wa.me/919949085469';
  const whatsappLink = `${whatsappBase}?text=${encodeURIComponent('Hi! I would like to place an order from Vindhya Pickles & Foods. Can you help me?')}`;

  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Tap any WhatsApp button, share your items, quantity, and delivery date, and we will confirm availability within minutes.',
    },
    {
      question: 'Do you take bulk orders?',
      answer: 'Yes. We handle weddings, events, corporate gifting, and festival orders with custom pricing and easy delivery.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Fresh orders are usually delivered within 2–3 business days across Andhra Pradesh and Telangana, with express shipping available.',
    },
    {
      question: 'Where do you deliver?',
      answer: 'We deliver across Andhra Pradesh, Telangana, and surrounding areas. Message us with your pin code for exact delivery details.',
    },
  ];

  const buildWhatsAppUrl = (data) => {
    const text = `Hi! I would like to contact Vindhya Pickles & Foods.%0A%0AName: ${data.name || 'N/A'}%0APhone: ${data.phone || 'N/A'}%0AEmail: ${data.email || 'N/A'}%0ASubject: ${data.subject || 'N/A'}%0AMessage: ${data.message || 'N/A'}`;
    return `${whatsappBase}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = buildWhatsAppUrl(form);
    window.location.href = url;
  };

  return (
    <div className="contact-page page-enter">
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="page-hero-tag">📞 Get in Touch</span>
            <h1>Contact Us</h1>
            <p>Have a question, custom order request, or just want to say hi? We’d love to hear from you!</p>
          </motion.div>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      <div className="container contact-layout">
        <motion.div className="contact-details"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}>
          <div className="contact-info-header">
            <h2>Reach Us Directly</h2>
            <p>Need fresh pickles, bulk pricing, or delivery support? Use the fastest ways below to connect with us.</p>
          </div>

          <div className="contact-cards">
            <div className="contact-card whatsapp-card">
              <div className="cc-icon whatsapp-icon"><FiMessageCircle /></div>
              <div>
                <div className="cc-label">WhatsApp</div>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="cc-value">+91 9949085469</a>
                <div className="cc-sub">Fastest response — send your order instantly.</div>
              </div>
            </div>

            <div className="contact-card phone-card">
              <div className="cc-icon phone-icon"><FiPhone /></div>
              <div>
                <div className="cc-label">Phone</div>
                <a href="tel:+919949085469" className="cc-value">+91 9949085469</a>
                <div className="cc-sub">Call us Mon–Sat, 9 AM – 8 PM.</div>
              </div>
            </div>

            <div className="contact-card mail-card">
              <div className="cc-icon mail-icon"><FiMail /></div>
              <div>
                <div className="cc-label">Email</div>
                <a href="mailto:foods.vindhya@gmail.com" className="cc-value">foods.vindhya@gmail.com</a>
                <div className="cc-sub">We reply within 24 hours.</div>
              </div>
            </div>

            <div className="contact-card map-card">
              <div className="cc-icon map-icon"><FiMapPin /></div>
              <div>
                <div className="cc-label">Location</div>
                <div className="cc-value">Amaravathi, Guntur, Andhra Pradesh</div>
                <div className="cc-sub">Delivery across Andhra Pradesh, Telangana, and surrounding areas.</div>
                <div className="cc-note">Fresh batches made daily and shipped with care.</div>
              </div>
            </div>
          </div>

          <div className="contact-actions">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="contact-action-btn whatsapp">
              <FiMessageCircle /> Chat on WhatsApp
            </a>
            <a href="tel:+919949085469" className="contact-action-btn phone">
              <FiPhone /> Call Now
            </a>
          </div>

          {/* <div className="info-cards">
            <div className="info-card hours-card">
              <div className="info-card-header">
                <div className="card-tag">Working Hours</div>
                <h3>Business Hours</h3>
              </div>
              <div className="info-card-body">
                <div className="time-row"><span>Monday – Friday</span><span>9:00 AM – 8:00 PM</span></div>
                <div className="time-row"><span>Saturday</span><span>9:00 AM – 5:00 PM</span></div>
                <div className="time-row"><span>Sunday</span><span>10:00 AM – 5:00 PM</span></div>
              </div>
              <p className="info-note">WhatsApp orders accepted 24/7 — responses are handled during opening hours for the fastest confirmations.</p>
            </div>

            <div className="info-card faq-card">
              <div className="info-card-header">
                <div className="card-tag">FAQ</div>
                <h3>Need answers fast?</h3>
              </div>
              <p className="faq-intro">Tap a question to reveal the answer. Only one section stays open at a time for a clean, premium experience.</p>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={faq.question} className={`faq-item ${activeFaqIndex === index ? 'active' : ''}`}>
                    <button type="button" className="faq-question" onClick={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)}>
                      <span>{faq.question}</span>
                      <FiChevronDown className="faq-chevron" />
                    </button>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
        </motion.div>

        <motion.div className="contact-form-wrap"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}>
          <div className="form-header">
            <h2>Send a Message</h2>
            <p>Fill in the form and we'll get back to you shortly.</p>
          </div>

          {sent && (
            <motion.div className="success-msg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}>
              ✅ Message sent successfully! We'll get back to you soon.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" placeholder="Enter your name" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" placeholder="your@email.com" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option value="">Select a subject</option>
                <option>Place an Order</option>
                <option>Bulk Order Inquiry</option>
                <option>Product Query</option>
                <option>Delivery Issue</option>
                <option>Feedback</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea placeholder="Tell us how we can help you..." rows={5} required
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="submit-btn">
              <FiSend />
              <span>Send Message</span>
            </button>
          </form>

          <div className="form-footnote">
            <p>Prefer a faster reply? Send us your order details on WhatsApp.</p>
          </div>
        </motion.div>
      </div>

      <section className="map-section">
        <div className="container map-grid">
          <div className="map-frame">
            <iframe
              title="Vindhya Pickles & Foods Location"
              src="https://maps.google.com/maps?q=Amaravathi,+Guntur,+Andhra+Pradesh&output=embed"
              loading="lazy"
              aria-hidden="false"
              tabIndex="0"
            />
          </div>
          <div className="map-details">
            <h3>Visit Our Kitchen</h3>
            <p>We prepare every batch fresh from Amaravathi, Guntur, and ship across India.</p>
            <a href="https://maps.google.com/?q=Amaravathi,Guntur,Andhra+Pradesh" target="_blank" rel="noreferrer" className="btn-primary map-btn">
              <FiMapPin />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
