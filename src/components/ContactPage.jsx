import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Send, 
  MessageCircle, 
  Navigation, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Car, 
  Coffee, 
  HelpCircle,
  Building2
} from 'lucide-react';

export default function ContactPage({ onOpenBooking, onNavigate }) {
  const { data, showToast } = useSalon();
  const [selectedBranchId, setSelectedBranchId] = useState('salon_01');

  // Contact Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: 'Mumbai (Bandra West)',
    inquiryType: 'Bespoke Hair & Styling',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedSalon = data.salons.find(s => s.id === selectedBranchId) || data.salons[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = (formData.phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      showToast('⚠️ Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast(`Thank you, ${formData.name}! Our concierge desk will contact you within 30 minutes.`);
      setFormData({
        name: '',
        email: '',
        phone: '',
        branch: 'Mumbai (Bandra West)',
        inquiryType: 'Bespoke Hair & Styling',
        message: ''
      });
    }, 800);
  };

  return (
    <div className="view-section active-view" style={{ background: 'var(--color-main-bg)', minHeight: '100vh', paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="section-container" style={{ padding: '0 24px' }}>
        
        {/* Page Hero Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <span className="section-tag">
            <Sparkles size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} />
            Concierge & Client Care
          </span>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '42px', 
            color: 'var(--color-deep-brown)', 
            marginBottom: '16px',
            lineHeight: 1.2
          }}>
            Get in Touch With Looks Professional
          </h1>
          <p style={{ color: 'var(--color-dark-rose)', fontSize: '16px', lineHeight: 1.7 }}>
            Whether arranging a private bridal aesthetic ritual, inquiring about master stylist consultations, or planning your visit, our concierge desk is dedicated to your utmost satisfaction.
          </p>
        </div>

        {/* 3 Quick VIP Direct Concierge Channels */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '50px' 
        }}>
          {/* Card 1: Phone Concierge */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--color-soft-rose)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px',
            boxShadow: '0 8px 24px rgba(48, 27, 28, 0.06)',
            textAlign: 'center',
            transition: 'var(--transition)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(185, 107, 97, 0.12)',
              color: 'var(--color-primary-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Phone size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-deep-brown)', marginBottom: '8px' }}>
              Telephone Concierge
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', marginBottom: '14px' }}>
              Direct line for bookings & general queries
            </p>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-rose)', marginBottom: '16px' }}>
              +91 98200 44551
            </div>
            <a 
              href="tel:+919820044551" 
              className="btn-outline-gold" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '13px', textDecoration: 'none' }}
            >
              Call Front Desk
            </a>
          </div>

          {/* Card 2: WhatsApp VIP Line */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--color-soft-rose)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px',
            boxShadow: '0 8px 24px rgba(48, 27, 28, 0.06)',
            textAlign: 'center',
            transition: 'var(--transition)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <MessageCircle size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-deep-brown)', marginBottom: '8px' }}>
              WhatsApp Priority Line
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', marginBottom: '14px' }}>
              Instant scheduling & stylist lookbooks
            </p>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#059669', marginBottom: '16px' }}>
              +91 98200 44550
            </div>
            <a 
              href="https://wa.me/919820044550?text=Hello%20Looks%20Professional%20Salon,%20I%20would%20like%20to%20inquire%20about%20a%20booking" 
              target="_blank" 
              rel="noreferrer"
              className="btn-gold" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                fontSize: '13px', 
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff'
              }}
            >
              <MessageCircle size={15} /> Chat on WhatsApp
            </a>
          </div>

          {/* Card 3: Executive Email Inquiries */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--color-soft-rose)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px 24px',
            boxShadow: '0 8px 24px rgba(48, 27, 28, 0.06)',
            textAlign: 'center',
            transition: 'var(--transition)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(208, 149, 131, 0.15)',
              color: 'var(--color-dark-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Mail size={24} />
            </div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-deep-brown)', marginBottom: '8px' }}>
              Email Concierge
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', marginBottom: '14px' }}>
              Bridal party, media & VIP suite requests
            </p>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-rose)', marginBottom: '16px' }}>
              concierge@looksprofessional.com
            </div>
            <a 
              href="mailto:concierge@looksprofessional.com?subject=Salon%20Inquiry%20-%20Looks%20Professional" 
              className="btn-outline-gold" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '13px', textDecoration: 'none' }}
            >
              Write to Us
            </a>
          </div>
        </div>

        {/* Main Grid: Branch Locations Details + Interactive Contact Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: '36px',
          alignItems: 'start',
          marginBottom: '60px'
        }}>
          
          {/* Left Column: Branch Locations & Amenities */}
          <div>
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--color-soft-rose)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: '0 8px 24px rgba(48, 27, 28, 0.06)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--color-deep-brown)' }}>
                  Our Salon Branches
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--color-primary-rose)', fontWeight: 600 }}>
                  3 Locations
                </span>
              </div>

              {/* Branch Selector Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {data.salons.map(salon => (
                  <button
                    key={salon.id}
                    onClick={() => setSelectedBranchId(salon.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      border: selectedBranchId === salon.id ? '1px solid var(--color-primary-rose)' : '1px solid var(--color-soft-rose)',
                      background: selectedBranchId === salon.id ? 'var(--gold-gradient)' : 'var(--color-light-pink)',
                      color: selectedBranchId === salon.id ? '#ffffff' : 'var(--color-dark-rose)',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {salon.name}
                  </button>
                ))}
              </div>

              {/* Selected Branch Active Info Box */}
              <div style={{
                background: 'var(--color-main-bg)',
                border: '1px solid var(--color-soft-rose)',
                borderRadius: 'var(--radius-md)',
                padding: '22px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Building2 size={20} color="var(--color-primary-rose)" />
                  <div>
                    <h4 style={{ fontSize: '17px', color: 'var(--color-deep-brown)', margin: 0 }}>
                      {selectedSalon.name}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-secondary-text)' }}>
                      Haute Couture Unisex Salon & Spa
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: 'var(--color-dark-rose)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <MapPin size={17} color="var(--color-primary-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{selectedSalon.address}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={17} color="var(--color-primary-rose)" style={{ flexShrink: 0 }} />
                    <span>{selectedSalon.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={17} color="var(--color-primary-rose)" style={{ flexShrink: 0 }} />
                    <span>{selectedSalon.openingHours} (Open Daily)</span>
                  </div>
                </div>

                {/* Branch Features / Amenities */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-light-pink)',
                  fontSize: '12px',
                  color: 'var(--color-deep-brown)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Car size={15} color="var(--color-primary-rose)" />
                    <span>Complimentary Valet</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Coffee size={15} color="var(--color-primary-rose)" />
                    <span>Espresso & Champagne Bar</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={15} color="var(--color-primary-rose)" />
                    <span>Private VIP Suites</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} color="var(--color-primary-rose)" />
                    <span>Master Restyling Team</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline-gold"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '13px', textDecoration: 'none' }}
                  >
                    <Navigation size={14} /> Open in Maps
                  </a>
                  <button
                    onClick={onOpenBooking}
                    className="btn-gold"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
                  >
                    <Calendar size={14} /> Book at Branch
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Note Box */}
            <div style={{
              background: 'var(--color-light-pink)',
              border: '1px solid var(--color-soft-rose)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <CheckCircle2 size={24} color="var(--color-primary-rose)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12.5px', color: 'var(--color-deep-brown)', lineHeight: 1.5 }}>
                <strong>Walk-In Policy:</strong> Walk-ins are always welcomed based on stylist availability. For bridal ritual suites and precision French balayage, booking at least 24 hours in advance is recommended.
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Appointment Inquiry Form */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--color-soft-rose)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px',
            boxShadow: '0 8px 24px rgba(48, 27, 28, 0.06)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-primary-rose)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Online Inquiry & Message
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--color-deep-brown)', marginTop: '4px' }}>
                Send Us a Message
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)' }}>
                Fill out the form below and our concierge desk will contact you via your preferred communication method.
              </p>
            </div>

            {submitted && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                color: '#065f46',
                fontSize: '13.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Message sent successfully! Our concierge desk will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Priya Deshmukh"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="form-control"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                  {formData.phone ? (
                    formData.phone.length === 10 ? (
                      <small style={{ color: '#10B981', fontSize: '11px', display: 'block', marginTop: '3px', fontWeight: 600 }}>✓ Valid 10-digit number</small>
                    ) : (
                      <small style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '3px' }}>10 digits required ({formData.phone.length}/10)</small>
                    )
                  ) : null}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="priya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Select Salon Branch</label>
                  <select
                    className="form-control"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  >
                    <option value="Mumbai (Bandra West)">Mumbai (Bandra West)</option>
                    <option value="Pune (Koregaon Park)">Pune (Koregaon Park)</option>
                    <option value="Gurugram (Cyber City)">Gurugram (Cyber City)</option>
                    <option value="Bengaluru (Preview Inquiries)">Bengaluru (Indiranagar)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Service of Interest</label>
                  <select
                    className="form-control"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  >
                    <option value="Bespoke Hair & Styling">Bespoke Hair & Styling</option>
                    <option value="HydraFacial & Skin Rituals">HydraFacial & Skin Rituals</option>
                    <option value="Bridal & Groom Aesthetic Suites">Bridal & Groom Aesthetic Suites</option>
                    <option value="Private VIP Suite Reservation">Private VIP Suite Reservation</option>
                    <option value="Membership & Corporate Privileges">Membership & Privileges</option>
                    <option value="Other Inquiries">Other Inquiries</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Message or Specific Requests</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Tell us about your desired date, preferred master stylist, or any special requests..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-gold"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '14px', fontSize: '14px', justifyContent: 'center' }}
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send size={16} /> Send Message to Concierge
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Salon FAQ Section */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--color-soft-rose)',
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          boxShadow: '0 8px 24px rgba(48, 27, 28, 0.06)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="section-tag">
              <HelpCircle size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} />
              Client Etiquette & FAQs
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', color: 'var(--color-deep-brown)' }}>
              Frequently Asked Questions
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--color-main-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-soft-rose)' }}>
              <h4 style={{ fontSize: '15px', color: 'var(--color-deep-brown)', marginBottom: '8px' }}>
                How far in advance should I book?
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', lineHeight: 1.6 }}>
                We recommend booking 2 to 4 days ahead for peak weekend slots. For bespoke bridal rituals and signature French balayage, booking 1 to 2 weeks prior ensures availability of our Senior Creative Directors.
              </p>
            </div>

            <div style={{ background: 'var(--color-main-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-soft-rose)' }}>
              <h4 style={{ fontSize: '15px', color: 'var(--color-deep-brown)', marginBottom: '8px' }}>
                Is valet parking provided at all salons?
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', lineHeight: 1.6 }}>
                Yes, all Looks Professional locations in Bandra West, Koregaon Park, and Cyber City offer complimentary secured valet parking at our entrance portico.
              </p>
            </div>

            <div style={{ background: 'var(--color-main-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-soft-rose)' }}>
              <h4 style={{ fontSize: '15px', color: 'var(--color-deep-brown)', marginBottom: '8px' }}>
                What is your cancellation or rescheduling policy?
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', lineHeight: 1.6 }}>
                We appreciate notice at least 4 hours before your scheduled appointment. Rescheduling can be done effortlessly directly from the Customer Portal or by calling our concierge.
              </p>
            </div>

            <div style={{ background: 'var(--color-main-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-soft-rose)' }}>
              <h4 style={{ fontSize: '15px', color: 'var(--color-deep-brown)', marginBottom: '8px' }}>
                Can I request a private VIP suite?
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-dark-rose)', lineHeight: 1.6 }}>
                Yes! We offer soundproofed private VIP styling suites featuring personal wash basins, complimentary refreshment bars, and dedicated creative stylists for bridal parties or high-profile guests.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
