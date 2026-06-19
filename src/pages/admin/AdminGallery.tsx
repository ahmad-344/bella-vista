import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface GItem { id: string; label: string; description: string; image_name: string; gradient: string; sort_order: number; is_active: boolean; }
const blank = (): Omit<GItem,'id'> => ({ label:'', description:'', image_name:'', gradient:'linear-gradient(135deg,#1a0a12,#2d1520)', sort_order:0, is_active:true });

export default function AdminGallery() {
  const [items,   setItems]   = useState<GItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState<{ mode:'add'|'edit'; item: Partial<GItem> } | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('gallery_items').select('*').order('sort_order');
    setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!supabase || !modal) return;
    setSaving(true); setMsg('');
    const d = modal.item;
    if (!d.label || !d.image_name) { setMsg('Label aur image filename zaroori hain.'); setSaving(false); return; }
    if (modal.mode === 'add') {
      await supabase.from('gallery_items').insert({ label: d.label, description: d.description ?? '', image_name: d.image_name, gradient: d.gradient ?? blank().gradient, sort_order: d.sort_order ?? 0, is_active: d.is_active ?? true });
    } else {
      await supabase.from('gallery_items').update({ label: d.label, description: d.description, image_name: d.image_name, gradient: d.gradient, sort_order: d.sort_order, is_active: d.is_active }).eq('id', d.id!);
    }
    await load(); setModal(null); setSaving(false);
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete gallery item?')) return;
    await supabase.from('gallery_items').delete().eq('id', id);
    setItems(p => p.filter(i => i.id !== id));
  };

  const toggleActive = async (id: string, val: boolean) => {
    if (!supabase) return;
    await supabase.from('gallery_items').update({ is_active: val }).eq('id', id);
    setItems(p => p.map(i => i.id === id ? { ...i, is_active: val } : i));
  };

  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', color: '#e8dcc8', fontSize: '13px', outline: 'none', fontFamily: 'Lato, sans-serif', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#f0d080' }}>Gallery</h1>
          <p style={{ fontSize: '13px', color: 'rgba(232,220,200,0.4)', marginTop: '4px' }}>{items.length} images</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', item: blank() })} disabled={!supabase}
          style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0c0c0c', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: supabase ? 'pointer' : 'not-allowed', fontFamily: 'Lato, sans-serif', opacity: supabase ? 1 : 0.5 }}>
          + Add Image
        </button>
      </div>

      {/* Image note */}
      <div style={{ padding: '14px 18px', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', marginBottom: '20px', fontSize: '12px', color: 'rgba(232,220,200,0.55)', lineHeight: 1.7 }}>
        <strong style={{ color: '#c9a84c' }}>Images:</strong> Apni images <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px' }}>public/images/</code> folder mein rakho. Filename wahi use karo jo yahan type karo.
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(232,220,200,0.3)' }}>Loading…</div>
      ) : !supabase ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(232,220,200,0.3)', fontSize: '13px' }}>Connect Supabase to manage gallery.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: '#161616', border: `1px solid ${item.is_active ? 'rgba(201,168,76,0.15)' : 'rgba(255,80,80,0.15)'}`, overflow: 'hidden' }}>
              {/* Gradient/image preview */}
              <div style={{ height: '160px', background: item.gradient, position: 'relative', overflow: 'hidden' }}>
                <img src={`/images/${item.image_name}`} alt={item.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                {!item.is_active && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#ff8080', textTransform: 'uppercase' }}>Hidden</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '14px' }}>
                <p style={{ fontSize: '14px', color: '#e8dcc8', marginBottom: '4px' }}>{item.label}</p>
                <p style={{ fontSize: '11px', color: 'rgba(232,220,200,0.4)', marginBottom: '2px' }}>{item.image_name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(232,220,200,0.35)', marginBottom: '12px', lineHeight: 1.5 }}>{item.description?.substring(0,60)}{item.description?.length > 60 ? '…' : ''}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'rgba(232,220,200,0.5)', flex: 1 }}>
                    <input type="checkbox" checked={item.is_active} onChange={e => toggleActive(item.id, e.target.checked)} style={{ accentColor: '#c9a84c' }} />
                    Active
                  </label>
                  <button onClick={() => setModal({ mode: 'edit', item: { ...item } })}
                    style={{ padding: '5px 10px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '11px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => del(item.id)}
                    style={{ padding: '5px 10px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff8080', fontSize: '11px', cursor: 'pointer' }}>
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setModal(null)}>
          <div style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.25)', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#f0d080', fontWeight: 300 }}>{modal.mode === 'add' ? 'Add Image' : 'Edit Image'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(232,220,200,0.5)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '22px' }}>
              {msg && <div style={{ marginBottom: '14px', padding: '10px', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontSize: '12px' }}>{msg}</div>}
              <div style={{ display: 'grid', gap: '14px' }}>
                {[
                  { label: 'Label *',          key: 'label',       placeholder: 'e.g. The Main Dining Hall' },
                  { label: 'Image Filename *', key: 'image_name',  placeholder: 'e.g. gallery_1.jpg' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>{label}</label>
                    <input type="text" placeholder={placeholder} value={(modal.item as any)[key] ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, [key]: e.target.value } } : null)} style={inp} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Description</label>
                  <textarea placeholder="Image description…" value={modal.item.description ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, description: e.target.value } } : null)} rows={2} style={{ ...inp, resize: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Sort Order</label>
                    <input type="number" value={modal.item.sort_order ?? 0} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, sort_order: Number(e.target.value) } } : null)} style={inp} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'rgba(232,220,200,0.6)' }}>
                      <input type="checkbox" checked={modal.item.is_active ?? true} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, is_active: e.target.checked } } : null)} style={{ accentColor: '#c9a84c' }} />
                      Show on website
                    </label>
                  </div>
                </div>
              </div>
              <button onClick={save} disabled={saving}
                style={{ width: '100%', marginTop: '20px', padding: '13px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0c0c0c', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Lato, sans-serif', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : modal.mode === 'add' ? 'Add Image' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
