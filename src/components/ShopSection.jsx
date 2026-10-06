import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Star, 
  Eye, 
  Check, 
  ShieldCheck, 
  Truck, 
  Gift, 
  SlidersHorizontal,
  ArrowRight,
  Zap,
  Tag
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function ShopSection() {
  const { data, addToCart, setQuickViewProduct, setIsCartDrawerOpen } = useSalon();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [addedItemAnimation, setAddedItemAnimation] = useState(null);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'haircare', label: 'Hair Care & Elixirs' },
    { id: 'skincare', label: 'Clinical Skincare' },
    { id: 'grooming', label: "Men's Grooming" },
    { id: 'tools', label: 'Styling Tools' },
    { id: 'luxury-kits', label: 'Luxury Gift Hampers' }
  ];

  const productsList = data.products || [];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productsList
      .filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.categoryLabel && item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        if (sortBy === 'bestseller') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        return 0; // featured default
      });
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1, false); // Add without immediately opening drawer for quick shopping experience
    setAddedItemAnimation(product.id);
    setTimeout(() => {
      setAddedItemAnimation(null);
    }, 1200);
  };

  return (
    <section className="shop-luxury-section" id="shop">
      {/* Subtle Background Elements */}
      <div className="shop-ambient-glow"></div>

      <div className="section-container">
        {/* Luxury Section Header */}
        <div className="section-header-center">
          <div className="luxury-badge">
            <Sparkles size={14} />
            <span>LOOKS PROFESSIONAL BOUTIQUE</span>
          </div>
          <h2 className="section-title">Salon-Grade Formulations & Elixirs</h2>
          <div className="luxury-divider">
            <span className="divider-line"></span>
            <span className="divider-diamond">◆</span>
            <span className="divider-line"></span>
          </div>
          <p className="section-subtitle">
            Experience the identical master formulations, Paris elixirs, and dermatological rituals used in our flagship salons — now available for luxury home delivery.
          </p>
        </div>

        {/* Promo Code Banner */}
        <div className="boutique-promo-ribbon">
          <div className="promo-ribbon-content">
            <div className="promo-pill">
              <Tag size={14} />
              <span>LIMITED LUXURY OFFER</span>
            </div>
            <div className="promo-text-wrap">
              <span className="promo-bold">Use Code: <strong>LOOKS20</strong></span>
              <span className="promo-desc">for 20% OFF on all Boutique orders over ₹2,500</span>
              <span className="promo-divider">|</span>
              <span className="promo-bold">Code: <strong>WELCOME500</strong></span>
              <span className="promo-desc">for Flat ₹500 OFF your first order</span>
            </div>
            <button 
              className="promo-action-btn"
              onClick={() => setIsCartDrawerOpen(true)}
            >
              <span>View Bag</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Search, Filter Pills & Sort Toolbar */}
        <div className="shop-toolbar-wrapper">
          {/* Category Filter Pills */}
          <div className="shop-category-pills">
            {categories.map(cat => {
              const count = cat.id === 'all' 
                ? productsList.length 
                : productsList.filter(p => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  className={`shop-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.label}</span>
                  <span className="pill-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search and Sort Row */}
          <div className="shop-search-sort-row">
            <div className="shop-search-box">
              <Search size={17} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search Kérastase, Olaplex, Serums, Hair Kits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shop-search-input"
              />
              {searchQuery && (
                <button 
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="shop-sort-box">
              <SlidersHorizontal size={15} className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="shop-sort-select"
              >
                <option value="featured">Featured Curations</option>
                <option value="bestseller">Best Sellers First</option>
                <option value="rating">Highest Rated (5.0★)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="shop-empty-state">
            <div className="empty-icon-circle">
              <Search size={32} />
            </div>
            <h3>No products found matching your search</h3>
            <p>Try searching with another keyword or browse all boutique categories.</p>
            <button 
              className="btn-reset-filters"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="luxury-product-grid">
            {filteredProducts.map(product => {
              const isAdded = addedItemAnimation === product.id;
              const hasDiscount = product.originalPrice && product.originalPrice > product.price;

              return (
                <div 
                  key={product.id} 
                  className="luxury-product-card"
                  onClick={() => setQuickViewProduct(product)}
                >
                  {/* Top Badges */}
                  <div className="product-card-top-tags">
                    {product.badge && (
                      <span className="product-badge-gold">
                        {product.badge}
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="product-badge-discount">
                        -{product.discountPercent || Math.round(((product.originalPrice - product.price)/product.originalPrice)*100)}%
                      </span>
                    )}
                  </div>

                  {/* Image Container with Quick View Button */}
                  <div className="product-card-media">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-card-img"
                      loading="lazy"
                    />
                    <button 
                      className="product-quickview-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickViewProduct(product);
                      }}
                      title="Quick View Details"
                    >
                      <Eye size={16} />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="product-card-body">
                    <div className="product-brand-rating-row">
                      <span className="product-card-brand">{product.brand}</span>
                      <div className="product-card-rating">
                        <Star size={13} fill="#DFB7AC" color="#DFB7AC" />
                        <span>{product.rating}</span>
                        <span className="rating-count">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="product-card-title" title={product.name}>
                      {product.name}
                    </h3>

                    <div className="product-volume-pill">
                      <span>{product.volume}</span>
                    </div>

                    {/* Price and Cart Button */}
                    <div className="product-card-footer">
                      <div className="product-price-stack">
                        <div className="product-price-current">
                          <span className="currency">₹</span>
                          <span className="price-num">{product.price.toLocaleString('en-IN')}</span>
                        </div>
                        {hasDiscount && (
                          <span className="product-price-old">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button 
                        className={`product-add-cart-btn ${isAdded ? 'added' : ''}`}
                        onClick={(e) => handleQuickAdd(product, e)}
                        aria-label={`Add ${product.name} to Bag`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Luxury Trust Guarantee Strip */}
        <div className="shop-trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div className="trust-content">
              <h4>100% Authentic Formulations</h4>
              <p>Direct from Paris & official lab distributors with batch hologram seals.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <Truck size={24} />
            </div>
            <div className="trust-content">
              <h4>White-Glove Safe Delivery</h4>
              <p>Complimentary insulated delivery on all orders over ₹1,500.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <Gift size={24} />
            </div>
            <div className="trust-content">
              <h4>Complimentary Salon Samples</h4>
              <p>Receive 2 curated luxury skincare/haircare miniatures with every order.</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <Sparkles size={24} />
            </div>
            <div className="trust-content">
              <h4>Expert Stylist Guidance</h4>
              <p>Unsure which elixir suits your hair? Consult our master colorists online.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
