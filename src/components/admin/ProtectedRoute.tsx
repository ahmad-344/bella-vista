import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(201,168,76,0.2)', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'spin-ring 0.85s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(232,220,200,0.4)', fontSize: '12px', letterSpacing: '2px' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
