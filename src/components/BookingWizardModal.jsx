import React, { useState, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import { X, CheckCircle2, Sparkles, Send } from 'lucide-react';

export default function BookingWizardModal({ isOpen, onClose, preselectedService, preselectedStylist }) {
  const { data, createAppointment } = useSalon();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);

  // Sync preselected service / stylist
  useEffect(() => {
    if (preselectedService && preselectedService.id) {
      setSelectedServiceId(preselectedService.id);
    } else if (data.services && data.services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(data.services[0].id);
    }
  }, [preselectedService, isOpen, data.services]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }
    const formattedPhone = `+91 ${cleanPhone}`;
    const serviceObj = (data.services || []).find(s => s.id === selectedServiceId) || data.services[0] || {};
    
    const newApt = {
      serviceId: serviceObj.id || 'srv_01',
      serviceName: serviceObj.name || 'Salon Appointment',
      gender: serviceObj.gender || 'unisex',
      staffId: preselectedStylist?.id || 'stf_01',
      staffName: preselectedStylist?.name || 'Assigned Master Stylist',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      duration: serviceObj.duration || '60 Mins',
      amount: serviceObj.price || 1500,
      customerName,
      customerPhone: formattedPhone,
      customerEmail,
      appointmentNotes: appointmentDetails,
      paymentMethod: 'Pay at Salon',
      paymentStatus: 'Pending'
    };

    if (createAppointment) {
      createAppointment(newApt);
    }
    setConfirmedData(newApt);
    setIsSuccess(true);
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    setConfirmedData(null);
    onClose();
  };

  return (
    <div className="simple-booking-backdrop" onClick={handleModalClose}>
      <div className="simple-booking-modal-card" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="simple-modal-close-btn" onClick={handleModalClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {isSuccess ? (
          /* ================= SUCCESS STATE ================= */
          <div className="simple-booking-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} color="#49B9CA" />
            </div>
            <h3>Appointment Request Received!</h3>
            <p className="success-sub">
              Thank you, <strong>{confirmedData?.customerName}</strong>. We have received your booking request for <strong>{confirmedData?.serviceName}</strong>.
            </p>
            <div className="success-highlight-box">
              <span>Our salon team will contact you shortly on <strong>{confirmedData?.customerPhone}</strong> to confirm your exact appointment schedule.</span>
            </div>
            <button className="btn-simple-submit" onClick={handleModalClose} style={{ marginTop: '20px' }}>
              OK, Got It
            </button>
          </div>
        ) : (
          /* ================= 2-COLUMN BOOKING MODAL ================= */
          <div className="simple-booking-grid">
            
            {/* Left Column: Aesthetics Salon Image */}
            <div className="simple-booking-image-col">
              <img 
                src="assets/images/simple_booking_banner.jpg" 
                alt="Book Salon Appointment" 
                className="simple-booking-cover-img"
              />
              <div className="image-overlay-caption">
                <span className="caption-brand">LOOKS PROFESSIONAL</span>
                <h4>Luxury Salon &amp; Aesthetic Care</h4>
              </div>
            </div>

            {/* Right Column: Clean Simple Form */}
            <div className="simple-booking-form-col">
              
              <div className="form-header-minimal">
                <h2>Book Appointment</h2>
                <p>Fill out the simple form below to reserve your appointment.</p>
              </div>

              <form onSubmit={handleSubmit} className="simple-form-body">
                
                {/* 1. Name */}
                <div className="simple-input-group">
                  <input 
                    type="text" 
                    required 
                    placeholder="Your Name *" 
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="simple-text-input"
                  />
                </div>

                {/* 2. Email */}
                <div className="simple-input-group">
                  <input 
                    type="email" 
                    required 
                    placeholder="Your Email *" 
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="simple-text-input"
                  />
                </div>

                {/* 3. Contact Number */}
                <div className="simple-input-group">
                  <input 
                    type="tel" 
                    inputMode="numeric"
                    required 
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="Contact Number (10 Digits) *" 
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="simple-text-input"
                  />
                  {customerPhone ? (
                    customerPhone.length === 10 ? (
                      <small style={{ color: '#10B981', fontSize: '11px', marginTop: '3px', display: 'block', textAlign: 'left', fontWeight: 600 }}>✓ 10-digit number verified</small>
                    ) : (
                      <small style={{ color: '#EF4444', fontSize: '11px', marginTop: '3px', display: 'block', textAlign: 'left' }}>10 digits required ({customerPhone.length}/10)</small>
                    )
                  ) : null}
                </div>

                {/* 4. Select Service / Book Appointment Dropdown */}
                <div className="simple-input-group">
                  <select 
                    value={selectedServiceId}
                    onChange={e => setSelectedServiceId(e.target.value)}
                    className="simple-select-input"
                    required
                  >
                    <option value="" disabled>Select Service / Book Appointment *</option>
                    {(data.services || []).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{s.price?.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Appointment For / Date & Notes */}
                <div className="simple-input-group">
                  <input 
                    type="text" 
                    placeholder="Appointment For / Preferred Date & Time" 
                    value={appointmentDetails}
                    onChange={e => setAppointmentDetails(e.target.value)}
                    className="simple-text-input"
                  />
                </div>

                {/* 6. Submit Button */}
                <button type="submit" className="btn-simple-submit">
                  <span>Submit</span>
                </button>

              </form>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
