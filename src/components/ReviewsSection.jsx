import React from 'react';
import { useSalon } from '../context/SalonContext';

const DEFAULT_REVIEWS = [
  {
    id: 'rev_01',
    name: 'Priya Mehta',
    rating: 5,
    date: 'Yesterday',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    comment: 'Best haircut and balayage experience in town! Looks Professional master stylists are true artists.',
    service: 'French Balayage & Olaplex',
    stylist: 'Elena Petrova'
  },
  {
    id: 'rev_02',
    name: 'Vikram Singhania',
    rating: 5,
    date: '3 days ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    comment: 'The executive grooming and beard contouring were top tier. World-class ambience and hospitality.',
    service: 'Royal Razor Shave',
    stylist: 'Sameer Sheikh'
  },
  {
    id: 'rev_03',
    name: 'Anushka Sharma',
    rating: 5,
    date: '1 week ago',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    comment: 'Had the 24K Gold HydraFacial before my event. My skin has never looked so clear, glowing and refreshed.',
    service: '24K Gold HydraFacial',
    stylist: 'Dr. Ananya Roy'
  }
];

export default function ReviewsSection() {
  const { data } = useSalon();
  const reviewsList = (data && data.reviews && data.reviews.length > 0) ? data.reviews : DEFAULT_REVIEWS;

  return (
    <section className="section-container" id="reviews" style={{ paddingTop: '20px', paddingBottom: '15px' }}>
      <div className="section-header">
        <span className="section-tag">Guest Testimonials</span>
        <h2 className="section-title">Loved by Celebrities & Trendsetters</h2>
        <p className="section-desc">Real stories from our esteemed regular clientele across all branches.</p>
      </div>

      <div className="reviews-grid">
        {reviewsList.map(rev => (
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
