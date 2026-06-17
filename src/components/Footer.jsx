import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';
import logo from '../assets/logo3.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#1a1400" />
        </svg>
      </div>
      <div className="footer-body">
        <div className="container footer-grid">

          {/* BRAND */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo}  style={{ width: '170px', height: '100px' }} alt="Vindhya Foods Logo" className="footer-logo-img" />
              <div className="footer-logo-name">VINDHYA FOODS</div>
            </div>
            <p>Authentic Andhra pickles crafted with love, tradition, and the finest ingredients. Bringing the taste of home to your table since 2026.</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/vindhya.foods?igsh=MTR1b2VycjB0NW12dQ%3D%3D&utm_source=qr" className="social-btn"><FiInstagram /></a>
              <a href="https://www.facebook.com/share/16JvfPzWu1/?mibextid=wwXIfr" className="social-btn"><FiFacebook /></a>
              <a href="https://youtube.com/@vindhya.foods1?si=VPMj183OkMnlwi7S" className="social-btn"><FiYoutube /></a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Customer Login</Link></li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/products?cat=veg">Veg Pickles</Link></li>
              <li><Link to="/products?cat=nonveg">Non-Veg Pickles</Link></li>
              <li><Link to="/products?cat=karam">Karam Podi</Link></li>
              <li><Link to="/products?cat=snacks">Snacks</Link></li>
              <li><Link to="/products?cat=vadiyalu">Pickles</Link></li>
            </ul>
          </div>

          {/* POLICIES */}
          <div className="footer-col">
            <h4>Policies</h4>
            <ul>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/refund-policy">Refund &amp; Returns</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions">Terms &amp; Conditions</Link></li>
            </ul>
            <div className="footer-razorpay">
              <div className="footer-razorpay-label">Payments secured by</div>
              <div className="footer-razorpay-badge">💳 <span>Razorpay</span></div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="contact-list">
              <li>
                <FiPhone />
                <a href="tel:+919949085469">+91 9949085469</a>
              </li>
              <li>
                <FiMail />
                <a href="mailto:foods.vindhya@gmail.com">foods.vindhya@gmail.com</a>
              </li>
              <li>
                <FiMapPin />
                <span>Amaravathi, Guntur, Andhra Pradesh - 522020</span>
              </li>
            </ul>
          </div>

        </div>

        {/* <div className="footer-newsletter">
          <div className="footer-newsletter-inner">
            <div className="footer-newsletter-text">
              <h5>🫙 Stay Pickled & Posted!</h5>
              <p>Get new arrivals, seasonal specials & exclusive offers straight to your inbox.</p>
            </div>
            <div className="footer-newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div> */}

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>© 2026 Vindhya Foods. All rights reserved. | Owner: <strong>Divya</strong></p>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy">Privacy</Link>
              <span>·</span>
              <Link to="/terms-conditions">Terms</Link>
              <span>·</span>
              <Link to="/refund-policy">Refunds</Link>
              <span>·</span>
              <Link to="/shipping-policy">Shipping</Link>
            </div>
            <p>Made with ❤️ by <a href="https://zewo.in" target="_blank" rel="noopener noreferrer">zewo</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
