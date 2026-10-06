import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Globe, Store, Shield, FileText, ArrowLeft, LayoutDashboard, LogOut, PlusCircle, ExternalLink } from 'lucide-react';

export default function SuperAdminPanel({ onReturnHome, onGoBranchAdmin }) {
  const {
    data, setCurrentSalonId, addSalonBranch, toggleSalonStatus,
    updateAdminPermissions, logout
  } = useSalon();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '', city: 'Bengaluru', phone: '+91 98000 11223', address: '', adminName: 'Ramesh Patel', adminEmail: 'ramesh@looksprofessional.com'
  });

  const totalConsolidatedRev = data.salons.reduce((sum, s) => sum + (s.monthlyRevenue || 0), 0) +
    data.appointments.reduce((sum, a) => sum + (a.finalAmount || 0), 0);

  const rbacModules = [
    { key: "appointments", label: "Appointments & Booking Manager" },
    { key: "customers", label: "Customer CRM & History" },
    { key: "services", label: "Services & Pricing Editor" },
    { key: "staff", label: "Staff Roster & Commission" },
    { key: "billing", label: "Billing & POS Terminal" },
    { key: "inventory", label: "Inventory Stock In/Out" },
    { key: "expenses", label: "Expense Tracking" },
    { key: "reports", label: "Financial Reports Export" },
    { key: "settings", label: "Salon Business Settings" }
  ];

  return (
    <main className="view-section active-view">
      <div className="admin-portal-wrapper">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <h3 style={{ color: 'var(--gold-primary)' }}>SUPER ADMIN HQ</h3>
            <p>Global Multi-Salon Network</p>
          </div>

          <ul className="admin-menu-list">
            <li
              className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={16} /> HQ Overview
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'rbac' ? 'active' : ''}`}
              onClick={() => setActiveTab('rbac')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={16} /> RBAC Security Matrix
              </span>
            </li>
            <li
              className={`admin-nav-item ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={16} /> System Audit Logs
              </span>
            </li>
          </ul>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button className="btn-outline-gold" style={{ width: '100%', fontSize: '12px', justifyContent: 'center' }} onClick={onReturnHome}>
              <ArrowLeft size={14} /> Return to Website
            </button>
            <button className="btn-secondary" style={{ width: '100%', fontSize: '12px', justifyContent: 'center' }} onClick={onGoBranchAdmin}>
              <LayoutDashboard size={14} /> Branch Admin
            </button>
            <button className="btn-danger" style={{ width: '100%', fontSize: '12px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={logout}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <section className="admin-main-view">
          {/* TAB 1: HQ OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>Consolidated Enterprise Performance</h2>
                  <p>Aggregated multi-branch revenue, salon chain health, and franchise metrics.</p>
                </div>
                <button className="btn-gold" onClick={() => setShowAddBranchModal(true)}>
                  <PlusCircle size={14} /> Register New Branch
                </button>
              </div>

              {/* KPI Cards */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <h5>Total Salons / Branches</h5>
                  <div className="kpi-value">{data.salons.length}</div>
                  <div className="kpi-trend trend-up">100% Operational</div>
                </div>
                <div className="kpi-card">
                  <h5>Consolidated Revenue</h5>
                  <div className="kpi-value">₹{(totalConsolidatedRev / 100000).toFixed(2)} Lakhs</div>
                  <div className="kpi-trend trend-up">+24% YoY Growth</div>
                </div>
                <div className="kpi-card">
                  <h5>Total Appointments</h5>
                  <div className="kpi-value">{data.appointments.length + 3550}</div>
                </div>
                <div className="kpi-card">
                  <h5>Total Certified Staff</h5>
                  <div className="kpi-value">{data.staff.length + 18} Artists</div>
                </div>
                <div className="kpi-card">
                  <h5>Franchise Plans</h5>
                  <div className="kpi-value">{data.salons.length} Active</div>
                </div>
              </div>

              <div className="section-header" style={{ textAlign: 'left', margin: '30px 0 16px' }}>
                <h3 style={{ color: '#fff' }}>Salon Branch Performance Cards</h3>
              </div>

              <div className="services-grid">
                {data.salons.map(s => (
                  <div className="service-card" style={{ padding: 0 }} key={s.id}>
                    <div className="service-img-wrap" style={{ height: '150px' }}>
                      <img src={s.image} alt={s.name} />
                      <span className="service-gender-tag">{s.city}</span>
                      <span className={`status-pill ${s.status === 'Active' ? 'status-completed' : 'status-cancelled'}`} style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        {s.status}
                      </span>
                    </div>
                    <div className="service-body">
                      <h3 style={{ fontSize: '18px' }}>{s.name}</h3>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {s.address}<br />
                        Admin: <strong>{s.adminName}</strong> ({s.adminEmail})
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '12px', marginBottom: '14px' }}>
                        <div>Rating: <strong style={{ color: 'var(--gold-light)' }}>★ {s.rating}</strong></div>
                        <div>Monthly Rev: <strong style={{ color: 'var(--gold-light)' }}>₹{(s.monthlyRevenue || 0).toLocaleString()}</strong></div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, fontSize: '12px' }}
                          onClick={() => {
                            setCurrentSalonId(s.id);
                            onGoBranchAdmin();
                          }}
                        >
                          <ExternalLink size={12} style={{ marginRight: '4px' }} /> View Branch
                        </button>
                        <button
                          className={s.status === 'Active' ? 'btn-danger' : 'btn-gold'}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                          onClick={() => toggleSalonStatus(s.id)}
                        >
                          {s.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RBAC MATRIX */}
          {activeTab === 'rbac' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>Role-Based Access Control (RBAC) Matrix</h2>
                  <p>Control exact feature permissions granted to all branch managers.</p>
                </div>
              </div>

              <div className="table-container" style={{ maxWidth: '700px' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Module Feature</th>
                      <th style={{ textAlign: 'center' }}>Branch Admin Access</th>
                      <th>Permission Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rbacModules.map(m => (
                      <tr key={m.key}>
                        <td><strong>{m.label}</strong></td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={!!data.adminPermissions[m.key]}
                            onChange={(e) => updateAdminPermissions(m.key, e.target.checked)}
                            style={{ transform: 'scale(1.3)', cursor: 'pointer', accentColor: 'var(--gold-primary)' }}
                          />
                        </td>
                        <td><span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Branch Manager Access</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div>
              <div className="admin-header-row">
                <div className="admin-page-title">
                  <h2>Real-Time Security & System Audit Trail</h2>
                  <p>Log of all administrative actions, billing generations, and configuration updates.</p>
                </div>
              </div>

              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User / Role</th>
                      <th>Event Type</th>
                      <th>Action Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.auditLogs || []).map(l => (
                      <tr key={l.id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-gold)' }}>{l.timestamp}</td>
                        <td><strong>{l.user}</strong></td>
                        <td><span className="skill-badge">{l.type}</span></td>
                        <td>{l.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MODAL: REGISTER BRANCH */}
      {showAddBranchModal && (
        <div className="modal-backdrop show" onClick={() => setShowAddBranchModal(false)}>
          <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Salon Branch</h3>
              <button className="btn-close-modal" onClick={() => setShowAddBranchModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const cleanPhone = (newBranch.phone || '').replace(/\D/g, '');
              if (cleanPhone.length !== 10) {
                alert('Please enter a valid 10-digit contact phone number.');
                return;
              }
              addSalonBranch({
                ...newBranch,
                phone: `+91 ${cleanPhone}`
              });
              setShowAddBranchModal(false);
            }}>
              <div className="form-group">
                <label className="form-label">Salon Branch Name *</label>
                <input type="text" className="form-control" required placeholder="e.g. Looks Professional Indiranagar" value={newBranch.name} onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input type="text" className="form-control" required placeholder="Bengaluru" value={newBranch.city} onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone *</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="form-control"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10-digit phone number"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                  {newBranch.phone ? (
                    newBranch.phone.length === 10 ? (
                      <small style={{ color: '#10B981', fontSize: '11px', display: 'block', marginTop: '3px', fontWeight: 600 }}>✓ Valid 10-digit number</small>
                    ) : (
                      <small style={{ color: '#EF4444', fontSize: '11px', display: 'block', marginTop: '3px' }}>10 digits required ({newBranch.phone.length}/10)</small>
                    )
                  ) : null}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Address</label>
                <input type="text" className="form-control" required placeholder="100 Feet Road, Indiranagar" value={newBranch.address} onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Branch Admin Name</label>
                  <input type="text" className="form-control" placeholder="Ramesh Patel" value={newBranch.adminName} onChange={(e) => setNewBranch({ ...newBranch, adminName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Admin Email</label>
                  <input type="email" className="form-control" placeholder="ramesh@looksprofessional.com" value={newBranch.adminEmail} onChange={(e) => setNewBranch({ ...newBranch, adminEmail: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '10px' }}>Deploy New Branch</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
