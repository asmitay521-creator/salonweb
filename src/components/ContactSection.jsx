import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  Sparkles, 
  Award,
  Crown, 
  Car,
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Calendar, 
  ArrowRight, 
  Check, 
  Star,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

const SALON_PACKAGES = [
  {
    id: 'bridal_royal',
    badge: 'HAUTE COUTURE BRIDAL',
    badgeIcon: '👰',
    title: 'The Royal Bridal & Red Carpet Suite',
    desc: 'Complete head-to-toe bridal sanctuary ritual in private VIP soundproof suite with champagne hospitality.',
    price: '₹7,999',
    originalPrice: '₹12,500',
    discount: '35% OFF',
    duration: '240 Mins',
    popular: true,
    features: [
      '18-Hour Waterproof HD Airbrush Bridal Makeup',
      '24K Gold Nano-Foil Clinical HydraFacial',
      'Couture Hair Architecture & Crystal Dupatta Setting',
      'Russian Gel Nails & Paraffin Reflexology Bath',
      'Complimentary Groom / Bridesmaid Touch-up Pass'
    ]
  },
  {
    id: 'hair_transformation',
    badge: 'SIGNATURE HAIR CRAFT',
    badgeIcon: '✂️',
    title: 'French Balayage & Molecular Bond Revival',
    desc: 'Bespoke dimensional hair coloring with patented bond multiplicator for dazzling mirror-shine elasticity.',
    price: '₹6,499',
    originalPrice: '₹9,800',
    discount: '30% OFF',
    duration: '180 Mins',
    popular: false,
    features: [
      'Hand-Painted Parisian Caramel / Blonde Balayage',
      'Olaplex No. 1 & No. 2 Molecular Disulfide Seal',
      'Custom Honey Gloss Toner & Shine Glaze',
      'Ultrasonic Scalp Detox & Steam Therapy',
      'Signature Runway Blowout & Argan Oil Seal'
    ]
  },
  {
    id: 'mens_executive',
    badge: "GENTLEMAN'S ROYAL LOUNGE",
    badgeIcon: '🧔',
    title: "The Executive Gentleman's Royal Indulgence",
    desc: 'The ultimate royal barbering and facial rejuvenation experience designed for modern executives.',
    price: '₹2,499',
    originalPrice: '₹4,200',
    discount: '40% OFF',
    duration: '90 Mins',
    popular: false,
    features: [
      'Master Scissor Haircut & Precision Low Taper Fade',
      'Steaming Eucalyptus Towel Straight-Razor Shave',
      'Deep Volcanic Charcoal Clarifying Facial',
      'Cold-Pressed Sandalwood Scalp & Neck Massage',
      'Beard Sculpting & Moroccan Argan Butter Treatment'
    ]
  }
];

export default function ContactSection({ onNavigate, onOpenBooking }) {
  const { data, getCurrentSalon, setCurrentSalonId } = useSalon();
  const currentSalon = getCurrentSalon();
  const salonsList = data.salons || [];

  return (
    <section className="salon-experience-section" id="contact">
      <div className="experience-ambient-glow"></div>

      <div className="section-container">
        {/* Luxury Header */}
        <div className="section-header-center">
          <div className="luxury-badge">
            <Sparkles size={14} />
            <span>CURATED SALON PACKAGES &amp; VIP COMBOS</span>
          </div>
          <h2 className="section-title">Signature Salon Packages &amp; VIP Rituals</h2>
          <div className="luxury-divider">
            <span className="divider-line"></span>
            <span className="divider-diamond">◆</span>
            <span className="divider-line"></span>
          </div>
          <p className="section-subtitle">
            All-inclusive head-to-toe beauty packages combining master hair architecture, clinical derma elixirs, and royal pampering at exclusive package pricing.
          </p>
        </div>

        {/* 3 Luxury Packages Cards Grid */}
        <div className="salon-packages-grid">
          {SALON_PACKAGES.map((pkg) => (
            <div key={pkg.id} className={`salon-package-card ${pkg.popular ? 'featured-package' : ''}`}>
              {pkg.popular && (
                <div className="package-popular-tag">
                  <Crown size={12} />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div className="package-header">
                <span className="package-badge-pill">
                  <span>{pkg.badgeIcon}</span>
                  <span>{pkg.badge}</span>
                </span>
                <h3 className="package-title">{pkg.title}</h3>
                <p className="package-desc">{pkg.desc}</p>
              </div>

              <div className="package-pricing-box">
                <div className="price-main-row">
                  <span className="package-price">{pkg.price}</span>
                  <span className="package-original-price">{pkg.originalPrice}</span>
                  <span className="package-discount-pill">{pkg.discount}</span>
                </div>
                <div className="package-duration-row">
                  <Clock size={13} color="#49B9CA" />
                  <span>{pkg.duration} Treatment Session</span>
                </div>
              </div>

              <div className="package-features-list">
                <span className="features-headline">PACKAGE INCLUSIONS:</span>
                {pkg.features.map((feat, fIdx) => (
                  <div key={fIdx} className="feature-item">
                    <Check size={14} className="feature-check" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                className="btn-book-package btn-studio99-teal"
                onClick={() => {
                  if (onOpenBooking) onOpenBooking();
                }}
              >
                <Sparkles size={15} />
                <span>Book This Package</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>




        {/* Bottom Trust Seal Strip */}
        <div className="hospitality-guarantee-strip">
          <div className="hosp-seal-item">
            <ShieldCheck size={18} className="hosp-icon" />
            <span>100% Medical-Grade Autoclave Sanitization</span>
          </div>
          <div className="hosp-seal-item">
            <HeartHandshake size={18} className="hosp-icon" />
            <span>Complimentary 15-Min Scalp Diagnostic</span>
          </div>
          <div className="hosp-seal-item">
            <Crown size={18} className="hosp-icon" />
            <span>Celebrity Master Stylists on Every Floor</span>
          </div>
        </div>
      </div>
    </section>
  );
}

