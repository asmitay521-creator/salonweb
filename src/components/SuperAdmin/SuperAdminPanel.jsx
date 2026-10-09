import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  User, Calendar, Clock, DollarSign, ArrowLeft, LogOut, CheckCircle,
  LayoutDashboard, CalendarDays, Users, Scissors, FileText, Award, TrendingUp, Star
} from 'lucide-react';

export default function SuperAdminPanel({ onReturnHome }) {
  const { data, logout, createAppointment, showToast } = useSalon();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', service: '', amount: '', notes: '' });
  const [serviceFlows, setServiceFlows] = useState([]); // Array of tasks in progress
  const [showForm, setShowForm] = useState(false);

  const handleAddCustomer = (e) => {
    e.preventDefault();
    createAppointment({
      customerName: newCustomer.name,
      customerPhone: newCustomer.phone,
      serviceName: newCustomer.service,
      amount: parseFloat(newCustomer.amount) || 0,
      stylistId: data.currentUser?.username || data.currentUser?.id,
      stylistName: data.currentUser?.name,
      staffId: data.currentUser?.username || data.currentUser?.id,
      staffName: data.currentUser?.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
      paymentStatus: 'Pending',
      notes: newCustomer.notes
    });
    showToast(`✅ Service details for ${newCustomer.name} submitted to Admin!`);
    setNewCustomer({ name: '', phone: '', service: '', amount: '', notes: '' });
    setShowForm(false);
  };

  const employeeName = data.currentUser?.name || 'Staff Employee';
  const myAppointments = data.appointments.filter(a => a.stylistId === data.currentUser?.username || a.stylistName?.includes(employeeName));
  const todayApts = myAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <main className="view-section active-view">
      <div className="admin-portal-wrapper">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <h3 style={{ color: 'var(--gold-primary)' }}>EMPLOYEE PORTAL</h3>
            <p>Welcome, {employeeName}</p>
          </div>

          <ul className="admin-menu-list">
            <li
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={16} /> Dashboard
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarDays size={16} /> Appointments
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={16} /> Service Completed
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scissors size={16} /> My Services
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveTab('billing')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={16} /> Billing
              </span>
            </li>

            <li
              className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
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
                <h3 style={{ color: '#fff' }}>Recent Appointments</h3>
              </div>
              
              {myAppointments.length > 0 ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Employee Name</th>
                        <th>Customer Name</th>
                        <th>Service Provided</th>
                        <th>Amount (₹)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAppointments.map(apt => (
                        <tr key={apt.id}>
                          <td>{apt.date} {apt.time}</td>
                          <td>{employeeName}</td>
                          <td>
                            <strong>{apt.customerName}</strong>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{apt.customerPhone || 'N/A'}</div>
                          </td>
                          <td>{apt.serviceName}</td>
                          <td><strong>₹{apt.amount || 0}</strong></td>
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
                <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  <Calendar size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', margin: '0 auto' }} />
                  <h4 style={{ color: 'var(--text-secondary)' }}>No appointments found.</h4>
                  <p style={{ color: 'var(--text-muted)' }}>You have no appointments assigned to you yet.</p>
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
                  <h2>Submit Service Details</h2>
                  <p>Fill out customer and service details after completion. This will be sent to the Admin for billing.</p>
                </div>
                <button 
                  className="btn-gold" 
                  onClick={() => setShowForm(!showForm)}
                  style={{ padding: '10px 20px', borderRadius: '8px' }}
                >
                  {showForm ? 'Cancel' : '+ Add Details'}
                </button>
              </div>
              
              {showForm ? (
                <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '16px', maxWidth: '450px', minHeight: '500px', display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                  <form onSubmit={handleAddCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                    <div className="form-group">
                      <label className="form-label">Customer Name *</label>
                      <input type="text" className="form-control" required placeholder="e.g. Rahul Sharma" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" className="form-control" required placeholder="10-digit number" pattern="[0-9]{10}" title="Please enter exactly 10 digits" maxLength={10} value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value.replace(/\D/g, '')})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Service Provided *</label>
                      <input type="text" className="form-control" required placeholder="e.g. Haircut & Styling" value={newCustomer.service} onChange={e => setNewCustomer({...newCustomer, service: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Amount (₹) *</label>
                      <input type="number" className="form-control" required placeholder="500" value={newCustomer.amount} onChange={e => setNewCustomer({...newCustomer, amount: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: 'auto', padding: '14px', fontSize: '15px' }}>Submit to Admin Dashboard</button>
                  </form>
                </div>
              ) : (
                <div style={{ marginTop: '20px' }}>
                  {myAppointments.filter(a => a.status === 'Completed').length > 0 ? (
                    <div className="table-container" style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px' }}>
                      <h3 style={{ color: '#fff', marginBottom: '16px', fontSize: '18px' }}>Recently Submitted Services</h3>
                      <table className="custom-table" style={{ margin: 0 }}>
                        <thead>
                          <tr>
                            <th>Date & Time</th>
                            <th>Customer Name</th>
                            <th>Phone</th>
                            <th>Service</th>
                            <th>Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myAppointments.filter(a => a.status === 'Completed').sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)).map(apt => (
                            <tr key={apt.id}>
                              <td>{apt.date} <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{apt.time}</span></td>
                              <td><strong>{apt.customerName}</strong></td>
                              <td>{apt.customerPhone}</td>
                              <td>{apt.serviceName}</td>
                              <td style={{ color: 'var(--gold-primary)', fontWeight: 'bold' }}>₹{apt.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(212, 163, 115, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <FileText size={40} style={{ color: 'var(--gold-primary)' }} />
                      </div>
                      <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '24px' }}>Ready to submit details?</h3>
                      <p style={{ color: 'var(--text-muted)' }}>Click the "+ Add Details" button above to open the form and submit a new completed service.</p>
                    </div>
                  )}
                </div>
              )}
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
                            setServiceFlows(serviceFlows.map(f => f.id === flow.id ? { ...f, status: 'Billed' } : f));
                            alert('Bill Successful! Service Record Automatically Saved.');
                            setActiveTab('services');
                          }}>Generate Bill</button>
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
    </main>
  );
}
