import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar, FiZoomIn, FiX, FiChevronLeft, FiChevronRight,
  FiShoppingBag, FiCheck, FiHeart, FiTruck, FiShield,
  FiAward, FiPackage, FiMinus, FiPlus, FiShare2, FiMapPin,
  FiThumbsUp, FiMessageCircle, FiInfo, FiPhone, FiMail, FiPercent, FiArrowLeft
} from 'react-icons/fi';
import { testimonials } from '../data/products';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const TRUST_BADGES = [
  { icon: <FiTruck />, label: 'Free Delivery', sub: 'For a limited period!' },
  { icon: <FiShield />, label: '100% Natural', sub: 'No preservatives' },
  { icon: <FiAward />, label: 'Authentic Recipe', sub: 'Generations old' },
  { icon: <FiPackage />, label: 'Safe Packaging', sub: 'Leak-proof jars' },
];

const TABS = ['Description', 'Ingredients', 'Storage', 'Nutrition'];
const TABS_KARAM = ['Description', 'Ingredients', 'Nutrition'];

const NUTRITION = {
  veg:    { calories: '45 kcal', protein: '2.1g', carbs: '8.5g', fat: '1.2g', fiber: '3.2g', sodium: '890mg' },
  nonveg: { calories: '185 kcal', protein: '22.5g', carbs: '3.2g', fat: '8.5g', fiber: '1.1g', sodium: '1120mg' },
  karam:  { calories: '320 kcal', protein: '12.8g', carbs: '28.5g', fat: '18.2g', fiber: '8.5g', sodium: '650mg' },
};

const SPICE_LABELS = ['', 'Mild', 'Mild-Medium', 'Medium', 'Hot', 'Extra Hot'];

import API from '../config';
import useSEO from '../hooks/useSEO';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(slug);
  const { addToCart } = useCart();

  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Customer reviews form state
  const [customer, setCustomer] = useState(null);
  const [newReview, setNewReview] = useState({ customer_name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const relatedRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const data = localStorage.getItem('customerData');
    if (data) {
      setCustomer(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (customer?.name) {
      setNewReview(f => ({ ...f, customer_name: customer.name }));
    }
  }, [customer]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.customer_name || !newReview.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`${API}/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setNewReview(f => ({ ...f, comment: '' }));
        // Refresh reviews
        const reviewsRes = await fetch(`${API}/products/${product.id}/reviews`);
        const reviewsData = await reviewsRes.json();
        setReviewsList(reviewsData);
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(setAllProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!product?.id) return;
    setLoadingReviews(true);
    fetch(`${API}/products/${product.id}/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviewsList(data);
        setLoadingReviews(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingReviews(false);
      });
  }, [product]);

  useSEO({
    title: product ? `${product.name} — Buy Authentic Andhra Pickle Online` : 'Product',
    description: product
      ? `Buy ${product.name} online — ${product.short_desc}. Handcrafted authentic Andhra pickle by Vindhya Pickles & Foods. No preservatives, delivered across India.`
      : '',
    canonical: `/products/${slug}`,
    image: product?.images?.[0],
    type: 'product',
  });

  useEffect(() => {
    if (!product) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.full_desc || product.short_desc,
      image: product.images,
      brand: { '@type': 'Brand', name: 'Vindhya Pickles & Foods' },
      offers: product.prices?.map(p => ({
        '@type': 'Offer',
        price: p.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `https://ompicklesandfoods.in/products/${slug}`,
        name: p.weight,
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviews,
        bestRating: 5,
        worstRating: 1,
      },
    });
    document.getElementById('product-jsonld')?.remove();
    document.head.appendChild(script);
    return () => document.getElementById('product-jsonld')?.remove();
  }, [product, slug]);

  useEffect(() => { window.scrollTo(0, 0); setActiveTab(0); }, [slug]);

  useEffect(() => {
    if (product?.prices?.[0]?.weight) setSelectedWeight(product.prices?.[0]?.weight);
  }, [product]);

  if (loading || !product) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="dash-spinner" /></div>;

  const images = product.images?.length ? product.images : ['https://placehold.co/600x600?text=No+Image'];
  const prices = product.prices?.length ? product.prices : [{ weight: '', price: 0, originalPrice: 0 }];
  const benefits = product.benefits?.length ? product.benefits : [];
  const ingredients = product.ingredients?.length ? product.ingredients : [];
  const tabs = product.category === 'karam' ? TABS_KARAM : TABS;

  const currentPrice = prices.find(p => p.weight === selectedWeight) || prices[0];
  const discount = currentPrice.originalPrice ? Math.round(((currentPrice.originalPrice - currentPrice.price) / currentPrice.originalPrice) * 100) : 0;
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);
  const nutrition = NUTRITION[product.category] || NUTRITION.veg;
  const reviews = testimonials.slice(0, 3);
  const activeTabLabel = tabs[activeTab];

  const nextImage = () => setSelectedImage(p => (p + 1) % images.length);
  const prevImage = () => setSelectedImage(p => (p - 1 + images.length) % images.length);

  const handleAddToCart = () => {
    addToCart(product, selectedWeight, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="pd-page">

      {/* TOP BAR */}
      <div className="pd-topbar">
        <div className="container">
          <motion.button className="pd-back-btn" onClick={() => navigate('/products')}
            whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }}>
            <FiArrowLeft size={16} /> Back to Products
          </motion.button>
          <nav className="pd-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span className="active">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="container pd-main">

        {/* IMAGE GALLERY */}
        <motion.div className="pd-gallery"
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>

          <div className="pd-main-img-wrap">
            <AnimatePresence mode="wait">
              <motion.img key={selectedImage} src={images[selectedImage]} alt={product.name}
                className="pd-main-img"
                initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
            </AnimatePresence>

            <div className="pd-img-badges">
              <span className="pd-badge discount">{discount}% OFF</span>
              <span className="pd-badge tag">{product.tag}</span>
            </div>

            <button className="pd-zoom-btn" onClick={() => setIsFullscreen(true)}>
              <FiZoomIn /> Zoom
            </button>

            <div className="pd-dots">
              {images.map((_, i) => (
                <button key={i} className={`pd-dot ${i === selectedImage ? 'active' : ''}`}
                  onClick={() => setSelectedImage(i)} />
              ))}
            </div>
          </div>

          {images.length > 1 && (
            <div className="pd-nav-row">
              <button className="pd-nav prev" onClick={prevImage}><FiChevronLeft /></button>
              <button className="pd-nav next" onClick={nextImage}><FiChevronRight /></button>
            </div>
          )}

          <div className="pd-thumbs">
            {images.map((img, idx) => (
              <motion.button key={idx} className={`pd-thumb ${idx === selectedImage ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <img src={img} alt={`${product.name} ${idx + 1}`} />
              </motion.button>
            ))}
          </div>

          <div className="pd-img-actions">
            <button onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}>
              <FiShare2 /> Share
            </button>
          </div>
        </motion.div>

        {/* INFO */}
        <motion.div className="pd-info"
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>

          {/* Header */}
          <div className="pd-overview">
            <div className="pd-pills">
              <span className="pill cat">{product.emoji} {product.category.toUpperCase()}</span>
              <span className="pill tag">{product.tag}</span>
            </div>
            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-subtitle">{product.short_desc}</p>

            <div className="pd-price-block">
              <span className="pd-price">₹{currentPrice.price}</span>
              <span className="pd-orig">₹{currentPrice.originalPrice}</span>
              <span className="pd-discount-pill">{discount}% OFF</span>
              <span className="pd-savings">Save ₹{currentPrice.originalPrice - currentPrice.price}</span>
            </div>
          </div>

          {/* Weight */}
          <div className="pd-weight-section">
            <label>Select Weight</label>
            <div className="pd-weight-options">
              {prices.map(p => (
                <motion.button key={p.weight}
                  className={`pd-weight-btn ${selectedWeight === p.weight ? 'selected' : ''}`}
                  onClick={() => setSelectedWeight(p.weight)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <span>{p.weight}</span>
                  <span className="w-price">₹{p.price}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="pd-qty-section">
            <label>Quantity</label>
            <div className="pd-qty-control">
              <motion.button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                whileTap={{ scale: 0.9 }} disabled={quantity === 1}><FiMinus /></motion.button>
              <span>{quantity}</span>
              <motion.button onClick={() => setQuantity(q => q + 1)} whileTap={{ scale: 0.9 }}><FiPlus /></motion.button>
              <span className="qty-total">= ₹{currentPrice.price * quantity}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pd-actions">
            <motion.button className={`pd-cart-btn ${addedToCart ? 'success' : ''}`}
              onClick={handleAddToCart} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
              {addedToCart ? <FiCheck /> : <FiShoppingBag />}
              {addedToCart ? `Added ${quantity} to Cart!` : 'Add to Cart'}
            </motion.button>
            <motion.button className={`pd-fav-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => setIsFavorite(!isFavorite)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FiHeart />
            </motion.button>
          </div>

          {/* Spice Level */}
          <div className="pd-spice">
            <label>Spice Level</label>
            <div className="pd-spice-track">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`spice-pip ${i < product.spice ? 'active' : ''}`}>
                  {i < product.spice ? '🌶️' : '○'}
                </span>
              ))}
              <span className="spice-label">{SPICE_LABELS[product.spice]}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BENEFITS + TRUST + OFFERS */}
      <div className="container pd-extra">
        <div className="pd-benefits">
          <h3>Key Benefits</h3>
          <div className="pd-benefits-grid">
            {benefits.map((b, i) => (
              <div key={i} className="pd-benefit-item">
                <span className="benefit-check">✓</span> {b}
              </div>
            ))}
          </div>
        </div>

        <div className="pd-trust-badges">
          {TRUST_BADGES.map((b, i) => (
            <motion.div key={i} className="pd-trust-badge" whileHover={{ y: -3 }}>
              <span className="trust-icon">{b.icon}</span>
              <div>
                <div className="trust-label">{b.label}</div>
                <div className="trust-sub">{b.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pd-offers">
          <div className="pd-offer-card">
            <FiPercent className="offer-icon" />
            <div>
              <div className="offer-title">Bulk Discount</div>
              <div className="offer-desc">Save more on larger quantities</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <section className="pd-tabs-section">
        <div className="container">
          <div className="pd-tabs-header">
            {tabs.map((tab, i) => (
              <button key={i} className={`pd-tab-btn ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}>
                {tab}
                {activeTab === i && <motion.div className="pd-tab-underline" layoutId="tab-line" />}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} className="pd-tab-content"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

              {activeTabLabel === 'Description' && <p className="pd-desc-text">{product.full_desc || product.short_desc}</p>}

              {activeTabLabel === 'Ingredients' && (
                <ul className="pd-ingredients">
                  {ingredients.map((ing, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}>
                      <span className="ing-dot">●</span> {ing}
                    </motion.li>
                  ))}
                </ul>
              )}

              {activeTabLabel === 'Storage' && (
                <div className="pd-storage-grid">
                  {[
                    { icon: '🌡️', title: 'Temperature', desc: 'Store below 25°C' },
                    { icon: '📅', title: 'Shelf Life', desc: '12 months unopened' },
                    { icon: '🧊', title: 'After Opening', desc: 'Refrigerate, use within 3 months' },
                    { icon: '🥄', title: 'Usage Tip', desc: 'Always use a dry spoon' },
                  ].map((s, i) => (
                    <div key={i} className="pd-storage-card">
                      <span className="storage-icon">{s.icon}</span>
                      <div><strong>{s.title}</strong><p>{s.desc}</p></div>
                    </div>
                  ))}
                </div>
              )}

              {activeTabLabel === 'Nutrition' && (
                <div className="pd-nutrition">
                  <div className="pd-nutrition-header">
                    <h3>Nutritional Information</h3>
                    <span>Per 100g serving</span>
                  </div>
                  <div className="pd-nutrition-grid">
                    {Object.entries({ Calories: nutrition.calories, Protein: nutrition.protein, Carbohydrates: nutrition.carbs, Fat: nutrition.fat, Fiber: nutrition.fiber, Sodium: nutrition.sodium }).map(([k, v]) => (
                      <div key={k} className="pd-nutrition-item">
                        <span className="n-label">{k}</span>
                        <span className="n-value">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pd-nutrition-note">
                    <FiInfo /> Values are approximate and may vary based on preparation method.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CUSTOMER REVIEWS & RATINGS */}
      <section className="pd-reviews-section">
        <div className="container">
          <div className="pd-reviews-header">
            <div>
              <h2>Customer Reviews & Ratings</h2>
              <p>Hear from our authentic food-loving family</p>
            </div>
            <div className="pd-overall-rating">
              <span className="rating-num">★ {parseFloat(product.rating || 0).toFixed(1)}</span>
              <span className="reviews-count">Based on {reviewsList.length} verified reviews</span>
            </div>
          </div>

          <div className="pd-reviews-container">
            {/* Left Column: Existing Reviews */}
            <div className="pd-reviews-list-col">
              {loadingReviews ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <div className="dash-spinner" />
                </div>
              ) : reviewsList.length === 0 ? (
                <div className="pd-no-reviews">
                  <FiMessageCircle className="no-rev-icon" size={32} />
                  <p>No customer reviews yet. Ratings are verified for all purchases.</p>
                </div>
              ) : (
                <div className="pd-reviews-stack">
                  {reviewsList.map((rev, idx) => {
                    const charCodeSum = rev.customer_name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const hue = charCodeSum % 360;
                    const avatarBg = `hsl(${hue}, 60%, 42%)`;
                    
                    return (
                      <motion.div 
                        key={rev.id} 
                        className="pd-review-card"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className="pd-review-user">
                           <div className="pd-review-avatar" style={{ backgroundColor: avatarBg }}>
                            {rev.customer_name.trim().charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="pd-review-name">{rev.customer_name}</h4>
                            <div className="pd-review-stars">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`star-pip ${i < rev.rating ? 'active' : ''}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="pd-review-comment">{rev.comment}</p>
                        <span className="pd-review-date">
                          Verified Buyer • {new Date(rev.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Write a Review Form */}
            <div className="pd-write-review-col">
              <div className="pd-write-review-card">
                <h3>Share Your Experience</h3>
                <p>We value your honest feedback on our authentic flavors.</p>
                
                {reviewSuccess ? (
                  <motion.div 
                    className="review-success-msg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <h4>✓ Thank You!</h4>
                    <p>Your review has been successfully submitted and verified.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="pd-review-form">
                    <div className="pd-form-group">
                      <label>Your Name</label>
                      <input 
                        type="text"
                        required
                        placeholder="Enter your name"
                        value={newReview.customer_name}
                        onChange={e => setNewReview(f => ({ ...f, customer_name: e.target.value }))}
                        disabled={!!customer}
                        className={customer ? 'disabled' : ''}
                      />
                      {customer && <span className="pd-form-help">Logged in as {customer.name}</span>}
                    </div>

                    <div className="pd-form-group">
                      <label>Rating</label>
                      <div className="pd-rating-select">
                        {[5, 4, 3, 2, 1].map(stars => (
                          <button
                            key={stars}
                            type="button"
                            className={`pd-star-btn ${newReview.rating === stars ? 'active' : ''}`}
                            onClick={() => setNewReview(f => ({ ...f, rating: stars }))}
                          >
                            ★ {stars} Stars
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pd-form-group">
                      <label>Your Comment</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Delicious! Tell us about the taste, spice levels, and texture..."
                        value={newReview.comment}
                        onChange={e => setNewReview(f => ({ ...f, comment: e.target.value }))}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="pd-submit-review-btn" 
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PEOPLE ALSO BUY (RELATED PRODUCTS) */}
      {relatedProducts.length > 0 && (
        <section className="pd-related">
          <div className="container">
            <div className="pd-related-header">
              <div>
                <h2>People Also Buy</h2>
                <p>Authentic pairings handpicked for you</p>
              </div>
              <Link to="/products" className="pd-view-all">View All <FiArrowLeft style={{ transform: 'rotate(180deg)' }} /></Link>
            </div>
            
            <div className="product-slider-wrapper">
              <button className="slider-arrow prev" onClick={() => scroll(relatedRef, 'left')} aria-label="Previous Products">
                <FiChevronLeft />
              </button>
              
              <div className="pd-related-grid product-slider" ref={relatedRef}>
                {relatedProducts.map((rp, i) => (
                  <motion.div key={rp.id} className="pd-related-card"
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }} whileHover={{ y: -6 }}
                    onClick={() => navigate(`/products/${rp.slug}`)}>
                    <div className="related-img-wrap">
                      <img src={rp.images?.[0] || 'https://placehold.co/300x300?text=No+Image'} alt={rp.name} />
                      <span className="related-tag-badge">{rp.tag}</span>
                    </div>
                    <div className="related-info">
                      <div className="related-top-row">
                        <span>{rp.emoji}</span>
                      </div>
                      <h4>{rp.name}</h4>
                      <p>{rp.short_desc}</p>
                      <div className="related-price-row">
                        <span className="r-price">₹{rp.prices?.[0]?.price}</span>
                        <span className="r-orig">₹{rp.prices?.[0]?.originalPrice}</span>
                        <motion.button className="r-add-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                          onClick={e => {
                            e.stopPropagation();
                            addToCart(rp, rp.prices?.[0]?.weight, 1);
                          }}>
                          <FiPlus />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="slider-arrow next" onClick={() => scroll(relatedRef, 'right')} aria-label="Next Products">
                <FiChevronRight />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="pd-contact">
        <div className="container">
          <div className="pd-contact-card">
            <div className="pd-contact-content">
              <h3>Have Questions About This Product?</h3>
              <p>Our pickle experts are here to help you choose the perfect flavor.</p>
              <div className="pd-contact-methods">
                <a href="tel:+918142128079" className="pd-contact-method">
                  <FiPhone />
                  <div>
                    <div className="c-label">Call Us</div>
                    <div className="c-value">+91 8142128079</div>
                  </div>
                </a>
                <a href="mailto:vindhyapicklesandfoods@gmail.com" className="pd-contact-method">
                  <FiMail />
                  <div>
                    <div className="c-label">Email Us</div>
                    <div className="c-value">vindhyapicklesandfoods@gmail.com</div>
                  </div>
                </a>
              </div>
            </div>
            <img src="https://res.cloudinary.com/dgyykbmt6/image/upload/v1779075778/banner3_gzt6jr.jpg" alt="Customer Service" />
          </div>
        </div>
      </section>

      {/* FULLSCREEN */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div className="pd-fullscreen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} onClick={() => setIsFullscreen(false)}>
            <motion.div className="pd-fullscreen-inner" onClick={e => e.stopPropagation()}
              initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}>
              <button className="fs-close" onClick={() => setIsFullscreen(false)}><FiX /></button>
              <AnimatePresence mode="wait">
                <motion.img key={selectedImage} src={images[selectedImage]} alt="fullscreen"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              </AnimatePresence>
              {images.length > 1 && (
                <div className="fs-nav">
                  <button onClick={prevImage}><FiChevronLeft /></button>
                  <span>{selectedImage + 1} / {images.length}</span>
                  <button onClick={nextImage}><FiChevronRight /></button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
