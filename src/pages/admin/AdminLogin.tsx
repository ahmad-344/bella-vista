import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Email aur password dono zaroori hain.'); return; }
    setLoading(true);
    setError('');
    const err = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
    else navigate('/admin', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', fontFamily: 'Lato, sans-serif', padding: '20px' }}>

      {/* Background glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '42px', fontWeight: 300, color: '#c9a84c', lineHeight: 1, marginBottom: '4px' }}>
            Bella Vista
          </p>
          <p style={{ fontSize: '10px', letterSpacing: '4px', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase' }}>
            Admin Panel
          </p>
          <div style={{ width: '40px', height: '1px', background: '#c9a84c', margin: '16px auto 0' }} />
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.2)', backdropFilter: 'blur(20px)', padding: '40px 36px' }}>
          <h1 style={{ fontSize: '20px', color: '#f0d080', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '12px', color: 'rgba(232,220,200,0.4)', marginBottom: '28px', letterSpacing: '0.5px' }}>
            Sign in to manage your restaurant
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.45)', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@bellavista.pk"
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.22)', color: '#e8dcc8', fontSize: '14px', outline: 'none', fontFamily: 'Lato, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#c9a84c')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.22)')}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.45)', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.22)', color: '#e8dcc8', fontSize: '14px', outline: 'none', fontFamily: 'Lato, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#c9a84c')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.22)')}
              />
            </div>

            {error && (
              <div style={{ marginBottom: '18px', padding: '10px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontSize: '12px', lineHeight: 1.6 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '14px', background: loading ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0c0c0c', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Lato, sans-serif', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {loading ? (
                <>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(12,12,12,0.3)', borderTopColor: '#0c0c0c', borderRadius: '50%', animation: 'spin-ring 0.85s linear infinite', display: 'inline-block' }} />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'rgba(232,220,200,0.2)', letterSpacing: '1px' }}>
          Bella Vista Admin — Restricted Access
        </p>
      </div>
    </div>
  );
}
