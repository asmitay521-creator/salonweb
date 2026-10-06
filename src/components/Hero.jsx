import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  PlayCircle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const HERO_SLIDES = [
  // 1. Bridal & Women's Hair Artistry (Bright, warm luxury salon)
  {
    id: 1,
    mediaUrl: '/assets/images/salon_hero.jpg',
    badge: 'HAUTE COUTURE BRIDAL & RED CARPET MAKEUP',
    titlePrefix: 'Elegance in',
    titleTeal: 'Every Detail.',
    royalTag: 'Your Royal Moment.',
    lead: 'Private soundproof VIP suites, mood-adjusted lighting, and celebrity makeup artists crafting luminous HD airbrush looks tailored to your unique beauty.'
  },
  // 2. French Balayage & Hair Architecture
  {
    id: 2,
    mediaUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=2000&q=85',
    badge: 'FRENCH BALAYAGE & MOLECULAR COLOR',
    titlePrefix: 'Luminous',
    titleTeal: 'Hair Architecture.',
    royalTag: 'Pure Radiant Vibrance.',
    lead: 'Bespoke hand-painted balayage, gloss contouring, and Olaplex molecular bond restoration for hair that moves with silky, golden brilliance.'
  },
  // 3. Royal Gentlemen's Luxury Grooming
  {
    id: 3,
    mediaUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=85',
    badge: "ROYAL GENTLEMEN'S EXECUTIVE GROOMING",
    titlePrefix: 'Distinguished',
    titleTeal: "Men's Luxury.",
    royalTag: 'Precision & Refinement.',
    lead: 'Experience customized fades, hot towel aromatherapy steam shaves, scalp energizing treatments, and luxury beard sculpting by master barbers.'
  },
  // 4. 24K Gold HydraFacial & Derma Glow
  {
    id: 4,
    mediaUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=85',
    badge: '24K GOLD HYDRAFACIAL & DERMA GLOW',
    titlePrefix: 'Flawless',
    titleTeal: 'Glass Skin Glow.',
    royalTag: 'Cellular Skin Renewal.',
    lead: 'Multi-step clinical HydraFacial, 24K nano gold infusion, and collagen renewal rituals revealing immediate, glass-like radiance and hydration.'
  }
];

export default function Hero({ onOpenBooking }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide rotation every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="hero-exact-match-section hero-slider-active-stage" id="home">
      {/* Background Media Slides (Crossfade for Bright Luxury Salon Images) */}
      <div className="hero-slider-media-wrapper">
        {HERO_SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`hero-slide-media-item ${idx === currentSlide ? 'active' : ''}`}
          >
            <div 
              className="hero-slide-bg-img"
              style={{ backgroundImage: `url(${s.mediaUrl})` }}
            />
          </div>
        ))}
      </div>

      {/* Luminous Warm & Vibrant Light Overlay */}
      <div className="hero-exact-overlay hero-vibrant-overlay" />

      {/* Decorative Cyan Arc & Glow */}
      <div className="hero-exact-arc-wrap">
        <svg viewBox="0 0 500 500" className="hero-exact-arc-svg">
          <path 
            d="M 50 480 A 300 300 0 0 1 480 50" 
            fill="none" 
            stroke="rgba(73, 185, 202, 0.45)" 
            strokeWidth="1.5" 
          />
        </svg>
        <span className="hero-exact-arc-star">✦</span>
      </div>

      {/* Hero Main Content Container */}
      <div className="hero-exact-container">
        
        {/* Top Bordered Pill Badge */}
        <div className="hero-exact-badge">
          <Sparkles size={13} className="hero-badge-sparkle-icon" />
          <span>{slide.badge}</span>
        </div>

        {/* Big Editorial Headline */}
        <h1 className="hero-exact-title">
          {slide.titlePrefix} <br />
          <span className="hero-exact-title-teal">{slide.titleTeal}</span>
        </h1>

        {/* Sub-headline Separator with Line */}
        <div className="hero-exact-royal-bar">
          <span className="royal-line-bar" />
          <span className="royal-line-text">{slide.royalTag}</span>
        </div>

        {/* Descriptive Lead Paragraph */}
        <p className="hero-exact-lead-text">
          {slide.lead}
        </p>

        {/* Action Buttons Row */}
        <div className="hero-exact-button-row">
          <button 
            className="btn-hero-exact-book"
            onClick={onOpenBooking}
            type="button"
          >
            <Sparkles size={16} />
            <span>Book Salon Experience</span>
            <ArrowRight size={16} />
          </button>
          
          <a 
            href="#services"
            className="btn-hero-exact-explore"
          >
            <PlayCircle size={18} />
            <span>Explore Services Menu</span>
          </a>
        </div>

      </div>

      {/* Slider Left / Right Arrow Controls */}
      <button 
        className="hero-slider-arrow arrow-left" 
        onClick={handlePrev}
        aria-label="Previous Slide"
        type="button"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        className="hero-slider-arrow arrow-right" 
        onClick={handleNext}
        aria-label="Next Slide"
        type="button"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slider Navigation Dots / Indicator Strip */}
      <div className="hero-slider-nav-strip">
        <div className="hero-slider-dots">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              className={`hero-slider-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              type="button"
            >
              <span className="dot-number">0{idx + 1}</span>
              <span className="dot-bar" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}






