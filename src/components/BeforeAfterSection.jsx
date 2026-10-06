import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ArrowRightCircle } from 'lucide-react';

const TRANSFORMATIONS = [
  {
    id: 'balayage',
    tabName: 'French Balayage & Gloss',
    badge: 'SIGNATURE HAIR COLORCRAFT',
    title: 'From Dull & Frizzy to Mirror-Shine Caramel Balayage',
    desc: 'Hand-painted Parisian balayage technique with custom honey-caramel toner and Olaplex molecular bond rebuild. Completely eliminates brassiness and restores silky elasticity.',
    beforeImg: '/assets/images/balayage_before.jpg',
    beforeLabel: 'BEFORE • DULL & FRIZZY',
    afterImg: '/assets/images/balayage_after.jpg',
    afterLabel: 'AFTER • MIRROR-SHINE BALAYAGE',
    stylist: 'Elena Petrova (Color Master)',
    duration: '180 Mins',
    products: "L'Oréal Professionnel French Balayage + Olaplex Bond Seal",
    result: '10x Vibrancy & Zero Damage',
    serviceKey: 'srv_01'
  },
  {
    id: 'bridal',
    tabName: 'Royal Bridal Airbrush',
    badge: 'HAUTE COUTURE BRIDAL',
    title: 'Pre-Bridal Natural Skin to Luminous Royal Glow',
    desc: 'Custom HD Airbrush formulation matched to 18K bridal jewelry, precision eye contouring, and 16-hour humidity-resistant finish for the ultimate wedding day radiance.',
    beforeImg: '/assets/images/bridal_before.jpg',
    beforeLabel: 'BEFORE • NATURAL STATE',
    afterImg: '/assets/images/luxury_bridal_makeover.jpg',
    afterLabel: 'AFTER • ROYAL BRIDAL GLOW',
    stylist: 'Pooja Sharma (Bridal Director)',
    duration: '240 Mins',
    products: 'Dermalogica Prep + Temptu Pro HD Airbrush + 24K Gold Serum',
    result: '16-Hour Sweatproof Glass Skin',
    serviceKey: 'srv_09'
  },
  {
    id: 'hydra',
    tabName: '24K Gold HydraFacial',
    badge: 'CLINICAL DERMA AESTHETICS',
    title: 'Congested Pores to Deep Cellular Rejuvenation',
    desc: 'Ultrasonic deep pore extraction combined with pure 24-karat gold leaf infusion and cryo-lymphatic massage for instant red-carpet glass skin.',
    beforeImg: '/assets/images/hydrafacial_before.jpg',
    beforeLabel: 'BEFORE • TIRED SKIN',
    afterImg: '/assets/images/hydrafacial_after.jpg',
    afterLabel: 'AFTER • 24K GLASS SKIN',
    stylist: 'Dr. Ananya Roy (Aesthetician)',
    duration: '75 Mins',
    products: 'US-FDA HydraGlow System + Thalgo Marine Collagen',
    result: '100% Pore Clarification & Radiance',
    serviceKey: 'srv_05'
  }
];

export default function BeforeAfterSection({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('balayage');
  const current = TRANSFORMATIONS.find(t => t.id === activeTab) || TRANSFORMATIONS[0];

  return (
    <section className="transformation-studio-section" id="transformations">
      <div className="section-container">
        
        {/* Section Header */}
        <div className="transformation-header text-center">
          <div className="trans-badge">
            <Sparkles size={14} className="trans-badge-icon" />
            <span>REAL VISIBLE TRANSFORMATIONS</span>
          </div>
          
          <h2 className="trans-main-headline">
            Before &amp; After <span className="headline-teal">Master Artistry</span>
          </h2>
          
          <p className="trans-sub-text">
            Witness the visible difference in hair vibrancy, skin luminosity, and bridal luxury crafted by Looks Professional artists.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="trans-tabs-row">
          {TRANSFORMATIONS.map((t) => (
            <button
              key={t.id}
              className={`trans-tab-btn ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.tabName}</span>
            </button>
          ))}
        </div>

        {/* Main 2-Column Transformation Stage */}
        <div className="trans-stage-grid">
          
          {/* Left Column: Side-by-Side Dual Before & After Showcase */}
          <div className="dual-before-after-wrapper">
            
            {/* Before Photo Card */}
            <div className="compare-card compare-card-before">
              <div className="compare-img-box">
                <img 
                  src={current.beforeImg} 
                  alt={current.beforeLabel} 
                  className="compare-photo" 
                />
                <div className="photo-badge-pill badge-before">
                  <span>{current.beforeLabel}</span>
                </div>
              </div>
            </div>

            {/* Visual Transformation Indicator */}
            <div className="transformation-connector">
              <div className="connector-circle">
                <Sparkles size={16} />
              </div>
            </div>

            {/* After Photo Card */}
            <div className="compare-card compare-card-after">
              <div className="compare-img-box">
                <img 
                  src={current.afterImg} 
                  alt={current.afterLabel} 
                  className="compare-photo" 
                />
                <div className="photo-badge-pill badge-after">
                  <Sparkles size={12} />
                  <span>{current.afterLabel}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Transformation Dossier & Instant Reservation */}
          <div className="trans-dossier-card">
            <div className="dossier-tag">
              <Sparkles size={13} />
              <span>{current.badge}</span>
            </div>

            <h3 className="dossier-title">{current.title}</h3>
            
            <p className="dossier-desc">{current.desc}</p>

            <div className="dossier-specs-list">
              <div className="spec-item">
                <span className="spec-label">Master Stylist:</span>
                <strong className="spec-val">{current.stylist}</strong>
              </div>
              <div className="spec-item">
                <span className="spec-label">Treatment Time:</span>
                <strong className="spec-val">{current.duration}</strong>
              </div>
              <div className="spec-item">
                <span className="spec-label">Formulations:</span>
                <strong className="spec-val">{current.products}</strong>
              </div>
              <div className="spec-item">
                <span className="spec-label">Guaranteed Result:</span>
                <strong className="spec-val highlight-teal">{current.result}</strong>
              </div>
            </div>

            <div className="dossier-seal-row">
              <CheckCircle2 size={16} color="#49B9CA" />
              <span>Complimentary 15-min digital scalp &amp; hair texture diagnostic included.</span>
            </div>

            <button 
              className="btn-reserve-transformation btn-studio99-teal"
              onClick={onOpenBooking}
            >
              <Sparkles size={16} />
              <span>Book This Exact Transformation</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

