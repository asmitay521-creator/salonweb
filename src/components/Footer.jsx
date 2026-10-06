import React from 'react';
import { Phone, Mail, Clock, ChevronRight, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('customer');
    }
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer className="salon-footer looks-footer" style={{ background: 'linear-gradient(180deg, #F1ECE6 0%, #E7DFD4 100%)', borderTop: '1px solid rgba(212, 163, 115, 0.35)', color: '#1E293B', padding: '32px 24px 16px' }}>
      <div className="footer-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
        
        {/* Col 1: Salon Identity & Contact */}
        <div className="footer-col brand-col">
          <div className="looks-footer-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px', background: '#FFFFFF', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(212, 163, 115, 0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span className="logo-text-large" style={{ color: '#111111', fontWeight: 900, letterSpacing: '1px', fontSize: '18px', fontFamily: 'var(--font-serif)' }}>LOOKS</span>
            <span className="logo-badge-professional" style={{ background: 'linear-gradient(135deg, #D4A373, #B8860B)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.8px' }}>PROFESSIONAL</span>
          </div>

          <p style={{ color: '#556977', fontSize: '12.5px', lineHeight: 1.6, marginBottom: '14px', fontFamily: 'var(--font-sans)', maxWidth: '340px' }}>
            India's premier destination for bespoke hair styling, precision cuts, advanced skin care, bridal makeovers, and unisex grooming at Looks Professional.
          </p>
          
          <div className="footer-contact-items" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(212, 163, 115, 0.18)', border: '1px solid rgba(212, 163, 115, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={13} color="#8A5A2B" />
              </div>
              <div>
                <a href="tel:+919811122334" style={{ color: '#111827', textDecoration: 'none', fontWeight: 700 }}>+91 98111 22334</a>
                <span style={{ color: '#94A3B8', margin: '0 5px' }}>/</span>
                <a href="https://wa.me/919811122334" target="_blank" rel="noopener noreferrer" style={{ color: '#8A5A2B', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}>WhatsApp Concierge</a>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(212, 163, 115, 0.18)', border: '1px solid rgba(212, 163, 115, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={13} color="#8A5A2B" />
              </div>
              <a href="mailto:vip@looksprofessional.com" style={{ color: '#111827', textDecoration: 'none', fontWeight: 600 }}>vip@looksprofessional.com</a>
            </div>

            <div style={{ fontSize: '12.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(212, 163, 115, 0.18)', border: '1px solid rgba(212, 163, 115, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={13} color="#8A5A2B" />
              </div>
              <span style={{ color: '#556977', fontWeight: 500 }}>Mon – Sun: 09:00 AM – 09:00 PM</span>
            </div>
          </div>
        </div>

        {/* Col 2: Website Navigation */}
        <div className="footer-col">
          <h4 style={{ color: '#0F172A', fontSize: '15px', fontWeight: 800, marginBottom: '12px', fontFamily: 'var(--font-serif)', letterSpacing: '0.4px' }}>
            Quick Links
          </h4>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <ChevronRight size={13} color="#D4A373" /> Home
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <ChevronRight size={13} color="#D4A373" /> About Us
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <ChevronRight size={13} color="#D4A373" /> Our Services
              </a>
            </li>
            <li>
              <a href="#gallery" onClick={(e) => handleLinkClick(e, 'gallery')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <ChevronRight size={13} color="#D4A373" /> Photo Gallery
              </a>
            </li>
            <li>
              <a href="#transformations" onClick={(e) => handleLinkClick(e, 'transformations')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <ChevronRight size={13} color="#D4A373" /> Before &amp; After Studio
              </a>
            </li>
            <li>
              <a href="#stylists" onClick={(e) => handleLinkClick(e, 'stylists')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <ChevronRight size={13} color="#D4A373" /> Master Stylists
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleLinkClick(e, 'contact')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <ChevronRight size={13} color="#D4A373" /> Signature Packages
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Salon Services */}
        <div className="footer-col">
          <h4 style={{ color: '#0F172A', fontSize: '15px', fontWeight: 800, marginBottom: '12px', fontFamily: 'var(--font-serif)', letterSpacing: '0.4px' }}>
            Salon Services
          </h4>
          <ul className="footer-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <Sparkles size={12} color="#D4A373" /> French Balayage &amp; Colour Melt
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <Sparkles size={12} color="#D4A373" /> 24K Gold HydraFacial Glow
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <Sparkles size={12} color="#D4A373" /> Haute Couture Bridal Makeover
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <Sparkles size={12} color="#D4A373" /> Keratin &amp; Molecular Bond Repair
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <Sparkles size={12} color="#D4A373" /> Scalp Detox &amp; Hair Spa
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <Sparkles size={12} color="#D4A373" /> Gentleman's Shave &amp; Grooming
              </a>
            </li>
            <li>
              <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} style={{ color: '#556977', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#0F172A'} onMouseLeave={e => e.currentTarget.style.color = '#556977'}>
                <Sparkles size={12} color="#D4A373" /> Russian Gel Nails &amp; Pedicure
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom" style={{ maxWidth: '1280px', margin: '20px auto 0', borderTop: '1px solid rgba(212, 163, 115, 0.25)', paddingTop: '14px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', color: '#64748B', fontSize: '12px' }}>
        <div>
          © 2026 <strong style={{ color: '#111827' }}>LOOKS PROFESSIONAL</strong> Unisex Salon. All Rights Reserved.
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>100% Sterilized Equipment</span>
          <span>•</span>
          <span>Certified Master Stylists</span>
          <span>•</span>
          <span>L'Oréal &amp; Olaplex Certified</span>
        </div>
      </div>
    </footer>
  );
}
