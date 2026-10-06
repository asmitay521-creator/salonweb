import React, { useState, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  Star, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Scissors, 
  CheckCircle2, 
  Crown,
  Calendar,
  Sparkle
} from 'lucide-react';

export default function ServicesMenu({ onBookService }) {
  const { data, activeServiceCategory, setActiveServiceCategory } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState(activeServiceCategory || 'hair');

  useEffect(() => {
    if (activeServiceCategory) {
      setSelectedCategory(activeServiceCategory);
    }
  }, [activeServiceCategory]);

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    if (setActiveServiceCategory) {
      setActiveServiceCategory(catId);
    }
  };

  // Curated Category Showcase & Editorial Spotlight with pristine HD photos
  const categoryHighlights = {
    hair: {
      tag: 'HAIR COUTURE & RUNWAY STYLING',
      title: 'Tailored Haircuts & Restorative Hair Rituals',
      desc: "At LOOKS PROFESSIONAL, we believe a great haircut is more than a trim—it's a transformation. Our master stylists blend precision facial mapping with Olaplex molecular bond repair for immaculate texture and mirror-like vitality.",
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Master Stylist Crafting Precision Haircut',
      quote: 'Your hair, your canvas. Shaped to bespoke perfection.',
      badges: ['Facial Geometry Mapping', 'Olaplex Molecular Bond Repair', 'Scalp Detox & Steam Rinse'],
      categoryIds: ['hair', 'color', 'treatment']
    },
    skin: {
      tag: 'DERMA CLINICAL & HYDRAGLOW',
      title: 'Clinical HydraFacial & 24K Gold Cellular Elixir',
      desc: 'Breathe new life into fatigued skin. Our clinical vortex pore extraction, medical-grade hyaluronic infusion, and pure 24K gold nano-leaf therapy provide instant red-carpet radiance with zero downtime.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Luxury HydraFacial & Skincare Treatment',
      quote: 'Instant glass-skin luminosity and deep cellular revival.',
      badges: ['Painless Vortex Pore Cleansing', '24K Pure Gold Nano-Foil', 'Ultrasonic Lymphatic Lifting'],
      categoryIds: ['skin']
    },
    bridal: {
      tag: 'ROYAL PRE-WEDDING & BRIDAL',
      title: 'Haute Couture Bridal Sanctuary & VIP Suites',
      desc: 'Step into your wedding day with poise and grace. Enjoy our private soundproof VIP suites, master artist makeup, 18-hour waterproof HD airbrush coverage, and comprehensive head-to-toe pre-bridal pampering.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Royal Bridal Suite and Styling',
      quote: 'Bespoke bridal radiance customized for your sacred day.',
      badges: ['Private VIP Sanctuary Suite', '18-Hour Waterproof HD Makeup', 'Master Pre-Wedding Calendar'],
      categoryIds: ['packages']
    },
    nails: {
      tag: 'NAIL ARCHITECTURE & SPA',
      title: 'Couture Nail Artistry & Botanical Paraffin Wellness',
      desc: 'Elevate your hands with sculpted Russian gel extensions, French chrome ombre finishes, and warm organic lavender paraffin foot reflexology that melts away daily fatigue.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Couture Nail Art & Extensions',
      quote: 'Wearable high-fashion art crafted on your fingertips.',
      badges: ['4-Week Chip-Free Guarantee', 'Hand-Painted Custom Art', 'Warm Lavender Paraffin Bath'],
      categoryIds: ['nails']
    },
    beard: {
      tag: "GENTLEMAN'S ROYAL LOUNGE",
      title: 'Royal Razor Hot Towel Shave & Beard Architecture',
      desc: 'Experience timeless gentleman indulgence. Steaming eucalyptus towels open pores, followed by precision straight-razor lines, surgical low-taper fades, and cold-pressed organic sandalwood conditioning.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Royal Razor Shave and Beard Sculpting',
      quote: 'Impeccable facial geometry for an effortless executive look.',
      badges: ['Eucalyptus Steam Towels', 'Feather-Edge Straight Razor', 'Moroccan Argan Beard Butter'],
      categoryIds: ['beard']
    },
    spa: {
      tag: 'MOLECULAR REPAIR & KERATIN',
      title: 'Olaplex Disulfide Bond Rebuilder & Keratin Smoothing',
      desc: 'Permanently reconnect broken disulfide bonds and eliminate 100% of humidity-induced frizz with botanical formaldehyde-free smoothing that provides mirror shine for up to 5 months.',
      image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=80',
      imageAlt: 'Molecular Hair Spa and Keratin Smoothing',
      quote: 'Zero-frizz silkiness that withstands tropical humidity.',
      badges: ['100% Formaldehyde-Free', 'Patented Disulfide Relinking', '5-Month Mirror Gloss Shield'],
      categoryIds: ['treatment']
    }
  };

  const navCategories = [
    { id: 'hair', name: 'Hair Architecture', icon: '✂️' },
    { id: 'skin', name: 'Skin & HydraGlow', icon: '✨' },
    { id: 'bridal', name: 'Royal Bridal Suites', icon: '👰' },
    { id: 'nails', name: 'Nails Vogue', icon: '💅' },
    { id: 'beard', name: "Men's Grooming", icon: '🧔' },
    { id: 'spa', name: 'Spa & Keratin', icon: '💆' }
  ];

  // Map category tab to current highlight
  const currentHighlight = categoryHighlights[selectedCategory] || categoryHighlights.hair;

  return (
    <section className="section-container services-luxury-atelier" id="services">
      
      {/* 1. ELEGANT CLEAN HEADER */}
      <div className="services-atelier-header">
        <div className="atelier-tag-row">
          <span className="atelier-tag">HAUTE COUTURE MENU</span>
        </div>
        <h2 className="atelier-title">Signature Unisex Rituals &amp; Services</h2>
        <p className="atelier-subtitle">
          Crafted by international master stylists using pure botanical formulations &amp; molecular elixirs.
        </p>
      </div>

      {/* 2. SLEEK SINGLE-LINE CATEGORY TAB BAR */}
      <div className="services-tab-bar-wrap">
        <div className="services-tab-bar">
          {navCategories.map((cat) => (
            <button
              key={cat.id}
              className={`services-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. HERO SPOTLIGHT CARD WITH ANIMATED GLOWING BORDER & LIGHT SHEEN */}
      <div className="services-spotlight-card">
        <div className="spotlight-media-col">
          {/* Outer glowing border wrapper */}
          <div className="spotlight-border-glow-wrapper">
            <div className="spotlight-image-frame">
              <img 
                src={currentHighlight.image} 
                alt={currentHighlight.imageAlt} 
                className="spotlight-img"
              />
              {/* Animated Light Sweep overlay */}
              <div className="spotlight-shine-sweep"></div>

              {/* Category Tag Badge */}
              <div className="spotlight-img-badge">
                <Sparkle size={13} className="sparkle-rotator" />
                <span>{currentHighlight.tag}</span>
              </div>

              {/* Decorative Luxury Gold Corner Accents */}
              <div className="spotlight-corner-accent corner-tl"></div>
              <div className="spotlight-corner-accent corner-br"></div>
            </div>
          </div>
        </div>

        <div className="spotlight-content-col">
          <span className="spotlight-subtag">— BESPOKE MASTER CRAFT</span>
          <h3 className="spotlight-headline">{currentHighlight.title}</h3>
          <p className="spotlight-description">{currentHighlight.desc}</p>
          
          <div className="spotlight-quote-pill">
            <span className="quote-text">"{currentHighlight.quote}"</span>
          </div>

          <div className="spotlight-badges-row">
            {currentHighlight.badges.map((badge, idx) => (
              <div className="spotlight-badge-item" key={idx}>
                <CheckCircle2 size={15} className="badge-check-icon" />
                <span>{badge}</span>
              </div>
            ))}
          </div>

          <div className="spotlight-actions">
            <button 
              className="btn-spotlight-book"
              onClick={() => {
                const srv = data.services.find(s => s.categoryId === selectedCategory || s.category === selectedCategory) || data.services[0];
                onBookService(srv);
              }}
            >
              <Calendar size={15} />
              <span>Book Appointment</span>
              <ArrowRight size={14} />
            </button>
            <a 
              href="https://wa.me/919876543210?text=Hi%20Looks%20Professional%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spotlight-whatsapp"
            >
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

