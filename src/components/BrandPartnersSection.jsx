import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function BrandPartnersSection() {
  const brands = [
    { name: "L'Oréal Professionnel", logo: "https://studio99salons.com/wp-content/uploads/2022/03/lorel.jpg", category: "Hair Color & Care" },
    { name: "GK Hair Professional", logo: "https://studio99salons.com/wp-content/uploads/2022/03/gk-1.jpg", category: "Keratin & Taming" },
    { name: "Olaplex Bond Multiplier", logo: "https://studio99salons.com/wp-content/uploads/2025/01/olaplex.jpg", category: "Bond Repair" },
    { name: "Dermalogica Skin Health", logo: "https://studio99salons.com/wp-content/uploads/2025/01/dermatologies.jpg", category: "Clinical Aesthetics" },
    { name: "Thalgo Marine Beauty", logo: "https://studio99salons.com/wp-content/uploads/2024/01/thalgo-logoUntitled-1.jpg", category: "Spa & Thalasso" },
    { name: "Nails Vogue Paris", logo: "https://studio99salons.com/wp-content/uploads/2025/01/nails-vogue.jpg", category: "Nail Extensions" }
  ];

  return (
    <section className="studio99-brand-partners-section" id="partners">
      {/* Top Curve Shape Divider */}
      <div className="nectar-shape-divider-wrap top-divider">
        <svg className="nectar-shape-divider" fill="#F1ECE6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M 0 0 c 0 0 200 50 500 50 s 500 -50 500 -50 v 101 h -1000 v -100 z"></path>
        </svg>
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2, paddingTop: '40px', paddingBottom: '40px' }}>
        
        {/* Instagram Callout */}
        <div className="insta-callout-header text-center">
          <span className="insta-badge">
            <Sparkles size={14} />
            JOIN OUR COMMUNITY
          </span>
          <h2 className="insta-headline">
            Insta <span className="highlight-italics">Famous</span>
          </h2>
          <p className="insta-sub">
            Follow @looksprofessional on Instagram for daily hair transformations, red-carpet lookbooks, and celebrity masterclasses.
          </p>
          <a 
            href="https://www.instagram.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-insta-view"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>View on Instagram</span>
          </a>
        </div>

        <div className="partners-divider-line"></div>

        {/* Brand Partners Showcase */}
        <div className="text-center" style={{ marginTop: '40px' }}>
          <span className="partners-tag">100% GENUINE LUXURY FORMULATIONS</span>
          <h3 className="partners-title">
            Our Global Brand <span className="highlight-partners">Partners</span>
          </h3>
          <p className="partners-desc">
            We exclusively partner with the world's most prestigious cosmetic and hair science laboratories.
          </p>

          <div className="partners-grid-strip">
            {brands.map((brand, idx) => (
              <div className="partner-logo-card" key={idx}>
                <div className="partner-logo-img-wrapper">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }} 
                  />
                </div>
                <span className="partner-brand-name">{brand.name}</span>
                <span className="partner-brand-cat">{brand.category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
