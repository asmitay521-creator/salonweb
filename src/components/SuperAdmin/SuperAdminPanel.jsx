import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  User, Calendar, Clock, DollarSign, ArrowLeft, LogOut, CheckCircle,
  LayoutDashboard, CalendarDays, Users, Scissors, FileText, Award, TrendingUp, Star,
  Edit2, Trash2, Save, X, Menu
} from 'lucide-react';

export default function SuperAdminPanel({ onReturnHome }) {
  const { data, logout, createAppointment, updateAppointment, deleteAppointment, showToast } = useSalon();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', service: '', amount: '', notes: '' });
  const [serviceFlows, setServiceFlows] = useState([]); // Array of tasks in progress
  const [showForm, setShowForm] = useState(false);
  const [editingApt, setEditingApt] = useState(null);

  const currentStaffMember = (data.staff || []).find(s => 
    s.username === data.currentUser?.username || 
    s.id === data.currentUser?.id || 
    s.name === data.currentUser?.name
  ) || (data.staff || []).find(s => s.id === 'stf_emp') || { id: 'stf_emp', name: 'Staff Employee' };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim() || !newCustomer.service.trim()) {
      showToast('⚠️ Please enter customer name and service provided.');
      return;
    }
    const aptAmount = parseFloat(newCustomer.amount) || 0;
    createAppointment({
      customerName: newCustomer.name.trim(),
      customerPhone: newCustomer.phone.trim(),
      serviceName: newCustomer.service.trim(),
      amount: aptAmount,
      stylistId: currentStaffMember.id,
      stylistName: currentStaffMember.name,
      staffId: currentStaffMember.id,
      staffName: currentStaffMember.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
      paymentStatus: 'Pending',
      notes: newCustomer.notes || `Completed service submitted by ${currentStaffMember.name}`
    });
    setNewCustomer({ name: '', phone: '', service: '', amount: '', notes: '' });
    setShowForm(false);
  };

  const handleOpenEdit = (apt) => {
    setEditingApt({
      id: apt.id,
      customerName: apt.customerName || '',
      customerPhone: apt.customerPhone || apt.phone || '',
      serviceName: apt.serviceName || apt.service || '',
      amount: apt.finalAmount || apt.amount || '',
      notes: apt.notes || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingApt.customerName.trim() || !editingApt.serviceName.trim()) {
      showToast('⚠️ Please enter customer name and service provided.');
      return;
    }
    updateAppointment(editingApt.id, {
      customerName: editingApt.customerName.trim(),
      customerPhone: editingApt.customerPhone.trim(),
      serviceName: editingApt.serviceName.trim(),
      amount: parseFloat(editingApt.amount) || 0,
      notes: editingApt.notes || ''
    });
    setEditingApt(null);
  };

  const handleDeleteAppointment = (apt) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the service details for "${apt.customerName || 'this customer'}"? This will also remove it from the Admin billing dashboard.`);
    if (confirmDelete) {
      deleteAppointment(apt.id);
    }
  };

  const employeeName = data.currentUser?.name || currentStaffMember.name || 'Staff Employee';
  const currentStaffId = data.currentUser?.id || data.currentUser?.username || currentStaffMember.id;
  const myAppointments = (data.appointments || []).filter(a => 
    a.stylistId === currentStaffId || 
    a.staffId === currentStaffId ||
    a.stylistId === 'stf_emp' ||
    a.staffId === 'stf_emp' ||
    a.stylistName?.toLowerCase().includes(employeeName.toLowerCase()) ||
    a.staffName?.toLowerCase().includes(employeeName.toLowerCase()) ||
    a.staffName?.toLowerCase().includes('staff') ||
    a.stylistName?.toLowerCase().includes('staff')
  );
  const todayApts = myAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <main className="view-section active-view">
      {/* Mobile Top Header */}
      <div className="employee-mobile-topbar">
        <button
          className="employee-mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, color: 'var(--gold-primary)', fontSize: '13px', letterSpacing: '0.5px' }}>EMPLOYEE PORTAL</span>
          <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>{activeTab}</span>
        </div>
        <button
          className="btn-outline-gold"
          style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}
          onClick={onReturnHome}
        >
          Exit
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="employee-sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="admin-portal-wrapper">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="admin-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'var(--gold-primary)' }}>EMPLOYEE PORTAL</h3>
              <p>Welcome, {employeeName}</p>
            </div>
            <button
              className="looks-sidebar-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <ul className="admin-menu-list">
            <li
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={16} /> Dashboard
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => { setActiveTab('appointments'); setIsMobileMenuOpen(false); }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarDays size={16} /> Appointments
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} /> Service Completed
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scissors size={16} /> My Services
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => { setActiveTab('billing'); setIsMobileMenuOpen(false); }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={16} /> Billing
              </span>
            </li>

            <li
              className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setIsMobileMenuOpen(false); }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={16} /> Profile
              </span>
            </li>
          </ul>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn-outline-gold" style={{ width: '100%', fontSize: '12px', justifyContent: 'center' }} onClick={onReturnHome}>
              <ArrowLeft size={14} /> Return to Website
            </button>
            <button className="btn-danger" style={{ width: '100%', fontSize: '12px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={logout}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <section className="admin-main-view">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>My Appointments & Schedule</h2>
                  <p>View your daily schedule and upcoming bookings.</p>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <h5>Today's Appointments</h5>
                  <div className="kpi-value">{todayApts.length}</div>
                </div>
                <div className="kpi-card">
                  <h5>Total Completed</h5>
                  <div className="kpi-value">{myAppointments.filter(a => a.status === 'Completed').length}</div>
                </div>
                <div className="kpi-card">
                  <h5>Upcoming</h5>
                  <div className="kpi-value">{myAppointments.filter(a => a.status === 'Upcoming' || a.status === 'Confirmed').length}</div>
                </div>
              </div>

              <div className="section-header" style={{ textAlign: 'left', margin: '30px 0 16px' }}>
                <h3 style={{ color: '#0F172A', fontWeight: 800 }}>Recent Appointments</h3>
              </div>
              
              {myAppointments.length > 0 ? (
                <div className="table-container" style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                  <table className="custom-table">
                    <thead>
                      <tr style={{ background: '#F8FAFC' }}>
                        <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Date &amp; Time</th>
                        <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Employee Name</th>
                        <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Customer Name</th>
                        <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Service Provided</th>
                        <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Amount (₹)</th>
                        <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAppointments.map(apt => (
                        <tr key={apt.id}>
                          <td style={{ color: '#1E293B', fontWeight: 600 }}>{apt.date} <span style={{ color: '#64748B', fontSize: '12px', fontWeight: 500, marginLeft: '4px' }}>{apt.time}</span></td>
                          <td style={{ color: '#0F172A', fontWeight: 700 }}>{employeeName}</td>
                          <td>
                            <strong style={{ color: '#0F172A' }}>{apt.customerName}</strong>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>{apt.customerPhone || 'N/A'}</div>
                          </td>
                          <td><span style={{ background: '#F1F5F9', color: '#0F172A', padding: '4px 10px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', display: 'inline-block' }}>{apt.serviceName}</span></td>
                          <td><strong style={{ color: '#047857', fontSize: '15px' }}>₹{apt.amount || 0}</strong></td>
                          <td>
                            <span className={`status-pill ${apt.status === 'Completed' ? 'status-completed' : (apt.status === 'Cancelled' ? 'status-cancelled' : 'status-upcoming')}`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)' }}>
                  <Calendar size={40} style={{ color: '#64748B', marginBottom: '16px', margin: '0 auto' }} />
                  <h4 style={{ color: '#0F172A', fontWeight: 800 }}>No appointments found.</h4>
                  <p style={{ color: '#64748B' }}>You have no appointments assigned to you yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>Appointments</h2>
                  <p>Manage your assigned appointments and provide services.</p>
                </div>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Customer Name</th>
                      <th>Service Assigned</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceFlows.filter(f => f.status === 'Assigned' || f.status === 'In Progress').map(flow => (
                      <tr key={flow.id}>
                        <td>{flow.date}</td>
                        <td><strong>{flow.name}</strong></td>
                        <td>{flow.service}</td>
                        <td>
                          {flow.status === 'Assigned' ? (
                            <button className="btn-gold" style={{ fontSize: '12px' }} onClick={() => {
                              setServiceFlows(serviceFlows.map(f => f.id === flow.id ? { ...f, status: 'In Progress' } : f));
                            }}>Start Service</button>
                          ) : (
                            <button className="btn-secondary" style={{ backgroundColor: '#10B981', color: '#fff', fontSize: '12px', border: 'none' }} onClick={() => {
                              setServiceFlows(serviceFlows.map(f => f.id === flow.id ? { ...f, status: 'Completed' } : f));
                              setActiveTab('billing');
                            }}>Complete Service</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {serviceFlows.filter(f => f.status === 'Assigned' || f.status === 'In Progress').length === 0 && (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No pending appointments. Add a customer first.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'customers' && (
            <div>
              <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div className="admin-page-title">
                  <h2 style={{ color: '#0F172A', fontWeight: 800 }}>Submit Service Details</h2>
                  <p style={{ color: '#475569', fontSize: '14px', marginTop: '4px' }}>Fill out customer and service details after completion. This will be sent to the Admin for billing.</p>
                </div>
                <button 
                  className="btn-gold" 
                  onClick={() => setShowForm(true)}
                  style={{ padding: '10px 22px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  + Add Details
                </button>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                {myAppointments.filter(a => a.status === 'Completed').length > 0 ? (
                  <div className="table-container" style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                      <h3 style={{ color: '#0F172A', fontWeight: 800, fontSize: '18px', margin: 0 }}>Recently Submitted Services</h3>
                      <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                        Total: {myAppointments.filter(a => a.status === 'Completed').length} records
                      </span>
                    </div>
                    <table className="custom-table" style={{ margin: 0, width: '100%' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC' }}>
                          <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Date &amp; Time</th>
                          <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Customer Name</th>
                          <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Phone</th>
                          <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Service</th>
                          <th style={{ color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Amount (₹)</th>
                          <th style={{ textAlign: 'center', color: '#0F172A', fontWeight: 800, fontSize: '12.5px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myAppointments.filter(a => a.status === 'Completed').sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)).map(apt => (
                          <tr key={apt.id}>
                            <td style={{ color: '#1E293B', fontWeight: 600 }}>
                              {apt.date} <span style={{ color: '#64748B', fontSize: '12px', fontWeight: 500, marginLeft: '6px' }}>{apt.time}</span>
                            </td>
                            <td style={{ color: '#0F172A', fontWeight: 800, fontSize: '14px' }}>{apt.customerName}</td>
                            <td style={{ color: '#1E293B', fontWeight: 600, fontSize: '13.5px' }}>{apt.customerPhone || '-'}</td>
                            <td>
                              <span style={{ background: '#F1F5F9', color: '#0F172A', padding: '4px 10px', borderRadius: '6px', fontWeight: 600, fontSize: '13px', display: 'inline-block' }}>
                                {apt.serviceName}
                              </span>
                            </td>
                            <td style={{ color: '#047857', fontWeight: 800, fontSize: '15px' }}>₹{apt.amount}</td>
                            <td style={{ textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(apt)}
                                  title="Edit Service Details"
                                  style={{
                                    background: '#EFF6FF',
                                    color: '#1D4ED8',
                                    border: '1px solid #BFDBFE',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Edit2 size={13} /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAppointment(apt)}
                                  title="Delete Service Details"
                                  style={{
                                    background: '#FEF2F2',
                                    color: '#DC2626',
                                    border: '1px solid #FECACA',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '60px 40px', textAlign: 'center', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <FileText size={36} style={{ color: '#0F766E' }} />
                    </div>
                    <h3 style={{ color: '#0F172A', fontWeight: 800, marginBottom: '8px', fontSize: '20px' }}>No Submitted Services Yet</h3>
                    <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>Click the "+ Add Details" button above to submit customer service details to the admin dashboard.</p>
                    <button 
                      className="btn-gold" 
                      onClick={() => setShowForm(true)}
                      style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: 700 }}
                    >
                      + Add Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'services' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>My Services / Service History</h2>
                  <p>History of services you have successfully provided and billed.</p>
                </div>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Earned (₹)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceFlows.filter(f => f.status === 'Billed').map(flow => (
                      <tr key={flow.id}>
                        <td>{flow.date}</td>
                        <td><strong>{flow.name}</strong></td>
                        <td>{flow.service}</td>
                        <td>₹{flow.amount}</td>
                        <td><span className="status-pill status-completed">Saved</span></td>
                      </tr>
                    ))}
                    {serviceFlows.filter(f => f.status === 'Billed').length === 0 && (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No service history found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'billing' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>Billing</h2>
                  <p>Generate bills for completed services.</p>
                </div>
              </div>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceFlows.filter(f => f.status === 'Completed').map(flow => (
                      <tr key={flow.id}>
                        <td><strong>{flow.name}</strong></td>
                        <td>{flow.service}</td>
                        <td>₹{flow.amount}</td>
                        <td>
                          <button className="btn-gold" style={{ fontSize: '12px' }} onClick={() => {
                            createAppointment({
                              customerName: flow.name,
                              customerPhone: flow.phone || '+91 98000 00000',
                              serviceName: flow.service,
                              amount: parseFloat(flow.amount) || 500,
                              stylistId: currentStaffMember.id,
                              stylistName: currentStaffMember.name,
                              staffId: currentStaffMember.id,
                              staffName: currentStaffMember.name,
                              date: flow.date || new Date().toISOString().split('T')[0],
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              status: 'Completed',
                              paymentStatus: 'Pending',
                              notes: 'Completed service submitted by ' + currentStaffMember.name
                            });
                            setServiceFlows(serviceFlows.map(f => f.id === flow.id ? { ...f, status: 'Billed' } : f));
                            setActiveTab('services');
                          }}>Generate Bill &amp; Send to Admin</button>
                        </td>
                      </tr>
                    ))}
                    {serviceFlows.filter(f => f.status === 'Completed').length === 0 && (
                      <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No services pending for billing.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* TAB 2: PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>My Profile</h2>
                  <p>Your employee details and settings.</p>
                </div>
              </div>
              
              <div style={{
                background: '#ffffff',
                borderRadius: '24px',
                maxWidth: '550px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '550px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Banner Header */}
                <div style={{
                  height: '180px',
                  background: 'linear-gradient(135deg, #D4A373 0%, #8b5e34 100%)',
                  position: 'relative'
                }}>
                  {/* Decorative Elements */}
                  <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                  <div style={{ position: 'absolute', bottom: '-80px', left: '20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                </div>

                <div style={{ padding: '0 40px 40px 40px', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Avatar & Title Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-60px', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
                      <div style={{ 
                        width: '120px', height: '120px', borderRadius: '50%', 
                        background: '#ffffff', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '6px solid #ffffff',
                        position: 'relative',
                        zIndex: 2
                      }}>
                        <div style={{
                          width: '100%', height: '100%', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #D4A373 0%, #B58555 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: '48px', color: '#fff', fontWeight: '800',
                        }}>
                          {employeeName.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div style={{ paddingBottom: '10px' }}>
                        <h3 style={{ color: '#1e293b', fontSize: '32px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>{employeeName}</h3>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212, 163, 115, 0.1)', padding: '6px 14px', borderRadius: '20px' }}>
                          <Award size={16} color="#D4A373" />
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#B58555' }}>Professional Stylist</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ paddingBottom: '15px' }}>
                      <button className="btn-outline-gold" style={{ borderRadius: '20px', padding: '8px 20px', fontSize: '14px', fontWeight: '600' }}>Edit Profile</button>
                    </div>
                  </div>
                  
                  {/* Info Grid */}
                  <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', 
                    marginBottom: '30px'
                  }}>
                    {/* Contact Info Card */}
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                      <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Information</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                            <span style={{ fontSize: '18px' }}>✉️</span>
                          </div>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, fontWeight: '500', marginBottom: '2px' }}>Email Address</p>
                            <p style={{ color: '#1e293b', fontSize: '15px', margin: 0, fontWeight: '600' }}>{data.currentUser?.email || 'employee@salon.com'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                            <span style={{ fontSize: '18px' }}>📱</span>
                          </div>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, fontWeight: '500', marginBottom: '2px' }}>Phone Number</p>
                            <p style={{ color: '#1e293b', fontSize: '15px', margin: 0, fontWeight: '600' }}>+91 98765 43210</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Employment Details Card */}
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                      <h4 style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Employment Details</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                            <User size={18} color="#D4A373" />
                          </div>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, fontWeight: '500', marginBottom: '2px' }}>Role</p>
                            <p style={{ color: '#1e293b', fontSize: '15px', margin: 0, fontWeight: '600' }}>{data.currentUser?.role || 'Employee'}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                            <Calendar size={18} color="#D4A373" />
                          </div>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, fontWeight: '500', marginBottom: '2px' }}>Joined Date</p>
                            <p style={{ color: '#1e293b', fontSize: '15px', margin: 0, fontWeight: '600' }}>Oct 2026</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', 
                    marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '24px'
                  }}>
                     <div style={{ textAlign: 'center' }}>
                       <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Services Completed</p>
                       <p style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0 }}>{myAppointments.filter(a => a.status === 'Completed').length}</p>
                     </div>
                     <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                       <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Current Status</p>
                       <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dcfce7', padding: '6px 16px', borderRadius: '20px', marginTop: '2px' }}>
                         <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)' }}></div>
                         <span style={{ color: '#059669', fontWeight: '700', fontSize: '15px' }}>Active</span>
                       </div>
                     </div>
                     <div style={{ textAlign: 'center' }}>
                       <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Customer Rating</p>
                       <p style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                         4.9 <Star size={24} color="#fbbf24" fill="#fbbf24" style={{ marginBottom: '2px' }} />
                       </p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ADD SERVICE DETAILS MODAL */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              color: '#0F172A'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} style={{ color: '#0F766E' }} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Submit Service Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '24px',
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Customer Name *</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits"
                  placeholder="10-digit mobile number"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value.replace(/\D/g, '') })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Service Provided *</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  placeholder="e.g. Haircut & Styling"
                  value={newCustomer.service}
                  onChange={(e) => setNewCustomer({ ...newCustomer, service: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Amount (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  min="0"
                  placeholder="500"
                  value={newCustomer.amount}
                  onChange={(e) => setNewCustomer({ ...newCustomer, amount: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#F1F5F9',
                    color: '#334155',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                  style={{
                    flex: 1.5,
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Submit to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SERVICE DETAILS MODAL */}
      {editingApt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setEditingApt(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              color: '#0F172A'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit2 size={20} style={{ color: '#0F766E' }} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Edit Service Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '24px',
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Customer Name *</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  value={editingApt.customerName}
                  onChange={(e) => setEditingApt({ ...editingApt, customerName: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Phone Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter 10 digits"
                  value={editingApt.customerPhone}
                  onChange={(e) => setEditingApt({ ...editingApt, customerPhone: e.target.value.replace(/\D/g, '') })}
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Service Provided *</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  value={editingApt.serviceName}
                  onChange={(e) => setEditingApt({ ...editingApt, serviceName: e.target.value })}
                  placeholder="e.g. Haircut & Styling"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: '#0F172A', display: 'block' }}>Amount (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '10px 14px', color: '#0F172A', fontSize: '14px', width: '100%' }}
                  required
                  min="0"
                  value={editingApt.amount}
                  onChange={(e) => setEditingApt({ ...editingApt, amount: e.target.value })}
                  placeholder="500"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingApt(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#F1F5F9',
                    color: '#334155',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                  style={{
                    flex: 1.5,
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Save size={15} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
