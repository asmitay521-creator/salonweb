import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  Star, 
  Award, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap,
  Users,
  ChevronRight,
  X
} from 'lucide-react';

export default function StylistsSection({ onBookStylist }) {
  const { data } = useSalon();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedStylistForModal, setSelectedStylistForModal] = useState(null);

  const categories = [
    { id: 'all', label: 'All Master Artisans' },
    { id: 'Hair Specialist', label: 'Hair & Couture' },
    { id: 'Color Specialist', label: 'Color & Balayage' },
    { id: 'Skin Expert', label: 'Skin & Aesthetics' },
    { id: 'Beard Specialist', label: 'Barber & Beard' }
  ];

  const filteredStaff = activeCategory === 'all'
    ? data.staff
    : data.staff.filter(st => st.category === activeCategory);

  return (
    <section className="section-container stylists-luxury-section" id="stylists">
      {/* Editorial Luxury Header */}
      <div className="stylists-section-header">
        <div className="stylists-badge-wrap">
          <span className="stylists-badge">
            <Sparkles size={13} className="badge-sparkle-icon" />
            WORLD-CLASS HAUTE COUTURE ARTISANS
            <Sparkles size={13} className="badge-sparkle-icon" />
          </span>
        </div>
        
        <h2 className="stylists-headline">
          Meet Our <span className="gold-text-gradient">Master Stylists</span> & Artists
        </h2>
        
        <p className="stylists-subheadline">
          Internationally certified by <strong>Vidal Sassoon London</strong>, <strong>Toni&Guy</strong>, and <strong>L'Oréal Professional Academy Paris</strong>. Delivering bespoke luxury transformations tailored uniquely to you.
        </p>

        {/* Category Filter Pills */}
        <div className="stylists-filter-bar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`stylist-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <span className="filter-count">
                  {cat.id === 'all' ? data.staff.length : data.staff.filter(s => s.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Stylists Grid */}
      <div className="stylists-luxury-grid">
        {filteredStaff.map(st => {
          const isAvailable = st.status === "Available";
          const firstName = st.name.split(' ')[0];

          return (
            <div className="luxury-stylist-card" key={st.id}>
              {/* Top Arched Image Frame */}
              <div className="stylist-image-showcase">
                <img 
                  src={st.photo} 
                  alt={st.name} 
                  className="stylist-portrait-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="stylist-img-overlay-gradient"></div>

                {/* Floating Availability Badge */}
                <div className="stylist-floating-status">
                  <span className={`status-pill ${isAvailable ? 'available' : 'busy'}`}>
                    <span className="status-live-dot"></span>
                    {isAvailable ? 'Available Today' : 'In Service'}
                  </span>
                </div>

                {/* Floating Experience Badge */}
                <div className="stylist-floating-exp">
                  <Award size={12} color="#F8E9E5" />
                  <span>{st.experience || '8+ Yrs'} Mastery</span>
                </div>

                {/* Floating Bottom Card Overlays */}
                <div className="stylist-portrait-bottom-info">
                  <div className="stylist-rating-chip">
                    <Star size={13} className="star-filled-icon" />
                    <strong>{st.rating}</strong>
                    <span className="rating-count">({st.reviewsCount || 280}+)</span>
                  </div>

                  {st.accreditation && (
                    <div className="stylist-accreditation-chip" title={st.accreditation}>
                      <GraduationCap size={12} />
                      <span>{st.accreditation.split(' ')[0]} {st.accreditation.split(' ')[1] || ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Main Info */}
              <div className="stylist-card-body">
                <div className="stylist-identity">
                  <h3 className="stylist-name">{st.name}</h3>
                  <div className="stylist-designation-row">
                    <span className="stylist-role-title">{st.role}</span>
                  </div>
                  {st.tagline && (
                    <p className="stylist-tagline">"{st.tagline}"</p>
                  )}
                </div>

                {/* Academy & Accreditation Badge */}
                {st.accreditation && (
                  <div className="stylist-academy-row">
                    <ShieldCheck size={14} className="academy-icon" />
                    <span>{st.accreditation}</span>
                  </div>
                )}

                {/* Bio Snippet */}
                {st.bio && (
                  <p className="stylist-bio-text">
                    {st.bio}
                  </p>
                )}

                {/* Signature Skills */}
                <div className="stylist-skills-wrapper">
                  <span className="skills-heading">Signature Techniques:</span>
                  <div className="stylist-skill-tags">
                    {st.skills.map((sk, idx) => (
                      <span className="luxury-skill-pill" key={idx}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="stylist-card-actions">
                  <button 
                    className="btn-book-stylist"
                    onClick={() => onBookStylist && onBookStylist(st)}
                  >
                    <Calendar size={15} />
                    <span>Book with {firstName}</span>
                    <ArrowRight size={14} className="btn-arrow-icon" />
                  </button>
                  <button 
                    className="btn-view-portfolio"
                    onClick={() => setSelectedStylistForModal(st)}
                    title="View Artist Dossier & Portfolio"
                  >
                    Profile
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stylist Profile Dossier Modal */}
      {selectedStylistForModal && (
        <div className="stylist-modal-backdrop" onClick={() => setSelectedStylistForModal(null)}>
          <div className="stylist-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button 
              className="stylist-modal-close" 
              onClick={() => setSelectedStylistForModal(null)}
            >
              <X size={20} />
            </button>

            <div className="stylist-modal-grid">
              <div className="stylist-modal-media">
                <img 
                  src={selectedStylistForModal.photo} 
                  alt={selectedStylistForModal.name} 
                  className="stylist-modal-img"
                />
                <div className="stylist-modal-badge-float">
                  <ShieldCheck size={16} />
                  <span>Master Certified Artisan</span>
                </div>
              </div>

              <div className="stylist-modal-details">
                <span className="modal-category-tag">{selectedStylistForModal.category}</span>
                <h3 className="modal-stylist-name">{selectedStylistForModal.name}</h3>
                <p className="modal-stylist-role">{selectedStylistForModal.role}</p>

                <div className="modal-kpi-row">
                  <div className="modal-kpi-item">
                    <Star size={16} className="star-filled-icon" />
                    <strong>{selectedStylistForModal.rating} / 5.0</strong>
                    <span>({selectedStylistForModal.reviewsCount} Client Reviews)</span>
                  </div>
                  <div className="modal-kpi-item">
                    <Award size={16} color="var(--color-primary-rose)" />
                    <strong>{selectedStylistForModal.experience}</strong>
                    <span>Master Experience</span>
                  </div>
                  <div className="modal-kpi-item">
                    <GraduationCap size={16} color="var(--color-primary-rose)" />
                    <strong>Certified</strong>
                    <span>{selectedStylistForModal.accreditation || 'Academy Alum'}</span>
                  </div>
                </div>

                <div className="modal-section-block">
                  <h4>Biography & Artistry</h4>
                  <p>{selectedStylistForModal.bio || "Renowned for exacting precision and personalized consultations that accentuate natural elegance."}</p>
                </div>

                <div className="modal-section-block">
                  <h4>Mastered Specializations</h4>
                  <div className="stylist-skill-tags">
                    {selectedStylistForModal.skills.map((sk, idx) => (
                      <span className="luxury-skill-pill highlight" key={idx}>
                        <CheckCircle2 size={12} style={{ marginRight: '5px', color: 'var(--color-primary-rose)' }} />
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="modal-footer-cta">
                  <button 
                    className="btn-modal-book"
                    onClick={() => {
                      const st = selectedStylistForModal;
                      setSelectedStylistForModal(null);
                      if (onBookStylist) onBookStylist(st);
                    }}
                  >
                    <Calendar size={16} />
                    <span>Reserve Appointment with {selectedStylistForModal.name.split(' ')[0]}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
