import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { 
  Building2, 
  Crown, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onReturnHome }) {
  const { login } = useSalon();
  
  // Tab state: 'admin' | 'superadmin'
  const [activeTab, setActiveTab] = useState('admin');
  
  // Form credentials
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);

  // Switch between Admin & Super Admin tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    if (tab === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('superadmin');
      setPassword('super123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        onLoginSuccess(res.role);
      } else {
        setErrorMsg(res.error || 'Invalid credentials. Please verify username and password.');
      }
    } catch (err) {
      setErrorMsg('Login failed: ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-wrapper">
      <div className="admin-login-card" style={{ maxWidth: '440px', padding: '36px 32px' }}>
        {/* Brand Luxury Header */}
        <div className="login-brand-header" style={{ marginBottom: '24px' }}>
          <span className="login-crown-emblem">👑</span>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '24px', 
            fontWeight: 700, 
            color: '#ffffff', 
            letterSpacing: '1px',
            marginBottom: '4px' 
          }}>
            LOOKS PROFESSIONAL
          </h1>
          <div style={{ 
            fontSize: '11px', 
            color: 'var(--gold-primary)', 
            letterSpacing: '2px', 
            fontWeight: 700, 
            textTransform: 'uppercase' 
          }}>
            UNISEX SALON
          </div>
        </div>

        {/* 2 Tabs: Admin Login & Super Admin Login */}
        <div className="login-tabs-container" style={{ marginBottom: '24px' }}>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'admin' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('admin')}
            id="tab-admin-login"
          >
            <Building2 size={16} />
            <span>Admin Login</span>
          </button>

          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'superadmin' ? 'active-tab-super' : ''}`}
            onClick={() => handleTabChange('superadmin')}
            id="tab-superadmin-login"
          >
            <Crown size={16} />
            <span>Super Admin Login</span>
          </button>
        </div>

        {/* Error Feedback Message (if invalid login) */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#f87171',
            fontSize: '12.5px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Clean Login Form: Only Username and Password */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
              Username or Email *
            </label>
            <div className="luxury-input-wrapper">
              <User size={16} className="input-icon-left" />
              <input
                type="text"
                className="form-control"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'admin' ? 'admin' : 'superadmin'}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
              Password *
            </label>
            <div className="luxury-input-wrapper">
              <Lock size={16} className="input-icon-left" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-btn-right"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Remember Session */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
            fontSize: '12.5px',
            color: 'var(--text-secondary)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                style={{ accentColor: 'var(--gold-primary)' }} 
              />
              Remember Session
            </label>
            <span style={{ fontSize: '11px', color: 'var(--gold-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Secure Portal
            </span>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`login-submit-gold ${activeTab === 'superadmin' ? 'login-submit-super' : ''}`}
            id="login-submit-btn"
            style={{ opacity: loading ? 0.75 : 1, cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? (
              <span>Authenticating with Firebase...</span>
            ) : activeTab === 'admin' ? (
              <>
                <LogIn size={16} /> Sign In as Admin
              </>
            ) : (
              <>
                <Crown size={16} /> Sign In as Super Admin
              </>
            )}
          </button>
        </form>

        {/* Return to Customer Portal */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '22px', 
          paddingTop: '16px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)' 
        }}>
          <button
            onClick={onReturnHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '12.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-light)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={13} /> Return to Main Salon Website
          </button>
        </div>
      </div>
    </main>
  );
}
