import React, { useState, useEffect } from 'react';
import { useSalon } from './context/SalonContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudioCardsShowcase from './components/StudioCardsShowcase';
import AboutSection from './components/AboutSection';
import ServicesMenu from './components/ServicesMenu';
import GallerySection from './components/GallerySection';
import StylistsSection from './components/StylistsSection';
import BeforeAfterSection from './components/BeforeAfterSection';
import BrandPartnersSection from './components/BrandPartnersSection';
import ReviewsSection from './components/ReviewsSection';
import ContactSection from './components/ContactSection';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import BookingWizardModal from './components/BookingWizardModal';
import InvoiceModal from './components/InvoiceModal';
import CustomerPortal from './components/CustomerPortal';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/Admin/AdminPanel';
import SuperAdminPanel from './components/SuperAdmin/SuperAdminPanel';
import { Bell } from 'lucide-react';


export default function App() {
  const { data, toasts } = useSalon();

  // Navigation route: 'customer' | 'customer-dash' | 'contact' | 'admin-login' | 'admin' | 'superadmin'
  const [currentView, setCurrentView] = useState('customer');

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);
  const [preselectedStylist, setPreselectedStylist] = useState(null);
  const [selectedInvoiceApt, setSelectedInvoiceApt] = useState(null);

  // Sync with URL Route (/admin, /admim, #/admin, /contact, /superadmin, /customer-dash)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      const auth = data.currentUser;

      const isContactPath =
        path.endsWith('/contact') ||
        path.endsWith('/contact/') ||
        hash === '#/contact' ||
        hash === '#contact';

      const isAdminPath =
        path.endsWith('/admin') ||
        path.endsWith('/admin/') ||
        path.endsWith('/admim') ||
        path.endsWith('/admim/') ||
        hash === '#/admin' ||
        hash === '#admin' ||
        hash === '#/admim' ||
        hash === '#admim';

      const isSuperAdminPath =
        path.endsWith('/superadmin') ||
        path.endsWith('/superadmin/') ||
        hash === '#/superadmin' ||
        hash === '#superadmin';

      if (isContactPath) {
        setCurrentView('contact');
      } else if (isSuperAdminPath) {
        if (auth && auth.role === 'superadmin') {
          setCurrentView('superadmin');
        } else {
          setCurrentView('admin-login');
        }
      } else if (isAdminPath) {
        if (auth && auth.role === 'superadmin') {
          setCurrentView('superadmin');
        } else if (auth && auth.role === 'admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('admin-login');
        }
      } else if (hash === '#/customer-dash' || path.endsWith('/customer-dash')) {
        setCurrentView('customer-dash');
      } else {
        setCurrentView('customer');
      }
    };

    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    handleUrlRoute();

    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, [data.currentUser]);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'customer') window.location.hash = '#/';
    else if (view === 'customer-dash') window.location.hash = '#/customer-dash';
    else if (view === 'contact') window.location.hash = '#/contact';
    else if (view === 'admin-login') window.location.hash = '#/admin';
    else if (view === 'admin') window.location.hash = '#/admin';
    else if (view === 'superadmin') window.location.hash = '#/superadmin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookService = (srv) => {
    setPreselectedService(srv);
    setIsBookingOpen(true);
  };

  return (
    <div>
      {/* Ambient Luxury Glow Lights */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* Main Navbar (shown on customer pages, portal & contact) */}
      {(currentView === 'customer' || currentView === 'customer-dash' || currentView === 'contact') && (
        <Navbar
          currentView={currentView}
          onNavigate={navigateTo}
          onOpenBooking={() => {
            setPreselectedService(null);
            setIsBookingOpen(true);
          }}
        />
      )}

      {/* 1. Customer Public Landing */}
      {currentView === 'customer' && (
        <main className="view-section active-view">
          <Hero
            onOpenBooking={() => {
              setPreselectedService(null);
              setIsBookingOpen(true);
            }}
          />
          <StudioCardsShowcase />
          <AboutSection
            onOpenBooking={() => {
              setPreselectedService(null);
              setIsBookingOpen(true);
            }}
            onNavigate={navigateTo}
          />
          <ServicesMenu onBookService={handleBookService} />
          <GallerySection
            onOpenBooking={() => {
              setPreselectedService(null);
              setIsBookingOpen(true);
            }}
          />
          <StylistsSection
            onBookStylist={(st) => {
              setPreselectedStylist(st);
              setPreselectedService(null);
              setIsBookingOpen(true);
            }}
          />
          <BeforeAfterSection
            onOpenBooking={() => {
              setPreselectedService(null);
              setIsBookingOpen(true);
            }}
          />
          <BrandPartnersSection />
          <ReviewsSection />
          <ContactSection 
            onNavigate={navigateTo} 
            onOpenBooking={() => {
              setPreselectedService(null);
              setPreselectedStylist(null);
              setIsBookingOpen(true);
            }}
          />
          <Footer 
            onNavigate={navigateTo} 
            onOpenBooking={() => {
              setPreselectedService(null);
              setPreselectedStylist(null);
              setIsBookingOpen(true);
            }}
          />
        </main>
      )}

      {/* 2. Dedicated Full Contact Page */}
      {currentView === 'contact' && (
        <main className="view-section active-view">
          <ContactPage
            onOpenBooking={() => {
              setPreselectedService(null);
              setPreselectedStylist(null);
              setIsBookingOpen(true);
            }}
            onNavigate={navigateTo}
          />
          <Footer 
            onNavigate={navigateTo} 
            onOpenBooking={() => {
              setPreselectedService(null);
              setPreselectedStylist(null);
              setIsBookingOpen(true);
            }}
          />
        </main>
      )}

      {/* 2. Customer Dashboard / Portal */}
      {currentView === 'customer-dash' && (
        <CustomerPortal
          onOpenBooking={() => {
            setPreselectedService(null);
            setPreselectedStylist(null);
            setIsBookingOpen(true);
          }}
          onViewInvoice={(apt) => setSelectedInvoiceApt(apt)}
          onReturnHome={() => navigateTo('customer')}
        />
      )}

      {/* 3. Unified Admin & Super Admin Login (/admin) */}
      {currentView === 'admin-login' && (
        <AdminLogin
          onLoginSuccess={(role) => navigateTo(role)}
          onReturnHome={() => navigateTo('customer')}
        />
      )}

      {/* 4. Branch Admin Operations Panel */}
      {currentView === 'admin' && (
        <AdminPanel
          onReturnHome={() => navigateTo('customer')}
          onGoSuperAdmin={() => navigateTo('superadmin')}
          onViewInvoice={(apt) => setSelectedInvoiceApt(apt)}
        />
      )}

      {/* 5. Super Admin HQ Panel */}
      {currentView === 'superadmin' && (
        <SuperAdminPanel
          onReturnHome={() => navigateTo('customer')}
          onGoBranchAdmin={() => navigateTo('admin')}
        />
      )}


      {/* Interactive Modals */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setPreselectedStylist(null);
        }}
        preselectedService={preselectedService}
        preselectedStylist={preselectedStylist}
      />

      <InvoiceModal
        appointment={selectedInvoiceApt}
        onClose={() => setSelectedInvoiceApt(null)}
      />

      {/* Toast Notifications Container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div className="custom-toast" key={t.id}>
            <Bell size={16} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
