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
  
  // Tab state: 'admin' | 'employee'
  const [activeTab, setActiveTab] = useState('admin');
  
  // Form credentials
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);

  // Switch between Admin & Employee tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    if (tab === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('employee');
      setPassword('employee123');
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
    <main style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw', 
      background: 'var(--bg-primary)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(212,163,115,0.03) 0%, rgba(212,163,115,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(212,163,115,0.03) 0%, rgba(212,163,115,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

      <div style={{ 
        width: '100%',
        maxWidth: '440px', 
        padding: '32px 32px', 
        background: 'rgba(30, 41, 59, 0.7)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 163, 115, 0.15)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 2,
        margin: '20px'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block', filter: 'drop-shadow(0 0 10px rgba(212,163,115,0.4))' }}>👑</span>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '24px', 
            fontWeight: 700, 
            color: '#fff', 
            marginBottom: '4px', 
            letterSpacing: '1px'
          }}>
            LOOKS PROFESSIONAL
          </h1>
          <div style={{ 
            fontSize: '11px', 
            color: 'var(--gold-primary)', 
            letterSpacing: '3px', 
            textTransform: 'uppercase', 
            fontWeight: 700,
            marginBottom: '16px' 
          }}>
            Unisex Salon
          </div>
          
          <h2 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '6px', fontWeight: 500 }}>Welcome Back</h2>
          <p style={{ color: '#e2e8f0', fontSize: '13px' }}>Sign in to access your portal</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs-container" style={{ 
          marginBottom: '20px', 
          background: 'rgba(15, 23, 42, 0.6)', 
          padding: '4px', 
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'admin' ? 'active-tab' : ''}`}
            onClick={() => handleTabChange('admin')}
            style={{ padding: '10px', borderRadius: '10px', fontSize: '13px' }}
          >
            <Building2 size={14} />
            <span>Admin</span>
          </button>
          <button
            type="button"
            className={`login-tab-btn ${activeTab === 'employee' ? 'active-tab-super' : ''}`}
            onClick={() => handleTabChange('employee')}
            style={{ padding: '10px', borderRadius: '10px', fontSize: '13px' }}
          >
            <User size={14} />
            <span>Employee</span>
          </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '16px',
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>
              Username or Email <span style={{ color: 'var(--gold-primary)' }}>*</span>
            </label>
            <div className="luxury-input-wrapper">
              <User size={16} className="input-icon-left" style={{ color: 'var(--gold-primary)' }} />
              <input
                type="text"
                className="form-control"
                style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(212, 163, 115, 0.2)', paddingLeft: '40px', height: '46px', borderRadius: '10px', fontSize: '14px' }}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={activeTab === 'admin' ? 'admin' : 'Enter email or username'}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff', marginBottom: '6px', display: 'block' }}>
              Password <span style={{ color: 'var(--gold-primary)' }}>*</span>
            </label>
            <div className="luxury-input-wrapper">
              <Lock size={16} className="input-icon-left" style={{ color: 'var(--gold-primary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(212, 163, 115, 0.2)', paddingLeft: '40px', height: '46px', borderRadius: '10px', fontSize: '14px' }}
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
                style={{ right: '10px', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            fontSize: '12.5px',
            color: '#e2e8f0'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                style={{ accentColor: 'var(--gold-primary)', width: '14px', height: '14px' }} 
              />
              Remember Me
            </label>
            <span style={{ color: 'var(--gold-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
              <CheckCircle2 size={14} /> Secure
            </span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`login-submit-gold ${activeTab === 'employee' ? 'login-submit-super' : ''}`}
            style={{ 
              opacity: loading ? 0.75 : 1, 
              cursor: loading ? 'wait' : 'pointer',
              height: '48px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              boxShadow: '0 4px 14px rgba(212, 163, 115, 0.2)'
            }}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <LogIn size={16} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Return Home */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          paddingTop: '16px', 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)' 
        }}>
          <button
            onClick={onReturnHome}
            style={{
              background: 'none',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontSize: '12.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              padding: '6px 12px',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold-light)'; e.currentTarget.style.background = 'rgba(212, 163, 115, 0.05)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'transparent' }}
          >
            <ArrowLeft size={13} /> Return to Main Website
          </button>
        </div>
      </div>
    </main>
  );
}
