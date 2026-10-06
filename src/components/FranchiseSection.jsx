import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Users, 
  MapPin, 
  PhoneCall, 
  DownloadCloud,
  X
} from 'lucide-react';

export default function FranchiseSection({ onOpenBooking }) {
  const [modalType, setModalType] = useState(null); // 'franchise' | 'academy' | null
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', investment: '25-50 Lakhs' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalType(null);
      setFormData({ name: '', phone: '', email: '', city: '', investment: '25-50 Lakhs' });
    }, 2500);
  };

  return (
    <section className="section-container studio99-franchise-section" id="franchise">
      {/* Header */}
      <div className="section-header text-center">
        <span className="section-tag">
          <Sparkles size={13} style={{ marginRight: '6px', color: 'var(--color-primary-teal)' }} />
          GROWTH & MASTERY • LOOKS PROFESSIONAL ECOSYSTEM
        </span>
        <h2 className="section-title">
          Franchise Partnership & <span className="gold-text-gradient">Beauty Academy</span>
        </h2>
        <p className="section-desc" style={{ maxWidth: '720px', margin: '0 auto' }}>
          Partner with India’s most profitable luxury unisex salon chain or master international cosmetology at the state-of-the-art Looks Professional Beauty Academy.
        </p>
      </div>

      {/* Franchise & Academy Dual Grid */}
      <div className="franchise-dual-grid">
        
        {/* 1. Salon Franchise Card */}
        <div className="franchise-luxury-card">
          <div className="franchise-card-image">
            <img 
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80" 
              alt="Looks Professional Salon Franchise Interior" 
            />
            <div className="franchise-badge-overlay">
              <Briefcase size={14} />
              <span>BUSINESS OPPORTUNITY</span>
            </div>
          </div>

          <div className="franchise-card-content">
            <h3 className="franchise-title">Looks Professional Salon Franchise</h3>
            <p className="franchise-lead">
              Own a high-ROI, award-winning unisex salon in your city with 100% turnkey setup support.
            </p>

            <ul className="franchise-benefits-list">
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>Proven FOFO & FOCO Models</strong> with 35%+ average annual ROI.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>End-to-End Setup:</strong> Site selection, 3D luxury interior architecture & equipment.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>Staff Recruitment & Training:</strong> Pre-trained certified hair & skin masters.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>National Brand Marketing:</strong> Digital campaigns, celebrity tie-ups & ERP billing.</span>
              </li>
            </ul>

            <div className="franchise-card-footer">
              <button 
                className="btn-hero-primary" 
                onClick={() => setModalType('franchise')}
              >
                <span>Request Franchise Deck</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Looks Professional Academy Card */}
        <div className="franchise-luxury-card academy-card">
          <div className="franchise-card-image">
            <img 
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80" 
              alt="Looks Professional Beauty Academy Training" 
            />
            <div className="franchise-badge-overlay academy-badge">
              <GraduationCap size={14} />
              <span>CAREER & DIPLOMA</span>
            </div>
          </div>

          <div className="franchise-card-content">
            <h3 className="franchise-title">Looks Professional Beauty Academy</h3>
            <p className="franchise-lead">
              Master international hair couture, clinical aesthetics, and HD bridal makeup with certified diplomas.
            </p>

            <ul className="franchise-benefits-list">
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>CIDESCO & NSDC Certified</strong> international cosmetology curriculum.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>Hands-On Live Training:</strong> Real client transformations in luxury studios.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>100% Placement Assurance</strong> across top salon chains & fashion studios.</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="benefit-icon" />
                <span><strong>Master Classes:</strong> Celebrity stylist workshops & runway portfolio building.</span>
              </li>
            </ul>

            <div className="franchise-card-footer">
              <button 
                className="btn-about-explore" 
                onClick={() => setModalType('academy')}
              >
                <span>Download Academy Brochure</span>
                <DownloadCloud size={15} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Modal Form */}
      {modalType && (
        <div className="stylist-modal-backdrop" onClick={() => setModalType(null)}>
          <div className="stylist-modal-dialog" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <button className="stylist-modal-close" onClick={() => setModalType(null)}>
              <X size={20} />
            </button>

            <div style={{ padding: '32px 28px' }}>
              <span className="modal-category-tag">
                {modalType === 'franchise' ? 'LOOKS PROFESSIONAL FRANCHISE PARTNERSHIP' : 'LOOKS PROFESSIONAL BEAUTY ACADEMY'}
              </span>
              <h3 className="modal-stylist-name" style={{ fontSize: '24px' }}>
                {modalType === 'franchise' ? 'Partner With Looks Professional' : 'Join Looks Professional Academy'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', marginBottom: '20px' }}>
                {modalType === 'franchise' 
                  ? 'Fill out the form below to receive the detailed Financial Model, ROI Projections & Franchise Dossier.' 
                  : 'Get the complete course syllabus, fee structures, and scholarship criteria.'}
              </p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <CheckCircle2 size={32} color="#10B981" />
                  </div>
                  <h4 style={{ color: 'var(--color-deep-brown)', marginBottom: '6px' }}>Request Received!</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Our Looks Professional representative will contact you on WhatsApp / Phone within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-deep-brown)', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control" 
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-deep-brown)', display: 'block', marginBottom: '4px' }}>Phone / WhatsApp *</label>
                      <input 
                        type="tel" 
                        inputMode="numeric"
                        required 
                        maxLength={10}
                        pattern="[0-9]{10}"
                        className="form-control" 
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      />
                      {formData.phone ? (
                        formData.phone.length === 10 ? (
                          <small style={{ color: '#10B981', fontSize: '11px', display: 'block', marginTop: '3px', fontWeight: 600 }}>✓ Valid 10-digit number</small>
                        ) : (
                          <small style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '3px' }}>10 digits required ({formData.phone.length}/10)</small>
                        )
                      ) : null}
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-deep-brown)', display: 'block', marginBottom: '4px' }}>City of Interest *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="e.g. Pune / Mumbai"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-deep-brown)', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      className="form-control" 
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {modalType === 'franchise' && (
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-deep-brown)', display: 'block', marginBottom: '4px' }}>Investment Budget</label>
                      <select 
                        className="form-control"
                        value={formData.investment}
                        onChange={e => setFormData({ ...formData, investment: e.target.value })}
                      >
                        <option value="20-35 Lakhs">₹20 - ₹35 Lakhs (Studio Format)</option>
                        <option value="35-60 Lakhs">₹35 - ₹60 Lakhs (Premium Lounge)</option>
                        <option value="60 Lakhs+">₹60 Lakhs+ (Flagship & Academy)</option>
                      </select>
                    </div>
                  )}

                  <button type="submit" className="btn-modal-book" style={{ marginTop: '10px' }}>
                    <span>Submit & Receive Instant Dossier</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
