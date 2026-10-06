import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Check, 
  Lock
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function CartDrawer() {
  const { 
    data, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    setIsCheckoutModalOpen,
    removeFromCart, 
    updateCartQuantity, 
    clearCart,
    applyCartCoupon, 
    removeCartCoupon, 
    getCartMetrics 
  } = useSalon();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const cart = data.cart || [];
  const metrics = getCartMetrics();
  const appliedCoupon = data.appliedCoupon;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    setCouponError('');
    const result = applyCartCoupon(couponInput);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const handleQuickApplyCode = (code) => {
    setCouponError('');
    applyCartCoupon(code);
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  // Free shipping percentage
  const freeShippingProgress = Math.min(100, Math.round((metrics.subtotal / metrics.freeShippingThreshold) * 100));

  return (
    <div className="cart-drawer-overlay" onClick={() => setIsCartDrawerOpen(false)}>
      <aside 
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Bag Drawer"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-wrap">
            <ShoppingBag size={20} className="cart-icon-gold" />
            <h2 className="cart-title">Your Luxury Bag</h2>
            <span className="cart-count-badge">{metrics.totalItems}</span>
          </div>

          <div className="cart-header-actions">
            {cart.length > 0 && (
              <button 
                className="cart-clear-btn" 
                onClick={clearCart}
                title="Clear all items"
              >
                Clear
              </button>
            )}
            <button 
              className="cart-close-btn" 
              onClick={() => setIsCartDrawerOpen(false)}
              aria-label="Close Shopping Bag"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="cart-shipping-meter">
          <div className="shipping-meter-text">
            {metrics.hasFreeShipping ? (
              <span className="shipping-unlocked">
                <Sparkles size={14} /> You have unlocked <strong>FREE White-Glove Delivery!</strong>
              </span>
            ) : (
              <span>
                Add <strong className="gold-text">₹{metrics.amountToFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>
              </span>
            )}
          </div>
          <div className="shipping-progress-track">
            <div 
              className="shipping-progress-fill" 
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Content Body */}
        {cart.length === 0 ? (
          <div className="cart-empty-body">
            <div className="cart-empty-icon-box">
              <ShoppingBag size={48} />
            </div>
            <h3>Your Bag is Empty</h3>
            <p>Discover our curated master hair elixirs, 24K gold clinical serums, and luxury salon tools.</p>
            <button 
              className="btn-start-shopping"
              onClick={() => {
                setIsCartDrawerOpen(false);
                const shopEl = document.getElementById('shop');
                if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore Boutique Products</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Items List */}
            <div className="cart-items-scroll-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-img"
                  />

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <span className="cart-item-brand">{item.brand}</span>
                      <button 
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h4 className="cart-item-title">{item.name}</h4>
                    
                    {item.volume && (
                      <span className="cart-item-volume">{item.volume}</span>
                    )}

                    <div className="cart-item-bottom">
                      <div className="cart-item-qty-stepper">
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="stepper-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="stepper-val">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="stepper-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="cart-item-price-wrap">
                        <span className="item-unit-calc">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</span>
                        <span className="item-total-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="cart-coupon-section">
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <div className="coupon-pill-info">
                    <Tag size={15} className="coupon-gold-icon" />
                    <div>
                      <span className="coupon-code-badge">{appliedCoupon.code}</span>
                      <span className="coupon-save-text">Saved ₹{metrics.couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button 
                    className="coupon-remove-btn"
                    onClick={removeCartCoupon}
                    title="Remove coupon"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} className="coupon-input-form">
                    <input 
                      type="text" 
                      placeholder="Enter Promo Code (e.g. LOOKS20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="coupon-text-field"
                    />
                    <button type="submit" className="coupon-apply-btn">
                      Apply
                    </button>
                  </form>
                  {couponError && (
                    <p className="coupon-error-msg">{couponError}</p>
                  )}

                  {/* Quick Click Coupons */}
                  <div className="quick-coupons-row">
                    <span className="quick-label">Available Offers:</span>
                    <button 
                      type="button" 
                      className="quick-coupon-tag"
                      onClick={() => handleQuickApplyCode('LOOKS20')}
                    >
                      LOOKS20 (-20%)
                    </button>
                    <button 
                      type="button" 
                      className="quick-coupon-tag"
                      onClick={() => handleQuickApplyCode('WELCOME500')}
                    >
                      WELCOME500 (-₹500)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Bill Summary */}
            <div className="cart-summary-section">
              <div className="summary-row">
                <span>Bag Subtotal</span>
                <span>₹{metrics.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {metrics.couponDiscount > 0 && (
                <div className="summary-row discount-row">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="gold-text">-₹{metrics.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated GST (5% Included)</span>
                <span>₹{metrics.tax.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-row">
                <span>White-Glove Delivery</span>
                <span>
                  {metrics.shipping === 0 ? (
                    <span className="free-shipping-tag">FREE</span>
                  ) : (
                    `₹${metrics.shipping}`
                  )}
                </span>
              </div>

              {metrics.totalSavings > 0 && (
                <div className="total-savings-banner">
                  <Sparkles size={14} />
                  <span>Total Savings on this order: <strong>₹{metrics.totalSavings.toLocaleString('en-IN')}</strong></span>
                </div>
              )}

              <div className="summary-grand-total">
                <div className="total-label-wrap">
                  <span className="grand-label">Grand Total</span>
                  <span className="inclusive-tax">(Inclusive of all luxury duties & taxes)</span>
                </div>
                <div className="grand-price">
                  <span className="currency">₹</span>
                  <span className="amount">{metrics.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button 
                className="btn-checkout-primary"
                onClick={handleProceedToCheckout}
              >
                <Lock size={16} />
                <span>Proceed to Secure Checkout • ₹{metrics.grandTotal.toLocaleString('en-IN')}</span>
                <ArrowRight size={16} />
              </button>

              <div className="cart-trust-badges">
                <span className="trust-badge-item"><ShieldCheck size={13} /> 256-Bit SSL Encrypted</span>
                <span className="trust-badge-item"><Truck size={13} /> Insulated Packaging</span>
                <span className="trust-badge-item"><Check size={13} /> 100% Authentic</span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
