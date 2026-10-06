import React from 'react';
import { useSalon } from '../context/SalonContext';
import { X, Printer } from 'lucide-react';

export default function InvoiceModal({ appointment, onClose }) {
  const { getCurrentSalon } = useSalon();
  if (!appointment) return null;

  const salon = getCurrentSalon();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop show" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Tax Invoice Receipt</h3>
          <button className="btn-close-modal" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="invoice-slip-container">
          <div className="invoice-slip-header">
            <h2>{salon.name.toUpperCase()}</h2>
            <p style={{ fontSize: '11px', marginTop: '4px' }}>{salon.address}</p>
            <p style={{ fontSize: '11px' }}>Tel: {salon.phone} | GSTIN: 27AABCL1234F1Z5</p>
            <div style={{ marginTop: '12px', fontWeight: 'bold', fontSize: '13px' }}>
              TAX INVOICE & CASH RECEIPT
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px' }}>
            <div>
              <div><strong>Invoice No:</strong> INV-{appointment.id.replace('apt_', '2026-')}</div>
              <div><strong>Date & Time:</strong> {appointment.date} {appointment.time}</div>
              <div><strong>Stylist:</strong> {appointment.staffName}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div><strong>Guest:</strong> {appointment.customerName}</div>
              <div><strong>Mobile:</strong> {appointment.customerPhone}</div>
              <div><strong>Status:</strong> {appointment.paymentStatus.toUpperCase()}</div>
            </div>
          </div>

          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Rate (₹)</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{appointment.serviceName}</td>
                <td style={{ textAlign: 'center' }}>1</td>
                <td style={{ textAlign: 'right' }}>{appointment.amount}</td>
                <td style={{ textAlign: 'right' }}>{appointment.amount}</td>
              </tr>
            </tbody>
          </table>

          <div className="invoice-total-summary">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal' }}>
              <span>Subtotal:</span>
              <span>₹{appointment.amount}</span>
            </div>
            {appointment.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'green', fontWeight: 'normal' }}>
                <span>Promo Discount ({appointment.couponCode}):</span>
                <span>-₹{appointment.discount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal' }}>
              <span>CGST (9%) + SGST (9%):</span>
              <span>₹{appointment.tax}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', borderTop: '1px dashed #000', paddingTop: '6px' }}>
              <span>NET PAID:</span>
              <span>₹{appointment.finalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', borderTop: '1px dashed #ccc', paddingTop: '12px' }}>
            <p>Thank you for visiting Looks Professional!</p>
            <p>Visit again for a 5-star rejuvenating luxury experience.</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-gold" onClick={handlePrint}>
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
