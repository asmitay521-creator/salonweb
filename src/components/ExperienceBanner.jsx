import React from 'react';

export default function ExperienceBanner({ onOpenBooking }) {
  return (
    <section className="section-container" id="experience" style={{ paddingTop: 0 }}>
      <div className="experience-banner">
        <div>
          <span className="section-tag">The Looks Professional Difference</span>
          <h2 style={{ fontSize: '32px', color: '#fff', margin: '10px 0 16px' }}>
            Indulge in 7-Star Salon Hospitality
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.7 }}>
            Every appointment begins with an in-depth scalp & skin consultation, complimentary artisan roast coffee or herbal infusions, and individual private styling bays equipped with ergonomic memory foam massage chairs.
          </p>
          <button className="btn-gold" onClick={onOpenBooking}>
            Book An Appointment
          </button>
        </div>
        <div className="experience-features">
          <div className="exp-feature-item">
            <h5>☕ Artisan Bar</h5>
            <p>Complimentary freshly brewed cappuccino, green tea & fruit mocktails.</p>
          </div>
          <div className="exp-feature-item">
            <h5>🌿 Olaplex & Kérastase</h5>
            <p>100% authentic international hair care and vegan ammonia-free colors.</p>
          </div>
          <div className="exp-feature-item">
            <h5>🛡️ 100% Sterile Tools</h5>
            <p>Hospital-grade UV autoclave sterilization for every single instrument.</p>
          </div>
          <div className="exp-feature-item">
            <h5>🎵 Ambient Soundscapes</h5>
            <p>Acoustically treated private booths with soothing lo-fi jazz melodies.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
