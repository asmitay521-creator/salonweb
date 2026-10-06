import React from 'react';
import { useSalon } from '../context/SalonContext';

export default function ReviewsSection() {
  const { data } = useSalon();

  return (
    <section className="section-container" id="reviews" style={{ paddingTop: '20px', paddingBottom: '15px' }}>
      <div className="section-header">
        <span className="section-tag">Guest Testimonials</span>
        <h2 className="section-title">Loved by Celebrities & Trendsetters</h2>
        <p className="section-desc">Real stories from our esteemed regular clientele across all branches.</p>
      </div>

      <div className="reviews-grid">
        {data.reviews.map(rev => (
          <div className="review-card" key={rev.id}>
            <div className="review-top">
              <img src={rev.avatar} className="review-avatar" alt={rev.name} />
              <div>
                <h5 style={{ color: '#fff', fontSize: '15px' }}>{rev.name}</h5>
                <div style={{ color: 'var(--text-gold)', fontSize: '12px' }}>
                  {'★'.repeat(rev.rating)} • <span style={{ color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>
              </div>
            </div>
            <p className="review-comment">"{rev.comment}"</p>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-gold)' }}>
              Verified Service: <strong>{rev.service}</strong> (Stylist: {rev.stylist})
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
