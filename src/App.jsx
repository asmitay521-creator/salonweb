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


// Helper to synchronously resolve the route on initial render to prevent flash/overlap
const resolveInitialRoute = () => {
  if (typeof window === 'undefined') return 'customer';
  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();

  // 1. Explicit Hashes
  if (hash === '#/contact' || hash === '#contact') return 'contact';
  if (hash === '#/customer-dash' || hash === '#customer-dash') return 'customer-dash';
  if (hash === '#/employee' || hash === '#employee') return 'employee';
  if (hash === '#/admin-login' || hash === '#admin-login') return 'admin-login';
  if (hash === '#/admin' || hash === '#admin' || hash === '#/admim' || hash === '#admim') {
    const savedAuth = JSON.parse(localStorage.getItem('LUMIERE_AUTH_USER') || 'null');
    if (savedAuth && savedAuth.role === 'employee') return 'employee';
    return 'admin';
  }
  if (hash === '#/' || hash === '#' || hash === '') {
    if (path.endsWith('/contact') || path.endsWith('/contact/')) return 'contact';
    if (path.endsWith('/customer-dash')) return 'customer-dash';
    if (path.endsWith('/employee') || path.endsWith('/employee/')) return 'employee';
    if (path.endsWith('/admin') || path.endsWith('/admin/') || path.endsWith('/admim') || path.endsWith('/admim/')) {
      const savedAuth = JSON.parse(localStorage.getItem('LUMIERE_AUTH_USER') || 'null');
      if (savedAuth && savedAuth.role === 'employee') return 'employee';
      return 'admin';
    }
    return 'customer';
  }
  // In-page anchor hash on public site
  return 'customer';
};

export default function App() {
  const { data, toasts } = useSalon();

  // Navigation route: 'customer' | 'customer-dash' | 'contact' | 'admin-login' | 'admin' | 'employee'
  const [currentView, setCurrentView] = useState(resolveInitialRoute);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState(null);
  const [preselectedStylist, setPreselectedStylist] = useState(null);
  const [selectedInvoiceApt, setSelectedInvoiceApt] = useState(null);

  // Sync with URL Route (/admin, /admim, #/admin, /contact, /employee, /customer-dash)
  useEffect(() => {
    const handleUrlRoute = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      const auth = data.currentUser;

      // 1. Explicit Hashes take top priority
      if (hash === '#/contact' || hash === '#contact') {
        setCurrentView(prev => prev === 'contact' ? prev : 'contact');
        return;
      }
      if (hash === '#/customer-dash' || hash === '#customer-dash') {
        setCurrentView(prev => prev === 'customer-dash' ? prev : 'customer-dash');
        return;
      }
      if (hash === '#/employee' || hash === '#employee') {
        const nextView = (auth && (auth.role === 'employee' || auth.role === 'admin')) ? 'employee' : 'admin-login';
        setCurrentView(prev => prev === nextView ? prev : nextView);
        return;
      }
      if (hash === '#/admin-login' || hash === '#admin-login') {
        setCurrentView(prev => prev === 'admin-login' ? prev : 'admin-login');
        return;
      }
      if (hash === '#/admin' || hash === '#admin' || hash === '#/admim' || hash === '#admim') {
        if (auth && auth.role === 'employee') {
          setCurrentView(prev => prev === 'employee' ? prev : 'employee');
        } else {
          setCurrentView(prev => prev === 'admin' ? prev : 'admin');
        }
        return;
      }
      if (hash === '#/' || hash === '#home' || hash === '#services' || hash === '#about' || hash === '#gallery' || hash === '#reviews' || hash === '#packages') {
        setCurrentView(prev => prev === 'customer' ? prev : 'customer');
        return;
      }

      // 2. If no matching hash, fall back to pathname checks
      if (path.endsWith('/contact') || path.endsWith('/contact/')) {
        setCurrentView(prev => prev === 'contact' ? prev : 'contact');
        return;
      }
      if (path.endsWith('/employee') || path.endsWith('/employee/')) {
        const nextView = (auth && (auth.role === 'employee' || auth.role === 'admin')) ? 'employee' : 'admin-login';
        setCurrentView(prev => prev === nextView ? prev : nextView);
        return;
      }
      if (path.endsWith('/admin') || path.endsWith('/admin/') || path.endsWith('/admim') || path.endsWith('/admim/')) {
        if (auth && auth.role === 'employee') {
          setCurrentView(prev => prev === 'employee' ? prev : 'employee');
        } else {
          setCurrentView(prev => prev === 'admin' ? prev : 'admin');
        }
        return;
      }
      if (path.endsWith('/customer-dash')) {
        setCurrentView(prev => prev === 'customer-dash' ? prev : 'customer-dash');
        return;
      }

      setCurrentView(prev => prev === 'customer' ? prev : 'customer');
    };

    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);
    handleUrlRoute();

    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, [data.currentUser?.id, data.currentUser?.role]);

  const navigateTo = (view) => {
    setCurrentView(view);
    const targetHash = {
      'customer': '#/',
      'customer-dash': '#/customer-dash',
      'contact': '#/contact',
      'admin-login': '#/admin-login',
      'admin': '#/admin',
      'employee': '#/employee'
    }[view] || '#/';

    try {
      if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        window.history.pushState(null, '', '/' + targetHash);
      } else {
        window.location.hash = targetHash;
      }
    } catch (e) {
      window.location.hash = targetHash;
    }

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

      {/* 3. Unified Admin & Employee Login (/admin) */}
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
          onGoEmployee={() => navigateTo('employee')}
          onViewInvoice={(apt) => setSelectedInvoiceApt(apt)}
        />
      )}

      {/* 5. Employee Panel */}
      {currentView === 'employee' && (
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
