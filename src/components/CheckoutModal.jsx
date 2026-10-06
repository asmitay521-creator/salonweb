import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Smartphone, 
  Building, 
  Banknote, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Printer, 
  FileText,
  MapPin,
  User,
  Phone,
  Mail,
  QrCode
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function CheckoutModal() {
  const { 
    data, 
    isCheckoutModalOpen, 
    setIsCheckoutModalOpen, 
    getCartMetrics, 
    placeEcomOrder,
    lastPlacedOrder,
    setLastPlacedOrder
  } = useSalon();

  const [step, setStep] = useState(1); // 1: Details & Shipping | 2: Payment | 3: Success Confirmation
  const [formData, setFormData] = useState({
    customerName: data.currentUser?.name || '',
    customerPhone: data.currentUser?.phone || '',
    customerEmail: data.currentUser?.email || '',
    address: 'Plot 42, Linking Road, Khar West',
    city: 'Mumbai',
    pincode: '400052',
    landmark: 'Near Starbucks Coffee',
    deliverySpeed: 'standard', // 'standard' | 'express'
    paymentMethod: 'upi', // 'upi' | 'card' | 'netbanking' | 'cod'
    upiId: 'priya@okhdfcbank',
    cardNumber: '4532 •••• •••• 8921',
    cardExpiry: '08/29',
    cardCvv: '•••',
    selectedBank: 'HDFC Bank',
    notes: 'Please hand over to concierge in luxury gift packaging.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isCheckoutModalOpen) return null;

  const metrics = getCartMetrics();
  const cart = data.cart || [];

  const expressDeliveryFee = formData.deliverySpeed === 'express' ? 199 : 0;
  const shippingFee = metrics.shipping + expressDeliveryFee;
  const finalGrandTotal = (metrics.subtotal - metrics.couponDiscount) + shippingFee;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone || !formData.address || !formData.pincode) {
      alert('Please fill all required delivery fields.');
      return;
    }
    const cleanPhone = (formData.customerPhone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeEcomOrder({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        landmark: formData.landmark,
        deliverySpeed: formData.deliverySpeed === 'express' ? 'VIP Express Courier (Same Day)' : 'Standard White-Glove (2-3 Days)',
        shippingFee: shippingFee,
        paymentMethod: 
          formData.paymentMethod === 'upi' ? 'UPI (Google Pay / PhonePe)' :
          formData.paymentMethod === 'card' ? 'Credit / Debit Card' :
          formData.paymentMethod === 'netbanking' ? `NetBanking (${formData.selectedBank})` :
          'Cash on Delivery',
        notes: formData.notes
      });

      setConfirmedOrder(order);
      setIsSubmitting(false);
      setStep(3);
    }, 1200);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
    setStep(1);
    setConfirmedOrder(null);
  };

  return (
    <div className="modal-backdrop luxury-modal-fade" onClick={handleClose}>
      <div 
        className="checkout-luxury-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="checkout-modal-header">
          <div className="checkout-header-branding">
            <span className="checkout-badge-gold">
              <Sparkles size={13} />
              LOOKS PROFESSIONAL BOUTIQUE CHECKOUT
            </span>
            <h2 className="checkout-modal-title">
              {step === 3 ? "Order Confirmed!" : "Secure Luxury Checkout"}
            </h2>
          </div>
          <button className="checkout-close-btn" onClick={handleClose} aria-label="Close Checkout">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator (Steps 1 & 2) */}
        {step < 3 && (
          <div className="checkout-stepper-bar">
            <div className={`checkout-step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-circle">{step > 1 ? <Check size={14} /> : '1'}</div>
              <span>1. Delivery & Address</span>
            </div>
            <div className={`checkout-step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`checkout-step-node ${step >= 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span>2. Payment & Verification</span>
            </div>
          </div>
        )}

        {/* Step 1: Client Delivery Information */}
        {step === 1 && (
          <div className="checkout-grid-layout">
            <form onSubmit={handleDetailsSubmit} className="checkout-form-column">
              <h3 className="checkout-section-subhead">
                <MapPin size={17} className="gold-text" />
                <span>Recipient & Shipping Address</span>
              </h3>

              <div className="checkout-form-grid">
                <div className="form-field-group col-span-2">
                  <label>Full Name *</label>
                  <div className="input-with-icon">
                    <User size={16} />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Priya Deshmukh"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label>Mobile Phone *</label>
                  <div className="input-with-icon">
                    <Phone size={16} />
                    <input 
                      type="tel" 
                      inputMode="numeric"
                      required
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                  </div>
                  {formData.customerPhone ? (
                    formData.customerPhone.length === 10 ? (
                      <small style={{ color: '#10B981', fontSize: '11px', display: 'block', marginTop: '3px', fontWeight: 600 }}>✓ Valid 10-digit number</small>
                    ) : (
                      <small style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '3px' }}>10 digits required ({formData.customerPhone.length}/10)</small>
                    )
                  ) : null}
                </div>

                <div className="form-field-group">
                  <label>Email Address (For Tax Invoice)</label>
                  <div className="input-with-icon">
                    <Mail size={16} />
                    <input 
                      type="email" 
                      placeholder="priya.deshmukh@gmail.com"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field-group col-span-2">
                  <label>Street Address, Flat / Villa No., Building *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Flat 402, Royale Crest, Linking Road"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>City *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>Pincode *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="400050"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                  />
                </div>

                <div className="form-field-group col-span-2">
                  <label>Landmark & VIP Delivery Notes</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Near Linking Road Starbucks, Call before arrival"
                    value={formData.landmark}
                    onChange={(e) => handleInputChange('landmark', e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <h3 className="checkout-section-subhead mt-4">
                <Truck size={17} className="gold-text" />
                <span>Select Luxury Delivery Method</span>
              </h3>

              <div className="delivery-speed-grid">
                <label className={`delivery-speed-card ${formData.deliverySpeed === 'standard' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="deliverySpeed"
                    checked={formData.deliverySpeed === 'standard'}
                    onChange={() => handleInputChange('deliverySpeed', 'standard')}
                  />
                  <div className="speed-info">
                    <div className="speed-title-row">
                      <strong>Standard White-Glove Delivery</strong>
                      <span className="speed-price">{metrics.shipping === 0 ? 'FREE' : `₹${metrics.shipping}`}</span>
                    </div>
                    <p>Insulated temperature-safe packaging. Delivered in 2-3 business days.</p>
                  </div>
                </label>

                <label className={`delivery-speed-card ${formData.deliverySpeed === 'express' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="deliverySpeed"
                    checked={formData.deliverySpeed === 'express'}
                    onChange={() => handleInputChange('deliverySpeed', 'express')}
                  />
                  <div className="speed-info">
                    <div className="speed-title-row">
                      <strong>VIP Salon Express Courier</strong>
                      <span className="speed-price">₹199</span>
                    </div>
                    <p>Same-Day VIP hand delivery directly from Looks Professional salon vault.</p>
                  </div>
                </label>
              </div>

              <div className="checkout-form-actions">
                <button type="submit" className="btn-proceed-payment">
                  <span>Continue to Payment</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Sidebar Summary */}
            <div className="checkout-sidebar-summary">
              <h4 className="sidebar-summary-title">Order Items ({metrics.totalItems})</h4>
              <div className="checkout-sidebar-items">
                {cart.map(item => (
                  <div key={item.id} className="sidebar-item-row">
                    <img src={item.image} alt={item.name} className="sidebar-item-thumb" />
                    <div className="sidebar-item-meta">
                      <h5>{item.name}</h5>
                      <span>Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="sidebar-item-amount">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sidebar-bill-details">
                <div className="bill-line">
                  <span>Subtotal</span>
                  <span>₹{metrics.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {metrics.couponDiscount > 0 && (
                  <div className="bill-line discount">
                    <span>Coupon ({data.appliedCoupon?.code})</span>
                    <span>-₹{metrics.couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="bill-line">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="bill-line">
                  <span>Taxes (5% GST)</span>
                  <span>₹{metrics.tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="bill-total-line">
                  <span>Grand Total</span>
                  <span className="total-gold-val">₹{finalGrandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="checkout-guarantee-note">
                <ShieldCheck size={16} className="gold-text" />
                <span>100% Guaranteed Official Salon Formulations</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment & Verification */}
        {step === 2 && (
          <div className="checkout-grid-layout">
            <div className="checkout-form-column">
              <div className="payment-options-header">
                <h3 className="checkout-section-subhead">
                  <CreditCard size={17} className="gold-text" />
                  <span>Choose Payment Method</span>
                </h3>
                <span className="ssl-secured-tag">
                  <Lock size={12} /> 256-Bit Encrypted
                </span>
              </div>

              {/* Payment Tabs / Radio options */}
              <div className="payment-methods-stack">
                {/* 1. UPI Payment */}
                <div className={`payment-method-card ${formData.paymentMethod === 'upi' ? 'active' : ''}`}>
                  <label className="method-label-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={() => handleInputChange('paymentMethod', 'upi')}
                    />
                    <div className="method-title-wrap">
                      <Smartphone size={18} className="gold-text" />
                      <strong>Instant UPI / Google Pay / PhonePe / QR Code</strong>
                    </div>
                    <span className="popular-badge">FASTEST</span>
                  </label>

                  {formData.paymentMethod === 'upi' && (
                    <div className="payment-subpanel">
                      <div className="upi-qr-preview-box">
                        <div className="upi-qr-code">
                          <QrCode size={110} color="#301B1C" />
                        </div>
                        <div className="upi-qr-meta">
                          <p className="scan-instructions">Scan QR code using any UPI app (GPay, Paytm, PhonePe, Cred)</p>
                          <div className="upi-id-box">
                            <span>UPI ID: <strong>looksprofessional@hdfcbank</strong></span>
                          </div>
                          <span className="verified-merchant-seal">✓ Verified Looks Professional Boutique Merchant</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Credit / Debit Cards */}
                <div className={`payment-method-card ${formData.paymentMethod === 'card' ? 'active' : ''}`}>
                  <label className="method-label-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => handleInputChange('paymentMethod', 'card')}
                    />
                    <div className="method-title-wrap">
                      <CreditCard size={18} className="gold-text" />
                      <strong>Credit / Debit Card (Visa, Mastercard, RuPay, Amex)</strong>
                    </div>
                  </label>

                  {formData.paymentMethod === 'card' && (
                    <div className="payment-subpanel">
                      <div className="card-fields-grid">
                        <div className="form-field-group col-span-2">
                          <label>Card Number</label>
                          <input 
                            type="text" 
                            placeholder="4532 •••• •••• 8921"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          />
                        </div>
                        <div className="form-field-group">
                          <label>Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM / YY"
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                          />
                        </div>
                        <div className="form-field-group">
                          <label>CVV / CVC</label>
                          <input 
                            type="password" 
                            maxLength="4"
                            placeholder="•••"
                            value={formData.cardCvv}
                            onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Net Banking */}
                <div className={`payment-method-card ${formData.paymentMethod === 'netbanking' ? 'active' : ''}`}>
                  <label className="method-label-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'netbanking'}
                      onChange={() => handleInputChange('paymentMethod', 'netbanking')}
                    />
                    <div className="method-title-wrap">
                      <Building size={18} className="gold-text" />
                      <strong>Net Banking (All Indian Major Banks)</strong>
                    </div>
                  </label>

                  {formData.paymentMethod === 'netbanking' && (
                    <div className="payment-subpanel">
                      <select 
                        value={formData.selectedBank}
                        onChange={(e) => handleInputChange('selectedBank', e.target.value)}
                        className="bank-select-dropdown"
                      >
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* 4. Cash on Delivery */}
                <div className={`payment-method-card ${formData.paymentMethod === 'cod' ? 'active' : ''}`}>
                  <label className="method-label-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => handleInputChange('paymentMethod', 'cod')}
                    />
                    <div className="method-title-wrap">
                      <Banknote size={18} className="gold-text" />
                      <strong>Cash on Delivery (White-Glove Courier Verification)</strong>
                    </div>
                  </label>
                </div>
              </div>

              <div className="payment-footer-buttons">
                <button 
                  type="button" 
                  className="btn-back-details"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  ← Edit Address
                </button>

                <button 
                  type="button" 
                  className="btn-confirm-payment-final"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Authorizing & Placing Luxury Order...</span>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Pay ₹{finalGrandTotal.toLocaleString('en-IN')} & Confirm Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="checkout-sidebar-summary">
              <h4 className="sidebar-summary-title">Delivery To</h4>
              <div className="sidebar-address-preview">
                <strong>{formData.customerName}</strong>
                <p>{formData.address}, {formData.city} - {formData.pincode}</p>
                <p>Phone: {formData.customerPhone}</p>
                <span className="delivery-type-pill">
                  {formData.deliverySpeed === 'express' ? '🚀 VIP Same-Day Courier' : '📦 Standard White-Glove'}
                </span>
              </div>

              <div className="sidebar-bill-details mt-4">
                <div className="bill-line">
                  <span>Bag Items ({metrics.totalItems})</span>
                  <span>₹{metrics.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {metrics.couponDiscount > 0 && (
                  <div className="bill-line discount">
                    <span>Discount</span>
                    <span>-₹{metrics.couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="bill-line">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="bill-total-line">
                  <span>Payable Amount</span>
                  <span className="total-gold-val">₹{finalGrandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Order Confirmed Celebration Screen */}
        {step === 3 && confirmedOrder && (
          <div className="order-confirmed-screen">
            <div className="order-celebrate-animation">
              <div className="celebrate-circle">
                <Check size={40} />
              </div>
            </div>

            <div className="celebrate-badge">
              <Sparkles size={14} />
              <span>THANK YOU FOR YOUR LUXURY ORDER</span>
            </div>

            <h2 className="celebrate-title">Your Boutique Order is Confirmed!</h2>
            <p className="celebrate-subtitle">
              We have received your order <strong>#{confirmedOrder.orderId}</strong>. A confirmation email and SMS dispatch link have been sent to <strong>{confirmedOrder.customer.email || confirmedOrder.customer.phone}</strong>.
            </p>

            {/* Order Receipt Box */}
            <div className="order-receipt-card" id="printable-order-receipt">
              <div className="receipt-header-row">
                <div>
                  <span className="receipt-brand">LOOKS PROFESSIONAL</span>
                  <span className="receipt-tag">LUXURY BOUTIQUE INVOICE</span>
                </div>
                <div className="receipt-id-date">
                  <span>Order ID: <strong>#{confirmedOrder.orderId}</strong></span>
                  <span>Date: {confirmedOrder.date}</span>
                </div>
              </div>

              <div className="receipt-client-grid">
                <div className="client-meta-box">
                  <strong>Delivering To:</strong>
                  <p>{confirmedOrder.customer.name}</p>
                  <p>{confirmedOrder.customer.address}, {confirmedOrder.customer.city} - {confirmedOrder.customer.pincode}</p>
                  <p>Mobile: {confirmedOrder.customer.phone}</p>
                </div>
                <div className="client-meta-box">
                  <strong>Payment & Delivery:</strong>
                  <p>Method: {confirmedOrder.paymentMethod}</p>
                  <p>Status: <span className="paid-status-tag">{confirmedOrder.paymentStatus}</span></p>
                  <p>Courier: {confirmedOrder.deliverySpeed}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="receipt-table-wrapper">
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong>{it.name}</strong>
                          {it.volume && <span className="vol-sub"> ({it.volume})</span>}
                        </td>
                        <td>{it.quantity}</td>
                        <td>₹{it.price.toLocaleString('en-IN')}</td>
                        <td style={{ textAlign: 'right' }}>₹{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3">Subtotal</td>
                      <td style={{ textAlign: 'right' }}>₹{confirmedOrder.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    {confirmedOrder.discount > 0 && (
                      <tr>
                        <td colSpan="3">Boutique Discount ({confirmedOrder.couponCode})</td>
                        <td style={{ textAlign: 'right', color: '#B96B61' }}>-₹{confirmedOrder.discount.toLocaleString('en-IN')}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="3">Delivery Charges</td>
                      <td style={{ textAlign: 'right' }}>{confirmedOrder.shipping === 0 ? 'FREE' : `₹${confirmedOrder.shipping}`}</td>
                    </tr>
                    <tr className="grand-total-row">
                      <td colSpan="3"><strong>Total Paid</strong></td>
                      <td style={{ textAlign: 'right' }}><strong>₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="celebrate-actions-row">
              <button className="btn-print-invoice" onClick={handlePrintInvoice}>
                <Printer size={16} />
                <span>Print Tax Invoice</span>
              </button>
              <button className="btn-continue-shopping" onClick={handleClose}>
                <ShoppingBag size={16} />
                <span>Continue Boutique Shopping</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
