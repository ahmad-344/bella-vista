import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

type Category = 'Antipasti'|'Pasta'|'Pizza'|'Mains'|'Desserts'|'Drinks';
const CATEGORIES: Category[] = ['Antipasti','Pasta','Pizza','Mains','Desserts','Drinks'];
const DIETARY_OPTIONS = ['vegan','gluten-free','spicy'];

interface Item { id: string; name: string; description: string; price: number; category: string; dietary: string[]; is_signature: boolean; is_available: boolean; image_name: string; sort_order: number; }

const blank = (): Omit<Item,'id'> => ({ name:'', description:'', price:0, category:'Antipasti', dietary:[], is_signature:false, is_available:true, image_name:'', sort_order:0 });

export default function AdminMenu() {
  const [items,    setItems]    = useState<Item[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [activeTab, setTab]     = useState<Category>('Antipasti');
  const [modal,    setModal]    = useState<{ mode: 'add'|'edit'; item: Partial<Item> } | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('menu_items').select('*').order('category').order('sort_order');
    setItems(data ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!supabase || !modal) return;
    setSaving(true);
    const d = modal.item;
    if (!d.name || !d.price || !d.category) { setMsg('Name, price aur category zaroori hain.'); setSaving(false); return; }
    if (modal.mode === 'add') {
      const { error } = await supabase.from('menu_items').insert({ name: d.name, description: d.description, price: Number(d.price), category: d.category, dietary: d.dietary ?? [], is_signature: d.is_signature ?? false, is_available: d.is_available ?? true, image_name: d.image_name ?? '', sort_order: d.sort_order ?? 0 });
      if (error) { setMsg(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from('menu_items').update({ name: d.name, description: d.description, price: Number(d.price), category: d.category, dietary: d.dietary, is_signature: d.is_signature, is_available: d.is_available, image_name: d.image_name, sort_order: d.sort_order }).eq('id', d.id!);
      if (error) { setMsg(error.message); setSaving(false); return; }
    }
    await load(); setModal(null); setMsg(''); setSaving(false);
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    setItems(p => p.filter(i => i.id !== id));
  };

  const toggle = async (id: string, field: 'is_available'|'is_signature', val: boolean) => {
    if (!supabase) return;
    await supabase.from('menu_items').update({ [field]: val }).eq('id', id);
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const filtered = items.filter(i => i.category === activeTab);
  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.2)', color: '#e8dcc8', fontSize: '13px', outline: 'none', fontFamily: 'Lato, sans-serif', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, color: '#f0d080' }}>Menu Management</h1>
          <p style={{ fontSize: '13px', color: 'rgba(232,220,200,0.4)', marginTop: '4px' }}>{items.length} items</p>
        </div>
        <button onClick={() => setModal({ mode: 'add', item: blank() })} disabled={!supabase}
          style={{ padding: '11px 22px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0c0c0c', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: supabase ? 'pointer' : 'not-allowed', fontFamily: 'Lato, sans-serif', opacity: supabase ? 1 : 0.5 }}>
          + Add Item
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', marginBottom: '20px', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setTab(c)}
            style={{ padding: '10px 18px', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', background: 'none', fontFamily: 'Lato, sans-serif', transition: 'all 0.2s', color: activeTab === c ? '#c9a84c' : 'rgba(232,220,200,0.4)', borderBottom: activeTab === c ? '2px solid #c9a84c' : '2px solid transparent', border: 'none', borderBottomWidth: '2px', borderBottomStyle: 'solid' }}>
            {c} ({items.filter(i => i.category === c).length})
          </button>
        ))}
      </div>

      {/* Items */}
      <div style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.12)' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(232,220,200,0.3)' }}>Loading…</div>
        ) : !supabase ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(232,220,200,0.3)', fontSize: '13px' }}>Connect Supabase to manage menu.</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(232,220,200,0.3)', fontSize: '13px' }}>No items in {activeTab}.</div>
        ) : (
          filtered.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <p style={{ fontSize: '14px', color: '#e8dcc8', fontFamily: 'Cormorant Garamond, serif' }}>{item.name}</p>
                  {item.is_signature && <span style={{ padding: '2px 6px', fontSize: '9px', letterSpacing: '1px', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.3)' }}>SIGNATURE</span>}
                  {!item.is_available && <span style={{ padding: '2px 6px', fontSize: '9px', letterSpacing: '1px', background: 'rgba(255,80,80,0.1)', color: '#ff8080', border: '1px solid rgba(255,80,80,0.3)' }}>UNAVAILABLE</span>}
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(232,220,200,0.4)', marginTop: '2px' }}>{item.description?.substring(0,70)}{item.description?.length > 70 ? '…' : ''}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontFamily: 'Cormorant Garamond, serif', color: '#c9a84c', whiteSpace: 'nowrap' }}>PKR {item.price.toLocaleString()}</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'rgba(232,220,200,0.5)' }}>
                  <input type="checkbox" checked={item.is_available} onChange={e => toggle(item.id, 'is_available', e.target.checked)} style={{ accentColor: '#c9a84c' }} />
                  Available
                </label>
                <button onClick={() => setModal({ mode: 'edit', item: { ...item } })}
                  style={{ padding: '6px 12px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '11px', cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => del(item.id)}
                  style={{ padding: '6px 12px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', color: '#ff8080', fontSize: '11px', cursor: 'pointer' }}>
                  Del
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setModal(null)}>
          <div style={{ background: '#161616', border: '1px solid rgba(201,168,76,0.25)', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', color: '#f0d080', fontWeight: 300 }}>{modal.mode === 'add' ? 'Add Item' : 'Edit Item'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(232,220,200,0.5)', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '22px' }}>
              {msg && <div style={{ marginBottom: '14px', padding: '10px', background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontSize: '12px' }}>{msg}</div>}
              <div style={{ display: 'grid', gap: '14px' }}>
                {[
                  { label: 'Dish Name *', key: 'name', type: 'text', placeholder: 'e.g. Truffle Tagliatelle' },
                  { label: 'Image Filename', key: 'image_name', type: 'text', placeholder: 'e.g. dish_p1.jpg' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={(modal.item as any)[key] ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, [key]: e.target.value } } : null)} style={inp} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Description</label>
                  <textarea placeholder="Dish description…" value={modal.item.description ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, description: e.target.value } } : null)} rows={3} style={{ ...inp, resize: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Price (PKR) *</label>
                    <input type="number" placeholder="0" value={modal.item.price ?? ''} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, price: Number(e.target.value) } } : null)} style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '6px' }}>Category *</label>
                    <select value={modal.item.category ?? 'Antipasti'} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, category: e.target.value } } : null)} style={inp}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(232,220,200,0.4)', marginBottom: '8px' }}>Dietary Tags</label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {DIETARY_OPTIONS.map(d => (
                      <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: 'rgba(232,220,200,0.6)' }}>
                        <input type="checkbox" checked={(modal.item.dietary ?? []).includes(d)} onChange={e => {
                          const cur = modal.item.dietary ?? [];
                          setModal(p => p ? { ...p, item: { ...p.item, dietary: e.target.checked ? [...cur, d] : cur.filter(x => x !== d) } } : null);
                        }} style={{ accentColor: '#c9a84c' }} />
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {[['is_signature','Chef\'s Signature'],['is_available','Available']].map(([key, label]) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'rgba(232,220,200,0.6)' }}>
                      <input type="checkbox" checked={(modal.item as any)[key] ?? false} onChange={e => setModal(p => p ? { ...p, item: { ...p.item, [key]: e.target.checked } } : null)} style={{ accentColor: '#c9a84c' }} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={save} disabled={saving}
                style={{ width: '100%', marginTop: '20px', padding: '13px', background: 'linear-gradient(135deg,#c9a84c,#f0d080)', color: '#0c0c0c', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Lato, sans-serif', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : modal.mode === 'add' ? 'Add to Menu' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
