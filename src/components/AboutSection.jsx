import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Crown, 
  Star,
  Sparkle,
  Scissors,
  Award,
  ShieldCheck,
  Heart
} from 'lucide-react';

export default function AboutSection({ onOpenBooking, onNavigate }) {
  return (
    <section className="about-luxury-section" id="about">
      {/* Ambient background glow orbs */}
      <div className="about-ambient-shape shape-left"></div>
      <div className="about-ambient-shape shape-right"></div>

      <div className="about-container">
        
        {/* ================= LEFT COLUMN: ANIMATED ARCHED PHOTO COLLAGE ================= */}
        <div className="about-collage-wrap">
          
          {/* Ambient Glow Aura behind Arches */}
          <div className="arch-glow-aura"></div>

          {/* Main Left Arched Photo Frame (Female Stylist Cutting Hair) */}
          <div className="arch-photo-frame arch-left animated-float-left">
            <div className="arch-img-inner">
              <img 
                src="/assets/images/about_stylist_female.jpg" 
                alt="Looks Professional Master Stylist precision haircutting" 
                className="arch-img"
              />
              <div className="arch-overlay-glow"></div>
              <div className="arch-shine-sweep"></div>
            </div>
            {/* Corner Decorative Accent */}
            <div className="arch-accent-corner corner-top"></div>
          </div>

          {/* Secondary Overlapping Arched Photo Frame (Male Barber & Client) */}
          <div className="arch-photo-frame arch-right animated-float-right">
            <div className="arch-img-inner">
              <img 
                src="/assets/images/about_barber_male.jpg" 
                alt="Looks Professional Master Barber grooming client" 
                className="arch-img"
              />
              <div className="arch-overlay-glow"></div>
              <div className="arch-shine-sweep"></div>
            </div>
            {/* Corner Decorative Accent */}
            <div className="arch-accent-corner corner-bottom"></div>
          </div>

          {/* Floating Luxury Experience Badge (Top Left) */}
          <div className="floating-experience-badge badge-top-left">
            <div className="exp-badge-icon">
              <Crown size={16} />
            </div>
            <div className="exp-badge-info">
              <span className="exp-badge-title">HAUTE COUTURE</span>
              <span className="exp-badge-sub">Luxury Unisex Studio</span>
            </div>
          </div>

          {/* Floating Rating & Trust Badge (Bottom Right) */}
          <div className="floating-experience-badge badge-bottom-right">
            <div className="rating-stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="star-filled" />
              ))}
            </div>
            <div className="exp-badge-info">
              <span className="exp-badge-title">4.9 / 5 Certified Rating</span>
              <span className="exp-badge-sub">15,000+ Happy Guests</span>
            </div>
          </div>

          {/* Floating Animated Salon Tools */}
          <div className="floating-tool tool-scissors animated-tool-snip">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-rose)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>

          <div className="floating-tool tool-comb animated-tool-bob">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark-rose)" strokeWidth="1.6" strokeLinecap="round">
              <rect x="2" y="6" width="20" height="4" rx="1" />
              <line x1="4" y1="10" x2="4" y2="18" />
              <line x1="7" y1="10" x2="7" y2="18" />
              <line x1="10" y1="10" x2="10" y2="18" />
              <line x1="13" y1="10" x2="13" y2="18" />
              <line x1="16" y1="10" x2="16" y2="18" />
              <line x1="19" y1="10" x2="19" y2="18" />
            </svg>
          </div>

          <div className="floating-tool tool-sparkle animated-tool-sparkle">
            <Sparkles size={26} color="var(--color-rose-gold)" />
          </div>

        </div>

        {/* ================= RIGHT COLUMN: EDITORIAL STORY & INFORMATION ================= */}
        <div className="about-content-column">
          
          {/* Top Label with Ornamental Feathered Arrow Divider */}
          <div className="about-label-row">
            <span className="about-badge-text">About Us</span>
            <div className="about-feather-arrow">
              <svg width="90" height="14" viewBox="0 0 90 14" fill="none">
                <line x1="0" y1="7" x2="75" y2="7" stroke="var(--color-primary-rose)" strokeWidth="1.5" />
                <polygon points="75,3 84,7 75,11" fill="var(--color-primary-rose)" />
                <line x1="68" y1="3" x2="72" y2="7" stroke="var(--color-primary-rose)" strokeWidth="1.5" />
                <line x1="68" y1="11" x2="72" y2="7" stroke="var(--color-primary-rose)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Main Headline */}
          <h2 className="about-main-headline">
            Crafting Signature Elegance,{' '}
            <span className="headline-highlight">Redefining Unisex Salon Experience.</span>
          </h2>

          {/* Comprehensive Editorial Story Container */}
          <div className="about-story-rich-wrap">
            <p className="about-paragraph-lead">
              Established with a vision to redefine luxury grooming in India, <strong>Looks Professional Unisex Salon</strong> has grown into one of the country's most celebrated premier salon networks, welcoming guests across Mumbai, Pune, Gurugram, and Bengaluru. We deliver scientifically formulated hair couture, precision styling, and advanced clinical skincare using globally trusted formulations.
            </p>

            <p className="about-paragraph-body">
              From head-to-toe beauty treatments to bespoke bridal artistry and certified cosmetology education, <strong>Looks Professional</strong> offers 5-star salon experiences at exceptional value. We believe beauty is deeply personal, which is why our master artisans craft customized solutions tailored to your unique hair texture, skin tone, and personal aesthetic.
            </p>

            {/* A First-of-Its-Kind Ambience Sub-block */}
            <div className="about-ambience-callout">
              <h3 className="ambience-subheading">
                <Sparkle size={17} className="ambience-icon" />
                <span>7-Star Studio Ambience &amp; Academy Mastery</span>
              </h3>
              <p className="ambience-text">
                At <strong>Looks Professional</strong>, every visit is an indulgence. Our lounges feature private soundproof VIP suites, ergonomic memory-foam styling stations, hospital-grade autoclave tool sterilization, and complimentary artisan barista coffee — ensuring a serene, hygienic, and truly world-class salon sanctuary.
              </p>
            </div>
          </div>

          {/* Action Row: Primary Booking Button & Explore Services */}
          <div className="about-actions-row">
            <button className="btn-hero-primary" onClick={onOpenBooking}>
              <Sparkles size={16} />
              <span>Book Your Transformation</span>
              <ArrowRight size={16} />
            </button>

            {onNavigate && (
              <button 
                className="btn-about-explore"
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore Services Menu</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Studio99 SVG Bottom Curve Divider transitioning to White Services */}
      <div className="nectar-shape-divider-wrap">
        <svg className="nectar-shape-divider" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M 0 0 c 0 0 200 50 500 50 s 500 -50 500 -50 v 101 h -1000 v -100 z"></path>
        </svg>
      </div>
    </section>
  );
}
