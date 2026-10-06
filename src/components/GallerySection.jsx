import React, { useState } from 'react';
import { Sparkles, Eye, X, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Parisian Caramel Balayage & Silk Waves",
    category: "hair",
    categoryLabel: "Hair Artistry",
    tag: "BALAYAGE & GLOSS",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    desc: "Seamless hand-painted honey-caramel dimensions, face-framing fringe, and high-shine Olaplex bond seal.",
    duration: "180 Mins",
    stylist: "Elena Petrova (Color Master)"
  },
  {
    id: 2,
    title: "Royal Indian Bridal HD Airbrush Makeover",
    category: "bridal",
    categoryLabel: "Bridal Couture",
    tag: "HAUTE BRIDAL",
    image: "/assets/images/luxury_bridal_makeover.jpg",
    desc: "Dewy glass skin, emerald-matched eye contours, handcrafted floral hair updo, and 16-hour sweatproof finish.",
    duration: "240 Mins",
    stylist: "Pooja Sharma (Bridal Director)"
  },
  {
    id: 3,
    title: "Executive Master Fade & Sculpted Beard",
    category: "barber",
    categoryLabel: "Men's Grooming",
    tag: "BARBER ARCHITECTURE",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
    desc: "Razor-sharp skin taper fade, warm sandalwood towel steam, and precision artisanal beard contouring.",
    duration: "45 Mins",
    stylist: "Sameer Sheikh (Master Barber)"
  },
  {
    id: 4,
    title: "24K Gold Cellular HydraGlow Therapy",
    category: "skin",
    categoryLabel: "Skin & Spa",
    tag: "CLINICAL FACIAL",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    desc: "Ultrasonic extraction, pure 24K gold foil infusion, and cryo-firming lymphatic drainage for instant radiance.",
    duration: "75 Mins",
    stylist: "Dr. Ananya Roy (Aesthetician)"
  },
  {
    id: 5,
    title: "Sun-Kissed Platinum Melt & Glass Hair",
    category: "hair",
    categoryLabel: "Hair Artistry",
    tag: "PLATINUM MELT",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    desc: "Multi-tonal icy blonde baby lights with deep root melt and mirror-reflective keratin laminating gloss.",
    duration: "210 Mins",
    stylist: "Karan Singhania (Creative Director)"
  },
  {
    id: 6,
    title: "Haute Designer Gel Art & French Manicure",
    category: "nails",
    categoryLabel: "Nails Vogue",
    tag: "NAILS COUTURE",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
    desc: "Sculpted Russian gel extensions with chrome French tips and Swarovski crystal accents.",
    duration: "60 Mins",
    stylist: "Tanya Kapoor (Nail Artist)"
  },
  {
    id: 7,
    title: "Japanese Scalp Hydro-Spa & Aromatherapy",
    category: "skin",
    categoryLabel: "Skin & Spa",
    tag: "HEAD SPA",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    desc: "Deep follicular scalp detox, waterfall hydro-mist relaxation, and tension-melting shoulder acupressure.",
    duration: "60 Mins",
    stylist: "Meera Nair (Spa Therapist)"
  },
  {
    id: 8,
    title: "Private Boutique VIP Styling Suites",
    category: "ambiance",
    categoryLabel: "Salon Ambiance",
    tag: "7-STAR LOUNGE",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80",
    desc: "Soundproof VIP private styling pods with mood lighting, ergonomic memory-foam chairs, and barista service.",
    duration: "Complimentary",
    stylist: "VIP Concierge Desk"
  }
];

export default function GallerySection({ onOpenBooking }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { key: 'all', label: 'All Transformations', icon: '✨' },
    { key: 'hair', label: 'Hair Artistry', icon: '✂️' },
    { key: 'bridal', label: 'Bridal Couture', icon: '👰' },
    { key: 'barber', label: "Men's Grooming", icon: '🧔' },
    { key: 'skin', label: 'Skin & Spa', icon: '💆' },
    { key: 'nails', label: 'Nails Vogue', icon: '💅' },
    { key: 'ambiance', label: 'Lounge Ambiance', icon: '🏛️' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section className="gallery-luxury-section studio99-gallery" id="gallery">
      <div className="gallery-container">
        
        {/* Section Header */}
        <div className="gallery-header-box text-center">
          <div className="gallery-top-badge">
            <Sparkles size={14} className="gallery-badge-icon" />
            <span>REAL CLIENT TRANSFORMATIONS &amp; LOOKBOOK</span>
          </div>
          
          <h2 className="gallery-main-title">
            The Looks Professional <span className="headline-teal">Lookbook</span>
          </h2>
          
          <p className="gallery-sub-text">
            Explore our curated portfolio of bespoke hair transformations, runway-caliber colorcraft, luminous bridal artistry, and 7-star lounge ambiance.
          </p>
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div className="gallery-filter-tabs">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`gallery-filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span className="filter-btn-icon">{cat.icon}</span>
              <span className="filter-btn-label">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid: Clean, Minimalist & Image-Centric */}
        <div className="gallery-grid">
          {filteredItems.map((item, idx) => (
            <div 
              key={item.id} 
              className="gallery-card-modern animated-card"
              style={{ animationDelay: `${idx * 0.08}s` }}
              onClick={() => setSelectedImage(item)}
            >
              <div className="gallery-img-wrapper">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="gallery-img-src"
                  loading="lazy"
                />
                
                {/* Clean Floating Badge */}
                <div className="gallery-floating-tag">
                  <span>{item.tag}</span>
                </div>

                {/* Light Sweep Effect */}
                <div className="gallery-shine-sweep"></div>

                {/* Minimal Bottom Overlay Bar */}
                <div className="gallery-card-bottom-overlay">
                  <span className="gallery-cat-pill">{item.categoryLabel}</span>
                  <h3 className="gallery-item-headline">{item.title}</h3>
                  <div className="gallery-hover-prompt">
                    <Eye size={14} />
                    <span>View Look Details →</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Interactive Lightbox Modal */}
      {selectedImage && (
        <div className="gallery-lightbox-backdrop" onClick={() => setSelectedImage(null)}>
          <div className="gallery-lightbox-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="gallery-lightbox-close-btn" 
              onClick={() => setSelectedImage(null)}
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>
            
            <div className="lightbox-modal-grid">
              {/* Left: Large High-Res Image View */}
              <div className="lightbox-image-column">
                <img src={selectedImage.image} alt={selectedImage.title} className="lightbox-full-img" />
              </div>

              {/* Right: Rich Style Details & Booking Action */}
              <div className="lightbox-details-column">
                <div className="lightbox-meta-tag">
                  <Sparkles size={13} />
                  <span>{selectedImage.tag} • {selectedImage.categoryLabel}</span>
                </div>

                <h3 className="lightbox-title">{selectedImage.title}</h3>
                
                <p className="lightbox-desc">{selectedImage.desc}</p>

                <div className="lightbox-details-box">
                  <div className="detail-stat">
                    <span className="stat-name">Duration:</span>
                    <strong className="stat-value">{selectedImage.duration}</strong>
                  </div>
                  <div className="detail-stat">
                    <span className="stat-name">Curated By:</span>
                    <strong className="stat-value">{selectedImage.stylist}</strong>
                  </div>
                  <div className="detail-stat">
                    <span className="stat-name">Formulation:</span>
                    <strong className="stat-value">100% Genuine L'Oréal &amp; Olaplex</strong>
                  </div>
                </div>

                <div className="lightbox-guarantee">
                  <CheckCircle2 size={16} className="guarantee-icon" />
                  <span>Includes 15-min bespoke consultation &amp; scalp analysis.</span>
                </div>

                <button 
                  className="btn-lightbox-book btn-studio99-teal"
                  onClick={() => {
                    setSelectedImage(null);
                    if (onOpenBooking) onOpenBooking();
                  }}
                >
                  <Calendar size={16} />
                  <span>Book Appointment For This Look</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
