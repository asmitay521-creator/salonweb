import React from 'react';
import { Scissors, Sparkles, Heart, Hand } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function StudioCardsShowcase({ onSelectCategory }) {
  const { setActiveServiceCategory } = useSalon();

  const handleCardClick = (catId) => {
    if (setActiveServiceCategory) {
      setActiveServiceCategory(catId);
    }
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cards = [
    {
      id: 'hair',
      title: 'Hair',
      tagline: 'Couture Cuts & Balayage',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      icon: <Scissors size={28} />
    },
    {
      id: 'skin',
      title: 'Skin',
      tagline: 'HydraFacial & 24K Gold',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      icon: <Sparkles size={28} />
    },
    {
      id: 'packages',
      title: 'Bridal',
      tagline: 'HD Airbrush & Red Carpet',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      icon: <Heart size={28} />
    },
    {
      id: 'nails',
      title: 'Nails',
      tagline: 'Nails Vogue & Gel Art',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
      icon: <Hand size={28} />
    }
  ];

  return (
    <section className="studio99-cards-showcase-section" id="categories-showcase">
      {/* Background with soft pattern */}
      <div className="section-container">
        <div className="section-header text-center">
          <h2 className="studio99-section-headline">
            Looks Professional Salons – <span className="headline-teal">Where Beauty Meets Perfection!</span>
          </h2>
          <p className="section-desc" style={{ maxWidth: '680px', margin: '0 auto' }}>
            Experience scientifically designed hair, skincare, and bridal rituals crafted by internationally certified beauty artisans.
          </p>
        </div>

        {/* 4 Fancy Parallax Hover Cards like Studio99 */}
        <div className="studio99-fancy-boxes-grid">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="nectar-fancy-box-custom"
              onClick={() => handleCardClick(card.id)}
            >
              <div className="fancy-box-bg-img" style={{ backgroundImage: `url(${card.image})` }}></div>
              <div className="fancy-box-overlay"></div>
              <div className="fancy-box-content">
                <div className="fancy-box-icon-disc">
                  {card.icon}
                </div>
                <h3 className="fancy-box-title">{card.title}</h3>
                <span className="fancy-box-tagline">{card.tagline}</span>
                <span className="fancy-box-explore-link">Explore Menu →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Studio99 SVG Curve Wave Divider at Bottom */}
      <div className="nectar-shape-divider-wrap">
        <svg className="nectar-shape-divider" fill="#ABD5D9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M 0 14 s 88.64 3.48 300 36 c 260 40 514 27 703 -10 l 12 28 l 3 36 h -1018 z" opacity="0.3"></path>
          <path d="M 0 45 s 271 45.13 500 32 c 157 -9 330 -47 515 -63 v 86 h -1015 z" opacity="0.6"></path>
          <path d="M 0 58 s 188.29 32 508 32 c 290 0 494 -35 494 -35 v 45 h -1002 z"></path>
        </svg>
      </div>
    </section>
  );
}
