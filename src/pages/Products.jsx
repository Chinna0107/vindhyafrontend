import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingBag, FiSearch, FiFilter } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import './Products.css';

const categories = [
  { id: 'all', label: 'All Products', emoji: '🫙' },
  { id: 'pickles', label: 'Pickles', emoji: '🥭' },
  { id: "podi's", label: "Podi's", emoji: '🌶️' },
  { id: 'snacks', label: 'Snacks', emoji: '🍪' },
];

export default function Products() {
  useSEO({
    title: 'Buy Vindhya Pickles & Foods Online — Pickles, Podi\'s & Snacks',
    description: 'Shop authentic Vindhya pickles, podi\'s, and home-style snacks. Handcrafted, no preservatives. Order online, delivered across India.',
    canonical: '/products',
  });
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [addedId, setAddedId] = useState(null);
  const { products: allProducts, loading } = useProducts();
  const { addToCart } = useCart();

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.prices?.[0]) return;
    addToCart(product, product.prices[0].weight, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    setActiveSubcategory('all');
  }, [activeCategory]);

  const cats = categories.map(c => ({
    ...c,
    count: c.id === 'all' ? allProducts.length : allProducts.filter(p => p.category === c.id).length,
  }));

  const filtered = allProducts
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => {
      if (activeCategory === 'snacks' && activeSubcategory !== 'all') {
        return p.subcategory === activeSubcategory;
      }
      return true;
    })
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.short_desc || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const priceA = a.prices?.[0]?.price || 0;
      const priceB = b.prices?.[0]?.price || 0;
      if (sort === 'price-low') return priceA - priceB;
      if (sort === 'price-high') return priceB - priceA;
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="dash-spinner" /></div>;

  return (
    <div className="products-page page-enter">
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container page-hero-content">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="page-hero-tag">🫙 Our Collection</span>
            <h1>Authentic Vindhya Pickles & Foods</h1>
            <p>Handcrafted with love, tradition, and the finest ingredients</p>
          </motion.div>
        </div>
        <div className="page-hero-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
          </svg>
        </div>
      </section>

      <div className="container products-layout">
        {/* CATEGORIES */}
        <section className="categories-section">
          <div className="categories-grid">
            {cats.map(cat => (
              <motion.button key={cat.id}
                className={`category-card ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}>
                <div className="cat-emoji">{cat.emoji}</div>
                <div className="cat-label">{cat.label}</div>
                <div className="cat-count">{cat.count} items</div>
                {activeCategory === cat.id && (
                  <motion.div className="cat-active-bar" layoutId="catBar" />
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* SUBCATEGORIES FOR SNACKS */}
        {activeCategory === 'snacks' && (
          <div className="subcategories-bar" style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '20px 0' }}>
            {[
              { id: 'all', label: 'All Snacks' },
              { id: 'sweet items', label: 'Sweet Items' },
              { id: 'hot items', label: 'Hot Items' },
            ].map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={`subcat-btn ${activeSubcategory === sub.id ? 'active' : ''}`}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  border: '1px solid var(--accent)',
                  background: activeSubcategory === sub.id ? 'var(--accent)' : 'transparent',
                  color: activeSubcategory === sub.id ? '#fff' : 'var(--accent)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}

        {/* FILTERS */}
        <div className="filters-bar">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search pickles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="sort-box">
            <FiFilter />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          <div className="results-count">
            <span>{filtered.length} products found</span>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory + search + sort}
            className="products-grid-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}>
            {filtered.length === 0 ? (
              <div className="no-results">
                <span>🔍</span>
                <h3>No products found</h3>
                <p>Try a different search or category</p>
              </div>
            ) : (
              filtered.map((product, i) => {
                const firstPrice = product.prices?.[0] || { weight: '', price: 0, originalPrice: 0 };
                const discount = firstPrice.originalPrice ? Math.round(((firstPrice.originalPrice - firstPrice.price) / firstPrice.originalPrice) * 100) : 0;
                return (
                  <motion.div key={product.id} className="product-card-full glass-panel"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link to={`/products/${product.slug}`} className="product-card-link">
                      <div className="pcf-img">
                        <div className="pcf-emoji">{product.emoji}</div>
                        <div className="pcf-tag">{product.tag}</div>
                        <div className="pcf-discount">-{discount}%</div>
                        <img src={product.images?.[0]} alt={product.name} className="pcf-product-img" />
                      </div>
                    </Link>
                    <div className="pcf-body">
                      <div className="pcf-meta">
                        <span className="pcf-weight">{firstPrice.weight}</span>
                        <span className="pcf-spice">{'🌶️'.repeat(product.spice)}</span>
                      </div>
                      <Link to={`/products/${product.slug}`} className="product-name-link">
                        <h3>{product.name}</h3>
                      </Link>
                      <p>{product.short_desc}</p>
                      <div className="pcf-stars">
                        {[1,2,3,4,5].map(s => (
                          <FiStar key={s} className={s <= Math.floor(product.rating) ? 'star filled' : 'star'} />
                        ))}
                        <span>{product.rating} ({product.reviews})</span>
                      </div>
                      <div className="pcf-footer">
                        <div className="pcf-prices">
                          <span className="pcf-price">₹{firstPrice.price}</span>
                          <span className="pcf-original">₹{firstPrice.originalPrice}</span>
                        </div>
                        <motion.button 
                          className={`pcf-btn ${addedId === product.id ? 'added' : ''}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleAdd(e, product)}>
                          <FiShoppingBag />
                          <span>{addedId === product.id ? '✓ Added' : 'Add to Cart'}</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
