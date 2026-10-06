import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Calendar, PlusCircle, Gift, CreditCard, ArrowLeft, Plus, FileText } from 'lucide-react';

export default function CustomerPortal({ onOpenBooking, onViewInvoice, onReturnHome }) {
  const { data } = useSalon();

  // Find appointments for default customer Priya Deshmukh or current session
  const customerApts = data.appointments.filter(
    a => a.customerPhone === '+91 98920 11223' || a.customerId === 'cust_01'
  );

  return (
    <main className="view-section active-view">
      <div className="customer-dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="cust-profile-card">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
              className="cust-avatar"
              alt="Guest Avatar"
            />
            <h3 style={{ color: '#fff', fontSize: '17px' }}>Priya Deshmukh</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>+91 98920 11223</p>
            <span className="membership-pill">Diamond VIP</span>
          </div>

          <ul className="dashboard-menu">
            <li className="dash-menu-item active">
              <Calendar size={16} /> My Appointments
            </li>
            <li className="dash-menu-item" onClick={onOpenBooking}>
              <PlusCircle size={16} /> Book New Service
            </li>
            <li className="dash-menu-item">
              <Gift size={16} /> Offers & Coupons
            </li>
            <li className="dash-menu-item">
              <CreditCard size={16} /> Invoices & Bills
            </li>
            <li className="dash-menu-item" onClick={onReturnHome}>
              <ArrowLeft size={16} /> Back to Main Site
            </li>
          </ul>

          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-gold)'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
              Loyalty Balance
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
              850 pts
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Redeem on checkout for flat ₹850 discount on hair spa & facials.
            </p>
          </div>
        </aside>

        {/* Content */}
        <section className="dash-tab-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ color: '#fff', fontSize: '24px' }}>My Appointments & Visits</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Track your confirmed salon appointments and view tax invoice receipts.
              </p>
            </div>
            <button className="btn-gold" onClick={onOpenBooking}>
              <Plus size={14} /> Book Appointment
            </button>
          </div>

          {customerApts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No appointments booked yet.
            </div>
          ) : (
            <div>
              {customerApts.map(a => (
                <div
                  key={a.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    marginBottom: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '16px', color: '#fff' }}>{a.serviceName}</strong>
                      <span className={`status-pill status-${a.status.toLowerCase().replace(' ', '-')}`}>
                        {a.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Calendar size={13} style={{ display: 'inline-block', marginRight: '4px' }} />
                      {a.date} at {a.time} • Stylist: <strong>{a.staffName}</strong>
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Booking Ref: #{a.id} • Payment: <strong>{a.paymentMethod} ({a.paymentStatus})</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-light)' }}>
                      ₹{a.finalAmount.toLocaleString()}
                    </div>
                    <button
                      className="btn-outline-gold"
                      style={{ fontSize: '12px', padding: '4px 12px', marginTop: '6px' }}
                      onClick={() => onViewInvoice(a)}
                    >
                      <FileText size={12} style={{ marginRight: '4px' }} /> View Bill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
