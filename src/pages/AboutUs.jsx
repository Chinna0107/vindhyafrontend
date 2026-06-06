import { motion } from 'framer-motion';
import { FiHome, FiShield, FiHeart, FiBookOpen } from 'react-icons/fi';
import useSEO from '../hooks/useSEO';
import './AboutUs.css';

const values = [
  { title: 'Made at Home', desc: 'Every product is handcrafted in small batches using traditional kitchen methods — never in a factory.', icon: <FiHome /> },
  { title: 'No Preservatives', desc: 'We use only fresh, natural ingredients sourced from local Andhra farms. Zero artificial additives.', icon: <FiShield /> },
  { title: 'Made with Love', desc: 'Every recipe carries the warmth of three generations of Andhra women who believed food is love.', icon: <FiHeart /> },
  { title: 'Authentic Recipes', desc: 'Our recipes are passed down through generations — unchanged, uncompromised, and utterly authentic.', icon: <FiBookOpen /> }
];

const processSteps = [
  { step: '1', title: 'Sourcing', desc: 'Handpicked ingredients from local Andhra farms — fresh chilies, peanuts, millets and spices', icon: '🌱' },
  { step: '2', title: 'Preparation', desc: 'Traditional stone-grinding for podis, sun-drying for vadiyalu, hand-rolling for snacks', icon: '👩‍🍳' },
  { step: '3', title: 'Cooking', desc: 'Slow-cooked in small batches with cold-pressed oils and age-old techniques. No shortcuts', icon: '🔥' },
  { step: '4', title: 'Packing & Delivery', desc: 'Sealed in food-grade containers while still fresh, and dispatched within 24 hours', icon: '📦' }
];

const teamMembers = [
  { name: 'Founder', role: 'Recipe Curator & Head Chef', desc: 'Grew up watching her grandmother prepare traditional Andhra snacks for every festival.', emoji: '👩‍🍳' },
  { name: 'Quality Team', role: 'Freshness Guardians', desc: 'Ensures every batch meets our strict no-preservative, fresh-ingredient standards.', emoji: '🌿' },
  { name: 'Delivery Team', role: 'Last-Mile Heroes', desc: 'Delivers your orders fresh across Andhra within 2-3 days of preparation.', emoji: '🚚' }
];

const rewards = [
  { tier: 'Bronze', orders: '0-4 orders', perk: '5% OFF', desc: ['5% off all orders'] },
  { tier: 'Silver', orders: '5-9 orders', perk: '10% OFF', desc: ['10% off all orders', 'Free delivery'] },
  { tier: 'Gold', orders: '10-19 orders', perk: '15% OFF', desc: ['15% off all orders', 'Priority delivery', 'Free gift wrap'] },
  { tier: 'Platinum', orders: '20+ orders', perk: '20% OFF', desc: ['20% off all orders', 'All Gold perks', 'Exclusive products', 'First access'] }
];

const festivals = [
  { name: 'Sankranti', telugu: 'సంక్రాంతి • January', desc: 'The harvest festival — a time for Athrasalu, sweets and snacks.' },
  { name: 'Ugadi', telugu: 'ఉగాది • March/April', desc: 'Telugu New Year! A time for new beginnings and homemade sweets.' },
  // { name: 'Bonalu', telugu: 'బోనాలు • July/August', desc: 'Honoring Goddess Mahankali with special homemade snacks.' },
  // { name: 'Bathukamma', telugu: 'బతుకమ్మ • September/October', desc: 'Andhra\'s floral festival with folk songs and traditional foods.' },
  { name: 'Dasara', telugu: 'దసరా • October', desc: 'Families exchange sweets and celebrate with grand feasts.' },
  { name: 'Diwali', telugu: 'దీపావళి • October/November', desc: 'Perfect time for Vindhya hampers and traditional sweets.' }
];

export default function AboutUs() {
  useSEO({
    title: 'About Us — Vindhya Foods Story',
    description: 'Learn about Vindhya Foods. Authentic traditional recipes passed down through generations, made with love.',
    canonical: '/about',
  });

  return (
    <div className="about-page page-enter">
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1>About Vindhya Foods</h1>
            <p className="hero-subtitle">Vindhya was born from a simple longing — the taste of home. We bring authentic, homemade Andhra flavours to families across India.</p>
          </motion.div>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="quick-stats-section">
        <div className="container">
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <div className="qs-value">500+</div>
              <div className="qs-label">Happy Customers</div>
            </div>
            <div className="quick-stat">
              <div className="qs-value">44+</div>
              <div className="qs-label">Authentic Products</div>
            </div>
            <div className="quick-stat">
              <div className="qs-value">3</div>
              <div className="qs-label">Generations of Recipes</div>
            </div>
            <div className="quick-stat">
              <div className="qs-value">100%</div>
              <div className="qs-label">No Preservatives</div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="story-section">
        <div className="container">
          <motion.div className="story-quote"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            “Every recipe we make carries the warmth of three generations of Andhra women who believed food is love.”
          </motion.div>
          <div className="story-content">
            <p><strong>Welcome to Vindhya Foods, where tradition meets purity.</strong>We are passionate about bringing authentic homemade flavors from Andhra Pradesh directly to your kitchen. Every product we offer is prepared using carefully selected ingredients sourced directly from trusted farmers, ensuring freshness, quality, and natural taste.</p>
            {/* <p>So she went back to her roots — literally. Dusting off her grandmother's handwritten recipe book, she started making small batches at home. Word spread through WhatsApp. Friends told friends. And before long, Vindhya became Telangana's most loved homemade brand.</p> */}
            <p>From traditional podis (karams) and pickles to healthy snacks and homemade specialties, our products are crafted in small batches using time-tested recipes passed down through generations. We believe that food should be free from unnecessary preservatives and full of genuine flavor.
</p>
<p>Our mission is simple: to deliver the taste of home to families across India and around the world. Today, we proudly serve customers who trust us for quality, authenticity, and the comforting flavors of traditional homemade food.
</p>
<p><strong>At Vindhya Foods, every pack carries our promise of purity, quality, and the love of homemade cooking.
</strong></p>
            {/* <p>Today, every item is still made fresh after you order. No factories. No preservatives. Just honest, traditional Telangana food — delivered with love.</p> */}
            <p>From Our Farmers to Your Family – Authentic Taste, Delivered with Care.</p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            {values.map((v, i) => (
              <motion.div key={i} className="value-card glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <div className="value-emoji">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PROCESS */}
      <section className="process-section">
        <div className="container">
          <div className="process-grid">
            {processSteps.map((item, i) => (
              <motion.div key={i} className="process-card glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}>
                <div className="process-header">
                  <div className="process-icon">{item.icon}</div>
                  <div className="process-number">{item.step}</div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {i < processSteps.length - 1 && <div className="process-arrow">→</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE TEAM */}
      <section className="team-section">
        <div className="container">
          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <motion.div key={i} className="team-card glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <div className="team-avatar">
                  <span>{member.emoji}</span>
                </div>
                <h3>{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p>{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REWARDS SECTION */}
      <section className="rewards-section">
        <div className="container">
          <div className="section-title">
            <h2>Earn Rewards with Every Order</h2>
            <p>The more you order, the more you save.</p>
          </div>
          <div className="rewards-grid">
            {rewards.map((r, i) => (
              <div key={i} className={`reward-card tier-${r.tier.toLowerCase()}`}>
                <div className="reward-tier">{r.tier}</div>
                <div className="reward-orders">{r.orders}</div>
                <div className="reward-perk">{r.perk}</div>
                <ul className="reward-desc">
                  {r.desc.map((d, j) => (
                    <li key={j}>• {d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="https://wa.me/918142128079?text=I%20want%20to%20join%20Vindhya%20Rewards!" target="_blank" rel="noreferrer" className="btn-whatsapp">
              Join Rewards on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FESTIVALS SECTION */}
      <section className="festivals-section">
        <div className="container">
          <div className="section-title">
            <h2>Celebrate Every Festival 🎉</h2>
            <p>From Sankranti to Diwali — every Andhra festival deserves authentic homemade flavors.</p>
          </div>
          <div className="festivals-grid">
            {festivals.map((f, i) => (
              <div key={i} className="festival-card glass-panel">
                <h3>{f.name}</h3>
                <div className="festival-telugu">{f.telugu}</div>
                <p>{f.desc}</p>
                <a href="/products" className="festival-link">Shop for {f.name} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <motion.div className="cta-content"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2>Ready to Taste the Tradition?</h2>
            <p>Join thousands of families who trust Vindhya Pickles for authentic flavors</p>
            <div className="cta-buttons">
              <motion.a href="/products" className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Shop Now
              </motion.a>
              <motion.a href="/contact" className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Get in Touch
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}