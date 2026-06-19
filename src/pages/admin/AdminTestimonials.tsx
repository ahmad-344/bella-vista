import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface T { id: string; text: string; author: string; location: string; rating: number; is_active: boolean; }
const blank = (): Omit<T,'id'> => ({ text:'', author:'', location:'', rating:5, is_active:true });

export default function AdminTestimonials() {
  const [items,   setItems]   = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState<{ mode:'add'|'edit'; item: Partial<T> } | null>(null);
  const [saving,  setSaving]  = useState(false);

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!supabase || !modal) return;
    setSaving(true);
    const d = modal.item;
    if (!d.text || !d.author) { setSaving(false); return; }
    if (modal.mode === 'add') {
      await supabase.from('testimonials').insert({ text: d.text, author: d.author, location: d.location ?? '', rating: d.rating ?? 5, is_active: d.is_active ?? true });
    } else {
      await supabase.from('testimonials').update({ text: d.text, author: d.author, location: d.location, rating: d.rating, is_active: d.is_active }).eq('id', d.id!);
    }
    await load(); setModal(null); setSaving(false);
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setItems(p => p.filter(t => t.id !== id));
  };

  const toggleActive = async (id: string, val: boolean) => {
    if (!supabase) return;
    await supabase.from('testimonials').update({ is_active: val }).eq('id', id);
    setItems(p => p.map(t => t.id === id ? { ...t, is_active: val } : t));
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', color: '#e8dcc8', fontSize: '13px', outline: 'none', fontFamily: 'Lato, sans-serif', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#f0d080' }}>Testimonials</h1>
          <p style={{ fontSize: '13px', color: 'rgba(232,220,200,0.4)', marginTop: '4px' }}>{items.length} reviews</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', item: blank() })} disabled={!supabase}
          style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0c0c0c', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: supabase ? 'pointer' : 'not-allowed', fontFamily: 'Lato, sans-serif', opacity: supabase ? 1 : 0.5 }}>
          + Add Review
        </button>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(232,220,200,0.3)' }}>Loading…</div>
        ) : !supabase ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#161616', border: '1px solid rgba(201,168,76,0.1)', color: 'rgba(232,220,200,0.3)', fontSize: '13px' }}>Connect Supabase to manage testimonials.</div>
        ) : items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', background: '#161616', border: '1px solid rgba(201,168,76,0.1)', color: 'rgba(232,220,200,0.3)', fontSize: '13px' }}>No testimonials yet.</div>
        ) : items.map(t => (
          <div key={t.id} style={{ background: '#161616', border: `1px solid ${t.is_active ? 'rgba(201,168,76,0.12)' : 'rgba(255,80,80,0.12)'}`, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < t.rating ? '#c9a84c' : 'rgba(201,168,76,0.2)', fontSize: '14px' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(232,220,200,0.8)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '10px' }}>"{t.text}"</p>
                <p style={{ fontSize: '12px', color: '#c9a84c', fontWeight: 700 }}>{t.author}</p>
                <p style={{ fontSize: '11px', color: 'rgba(232,220,200,0.35)' }}>{t.location}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
                {!t.is_active && <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#ff8080', padding: '2px 8px', border: '1px solid rgba(255,80,80,0.3)', background: 'rgba(255,80,80,0.08)' }}>HIDDEN</span>}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '11px', color: 'rgba(232,220,200,0.45)' }}>
                    <input type="checkbox" checked={t.is_active} onChange={e => toggleActive(t.id, e.target.checked)} style={{ accentColor: '#c9a84c' }} /> Active
                  </label>
                  <button onClick={() => setModal({ mode: 'edit', item: { ...t } })}
                    style={{ padding: '5px 10px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => del(t.id)}
                    style={{ padding: '5px 10px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff8080', fontSize: '11px', cursor: 'pointer' }}>Del</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setModal(null)}>
          <div style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.25)', width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#f0d080', fontWeight: 300 }}>{modal.mode === 'add' ? 'Add Review' : 'Edit Review'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(232,220,200,0.5)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '22px', display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Review Text *</label>
                <textarea rows={4} placeholder="Guest ki review…" value={modal.item.text ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, text: e.target.value } } : null)} style={{ ...inp, resize: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Author *</label>
                  <input type="text" placeholder="e.g. Amna S." value={modal.item.author ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, author: e.target.value } } : null)} style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Location</label>
                  <input type="text" placeholder="e.g. Islamabad" value={modal.item.location ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, location: e.target.value } } : null)} style={inp} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '8px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setModal(p => p ? { ...p, item: { ...p.item, rating: n } } : null)}
                      style={{ width: '36px', height: '36px', fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', color: n <= (modal.item.rating ?? 5) ? '#c9a84c' : 'rgba(201,168,76,0.2)', transition: 'color 0.2s' }}>★</button>
                  ))}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'rgba(232,220,200,0.6)' }}>
                <input type="checkbox" checked={modal.item.is_active ?? true} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, is_active: e.target.checked } } : null)} style={{ accentColor: '#c9a84c' }} />
                Show on website
              </label>
              <button onClick={save} disabled={saving}
                style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0c0c0c', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Lato, sans-serif', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : modal.mode === 'add' ? 'Add Review' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
