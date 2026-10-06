import React, { useState } from 'react';
import { 
  Calendar, 
  ArrowRight, 
  ChevronDown,
  Phone,
  Sparkles,
  Briefcase
} from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function Navbar({ onNavigate, onOpenBooking, currentView }) {
  const { setActiveServiceCategory } = useSalon();

  // Clean Services Dropdown State
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const serviceCategories = [
    {
      id: 'hair',
      categoryId: 'hair',
      name: 'Hair Styling & Couture',
      tag: 'Precision Cuts, Balayage & Keratin',
      icon: '✂️'
    },
    {
      id: 'skin',
      categoryId: 'skin',
      name: 'Skin Care & HydraFacial',
      tag: '24K Gold, HydraGlow & Dermal Peels',
      icon: '✨'
    },
    {
      id: 'bridal',
      categoryId: 'packages',
      name: 'Bridal & Red Carpet',
      tag: 'HD Airbrush & Pre-Bridal Packages',
      icon: '👰'
    },
    {
      id: 'nails',
      categoryId: 'nails',
      name: 'Nails Vogue & Spa',
      tag: 'Gel Art, Acrylics & Paraffin Care',
      icon: '💅'
    },
    {
      id: 'beard',
      categoryId: 'beard',
      name: 'Men’s Grooming & Barber',
      tag: 'Hot Towel Shave & Beard Architecture',
      icon: '🧔'
    },
    {
      id: 'treatment',
      categoryId: 'treatment',
      name: 'Hair Spa & Botox Therapy',
      tag: 'Olaplex, Nanoplastia & Scalp Detox',
      icon: '💆'
    }
  ];

  const handleSelectCategory = (cat) => {
    setIsServicesOpen(false);
    if (currentView !== 'customer') {
      onNavigate('customer');
    }
    if (setActiveServiceCategory) {
      setActiveServiceCategory(cat.categoryId);
    }
    setTimeout(() => {
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="site-master-header">
      {/* Main Navbar */}
      <nav className="main-nav studio99-nav" id="main-nav-bar">
        {/* Brand Logo: Looks Professional */}
        <a 
          href="#home" 
          className="brand-badge looks-brand-badge" 
          onClick={(e) => { e.preventDefault(); onNavigate('customer'); }} 
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        >
          <div className="looks-logo-mark" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="logo-text-large" style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 900, color: '#1E293B', letterSpacing: '1px' }}>
              LOOKS
            </span>
            <span className="logo-badge-professional" style={{ background: 'linear-gradient(135deg, #D4A373, #B8860B)', color: '#FFFFFF', padding: '3px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 800, letterSpacing: '0.8px', boxShadow: '0 2px 6px rgba(212, 163, 115, 0.35)' }}>
              PROFESSIONAL
            </span>
          </div>
        </a>

        {/* Nav Links: Exactly 4 Clean Navigation Pages */}
        <ul className="nav-links">
          <li>
            <a 
              href="#home" 
              className="nav-link" 
              onClick={(e) => {
                if (currentView !== 'customer') {
                  e.preventDefault();
                  onNavigate('customer');
                }
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className="nav-link" 
              onClick={() => onNavigate('customer')}
            >
              About Us
            </a>
          </li>

          {/* Services Dropdown Parent */}
          <li 
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <a 
              href="#services" 
              className={`nav-link dropdown-trigger ${isServicesOpen ? 'active' : ''}`} 
              onClick={(e) => {
                if (currentView !== 'customer') {
                  e.preventDefault();
                  onNavigate('customer');
                }
              }}
            >
              <span>Our Services</span>
              <ChevronDown size={14} className={`dropdown-chevron ${isServicesOpen ? 'rotate' : ''}`} />
            </a>

            {/* Sleek Luxury Dropdown Menu */}
            {isServicesOpen && (
              <div className="nav-services-dropdown">
                <div className="services-dropdown-header">
                  <span className="dropdown-header-tag">SIGNATURE MENU</span>
                  <span className="dropdown-header-title">Head-to-Toe Beauty Rituals</span>
                </div>
                <div className="services-dropdown-list">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className="services-dropdown-item"
                      onClick={() => handleSelectCategory(cat)}
                    >
                      <span className="dropdown-item-icon">{cat.icon}</span>
                      <div className="dropdown-item-text">
                        <span className="dropdown-item-name">{cat.name}</span>
                        <span className="dropdown-item-tag">{cat.tag}</span>
                      </div>
                      <ArrowRight size={13} className="dropdown-item-arrow" />
                    </button>
                  ))}
                </div>
                <div className="services-dropdown-footer">
                  <button 
                    className="btn-dropdown-view-all"
                    onClick={() => handleSelectCategory({ categoryId: 'all' })}
                  >
                    <span>✨ View Complete Price Menu</span>
                  </button>
                </div>
              </div>
            )}
          </li>

          <li>
            <a 
              href="#gallery" 
              className="nav-link" 
              onClick={(e) => {
                if (currentView !== 'customer') {
                  e.preventDefault();
                  onNavigate('customer');
                  setTimeout(() => {
                    const el = document.getElementById('gallery');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
            >
              Gallery
            </a>
          </li>
        </ul>

        {/* Nav Right Action: Studio99 Teal Gradient Button */}
        <div className="nav-actions">
          <button className="btn-nav-book btn-studio99-teal" onClick={onOpenBooking}>
            <Calendar size={15} />
            <span>Book Appointment</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>
    </header>
  );
}
