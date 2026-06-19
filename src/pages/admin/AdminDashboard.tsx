import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Stats { reservations: number; pending: number; menuItems: number; gallery: number; messages: number; }

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats>({ reservations: 0, pending: 0, menuItems: 0, gallery: 0, messages: 0 });
  const [recent,  setRecent]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    const today = new Date().toISOString().split('T')[0];
    Promise.all([
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('menu_items').select('*', { count: 'exact', head: true }),
      supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(6),
    ]).then(([res, pend, menu, gal, msgs, rec]) => {
      setStats({ reservations: res.count ?? 0, pending: pend.count ?? 0, menuItems: menu.count ?? 0, gallery: gal.count ?? 0, messages: msgs.count ?? 0 });
      setRecent(rec.data ?? []);
      setLoading(false);
    });
  }, []);

  const STATUS_COLORS: Record<string, string> = {
    pending: '#60a5fa', confirmed: '#4ade80', cancelled: '#ff8080', completed: '#c9a84c',
  };

  const StatCard = (label: string, val: number | string, sub: string, href: string, color: string, badge?: number) => (
    <Link to={href} style={{ textDecoration: 'none' }}>
      <div style={{ background: '#161616', border: `1px solid ${color}22`, padding: '22px', position: 'relative', transition: 'all 0.3s', cursor: 'pointer' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.background = `${color}08`; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}22`; (e.currentTarget as HTMLElement).style.background = '#161616'; }}>
        {badge != null && badge > 0 && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: color, color: '#0c0c0c', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
            {badge > 99 ? '99+' : badge}
          </div>
        )}
        <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '10px' }}>{label}</p>
        <p style={{ fontSize: '34px', fontFamily: 'Cormorant Garamond, serif', color, lineHeight: 1, marginBottom: '6px' }}>{loading ? '—' : val}</p>
        <p style={{ fontSize: '11px', color: 'rgba(232,220,200,0.3)' }}>{sub}</p>
      </div>
    </Link>
  );

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#f0d080' }}>Dashboard</h1>
        <p style={{ fontSize: '13px', color: 'rgba(232,220,200,0.4)', marginTop: '4px' }}>
          {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {!supabase && (
        <div style={{ padding: '16px 20px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', marginBottom: '24px', fontSize: '13px', color: 'rgba(232,220,200,0.7)', lineHeight: 1.7 }}>
          <strong style={{ color: '#c9a84c' }}>Supabase not connected.</strong> Create a <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px' }}>.env</code> file from <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px' }}>.env.example</code> and add your Supabase credentials to enable live data.
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginBottom: '28px' }}>
        {StatCard('Total Reservations', stats.reservations, 'All time bookings',    '/admin/reservations', '#c9a84c', stats.pending)}
        {StatCard('Pending Approval',   stats.pending,      'Awaiting confirmation','/admin/reservations', '#60a5fa')}
        {StatCard('Menu Items',          stats.menuItems,    'Active dishes & drinks','/admin/menu',         '#4ade80')}
        {StatCard('Gallery Images',      stats.gallery,      'Active photos',        '/admin/gallery',       '#f472b6')}
        {StatCard('Unread Messages',     stats.messages,     'Contact enquiries',    '/admin/contacts',      '#fb923c', stats.messages)}
      </div>

      {/* Recent reservations */}
      <div style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.12)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '14px', color: '#e8dcc8', letterSpacing: '0.5px' }}>Recent Reservations</h2>
          <Link to="/admin/reservations" style={{ fontSize: '11px', color: '#c9a84c', letterSpacing: '1px', textDecoration: 'none' }}>View All →</Link>
        </div>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(232,220,200,0.3)', fontSize: '13px' }}>Loading…</div>
        ) : recent.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(232,220,200,0.3)', fontSize: '13px' }}>
            {!supabase ? 'Connect Supabase to see live reservations.' : 'No reservations yet.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.05)' }}>
                  {['Code','Guest','Phone','Date','Time','Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', fontWeight: 400, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '12px 14px', color: '#c9a84c', fontWeight: 700 }}>#{r.confirmation_code}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <p style={{ color: '#e8dcc8' }}>{r.name}</p>
                      <p style={{ color: 'rgba(232,220,200,0.35)', fontSize: '11px' }}>{r.email}</p>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'rgba(232,220,200,0.6)', whiteSpace: 'nowrap' }}>{r.phone || '—'}</td>
                    <td style={{ padding: '12px 14px', color: 'rgba(232,220,200,0.6)', whiteSpace: 'nowrap' }}>{r.date}</td>
                    <td style={{ padding: '12px 14px', color: 'rgba(232,220,200,0.6)' }}>{r.time}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 8px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', background: `${STATUS_COLORS[r.status] ?? '#888'}18`, color: STATUS_COLORS[r.status] ?? '#888', border: `1px solid ${STATUS_COLORS[r.status] ?? '#888'}40` }}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px', marginTop: '20px' }}>
        {[
          { href: '/admin/menu',         label: '+ Add Menu Item',      color: '#4ade80' },
          { href: '/admin/gallery',      label: '+ Add Gallery Image',  color: '#f472b6' },
          { href: '/admin/testimonials', label: '+ Add Review',         color: '#fb923c' },
          { href: '/admin/categories',   label: 'Manage Categories',    color: '#c9a84c' },
        ].map(({ href, label, color }) => (
          <Link key={href} to={href}
            style={{ display: 'block', padding: '12px 16px', background: '#161616', border: `1px solid ${color}22`, color, fontSize: '12px', letterSpacing: '1px', textDecoration: 'none', transition: 'all 0.2s', textAlign: 'center' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}10`; (e.currentTarget as HTMLElement).style.borderColor = color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#161616'; (e.currentTarget as HTMLElement).style.borderColor = `${color}22`; }}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
