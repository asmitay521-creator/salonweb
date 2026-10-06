import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Sparkles, Truck, RefreshCw, Zap } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function ProductQuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useSalon();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits'); // 'benefits' | 'usage'

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const handleAdd = () => {
    addToCart(product, quantity, true);
    setQuickViewProduct(null);
  };

  return (
    <div className="modal-backdrop luxury-modal-fade" onClick={() => setQuickViewProduct(null)}>
      <div 
        className="luxury-quickview-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="quickview-close-btn" 
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close product quick view"
        >
          <X size={20} />
        </button>

        <div className="quickview-grid">
          {/* Left: Product Visual */}
          <div className="quickview-media">
            <div className="quickview-badge-floating">
              {product.badge || "SALON GRADE"}
            </div>
            <img 
              src={product.image} 
              alt={product.name} 
              className="quickview-img"
            />
            <div className="quickview-trust-row">
              <span className="trust-pill"><ShieldCheck size={14} /> 100% Authentic</span>
              <span className="trust-pill"><Truck size={14} /> White Glove Delivery</span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="quickview-content">
            <div className="quickview-header">
              <span className="quickview-brand">{product.brand || "LOOKS PROFESSIONAL"}</span>
              <span className="quickview-category-tag">{product.categoryLabel}</span>
            </div>

            <h2 className="quickview-title">{product.name}</h2>

            <div className="quickview-rating-row">
              <div className="quickview-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={15} 
                    fill={i < Math.floor(product.rating || 5) ? "#DFB7AC" : "none"} 
                    color="#DFB7AC" 
                  />
                ))}
              </div>
              <span className="quickview-score">{product.rating}</span>
              <span className="quickview-reviews">({product.reviewsCount} verified salon client reviews)</span>
            </div>

            {/* Price section */}
            <div className="quickview-price-box">
              <div className="quickview-price-main">
                <span className="currency">₹</span>
                <span className="amount">{product.price.toLocaleString('en-IN')}</span>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="quickview-price-original">
                  <span className="old-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="save-badge">Save {product.discountPercent || Math.round(((product.originalPrice - product.price)/product.originalPrice)*100)}%</span>
                </div>
              )}
              <div className="quickview-volume-tag">
                <span>{product.volume}</span>
              </div>
            </div>

            <p className="quickview-desc">{product.description}</p>

            {/* Feature Tabs */}
            <div className="quickview-tabs">
              <button 
                className={`quickview-tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
                onClick={() => setActiveTab('benefits')}
              >
                <Sparkles size={14} /> Key Benefits
              </button>
              <button 
                className={`quickview-tab-btn ${activeTab === 'usage' ? 'active' : ''}`}
                onClick={() => setActiveTab('usage')}
              >
                <RefreshCw size={14} /> How To Use
              </button>
            </div>

            <div className="quickview-tab-panel">
              {activeTab === 'benefits' && (
                <ul className="quickview-benefits-list">
                  {(product.benefits || [
                    "Formulated with professional salon-grade actives",
                    "Visible restorative results from the first application",
                    "Dermatologically and color-safe tested formula",
                    "Signature luxury French salon scent"
                  ]).map((b, idx) => (
                    <li key={idx}>
                      <span className="check-bullet"><Check size={12} /></span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'usage' && (
                <div className="quickview-usage-box">
                  <p>{product.howToUse || "Apply 1-2 pumps onto clean hair or skin as recommended by Looks Professional master stylists."}</p>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="quickview-action-footer">
              <div className="quickview-qty-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button 
                className="quickview-add-btn"
                onClick={handleAdd}
              >
                <ShoppingBag size={18} />
                <span>Add to Shopping Bag • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>

            <div className="quickview-stock-indicator">
              <span className="stock-dot"></span>
              <span>In Stock in Looks Professional Vault — Ships within 24 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
