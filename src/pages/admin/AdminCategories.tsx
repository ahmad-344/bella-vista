import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Cat { id: string; name: string; sort_order: number; is_active: boolean; }

export default function AdminCategories() {
  const [items,   setItems]   = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!supabase || !newName.trim()) return;
    setSaving(true);
    const maxOrder = items.reduce((m, c) => Math.max(m, c.sort_order), 0);
    const { error } = await supabase.from('categories').insert({ name: newName.trim(), sort_order: maxOrder + 1 });
    if (error) { setMsg(error.message); setSaving(false); return; }
    setNewName(''); await load(); setSaving(false);
  };

  const del = async (id: string, name: string) => {
    if (!supabase || !confirm(`"${name}" category delete karo? Is category k saare menu items affected honge.`)) return;
    await supabase.from('categories').delete().eq('id', id);
    setItems(p => p.filter(c => c.id !== id));
  };

  const toggle = async (id: string, val: boolean) => {
    if (!supabase) return;
    await supabase.from('categories').update({ is_active: val }).eq('id', id);
    setItems(p => p.map(c => c.id === id ? { ...c, is_active: val } : c));
  };

  const updateOrder = async (id: string, order: number) => {
    if (!supabase) return;
    await supabase.from('categories').update({ sort_order: order }).eq('id', id);
    setItems(p => p.map(c => c.id === id ? { ...c, sort_order: order } : c).sort((a,b) => a.sort_order - b.sort_order));
  };

  const inp: React.CSSProperties = {padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,168,76,0.2)',color:'#e8dcc8',fontSize:'13px',outline:'none',fontFamily:'Lato,sans-serif'};

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'32px',fontWeight:300,color:'#f0d080'}}>Categories</h1>
        <p style={{fontSize:'13px',color:'rgba(232,220,200,0.4)',marginTop:'4px'}}>Menu categories manage karo — ye tabs menu page pe show honge</p>
      </div>

      {!supabase ? (
        <div style={{padding:'32px',background:'#161616',border:'1px solid rgba(201,168,76,0.12)',color:'rgba(232,220,200,0.4)',fontSize:'13px'}}>
          Connect Supabase to manage categories.
        </div>
      ) : (
        <>
          {/* Add new */}
          <div style={{background:'#161616',border:'1px solid rgba(201,168,76,0.12)',padding:'20px',marginBottom:'20px'}}>
            <h2 style={{fontSize:'14px',color:'#e8dcc8',marginBottom:'14px'}}>New Category Add Karo</h2>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <input type="text" placeholder="e.g. Specials, Salads, Soups…" value={newName}
                onChange={e=>setNewName(e.target.value)} style={{...inp,flex:1,minWidth:'200px'}}
                onKeyDown={e=>e.key==='Enter'&&add()}/>
              <button onClick={add} disabled={saving||!newName.trim()}
                style={{padding:'10px 24px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,border:'none',cursor:'pointer',fontFamily:'Lato,sans-serif',opacity:newName.trim()?1:0.5}}>
                {saving?'Adding…':'+ Add'}
              </button>
            </div>
            {msg && <p style={{marginTop:'10px',fontSize:'12px',color:'#ff8080'}}>{msg}</p>}
          </div>

          {/* List */}
          <div style={{background:'#161616',border:'1px solid rgba(201,168,76,0.12)',overflow:'hidden'}}>
            {loading ? (
              <div style={{padding:'40px',textAlign:'center',color:'rgba(232,220,200,0.3)'}}>Loading…</div>
            ) : items.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'rgba(232,220,200,0.3)'}}>Koi categories nahi hain.</div>
            ) : items.map((cat, i) => (
              <div key={cat.id} style={{display:'flex',alignItems:'center',gap:'16px',padding:'14px 18px',borderBottom:i<items.length-1?'1px solid rgba(255,255,255,0.04)':'none',flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:'150px'}}>
                  <span style={{fontSize:'15px',color:cat.is_active?'#e8dcc8':'rgba(232,220,200,0.35)',fontFamily:'Cormorant Garamond,serif'}}>{cat.name}</span>
                  {!cat.is_active && <span style={{marginLeft:'8px',fontSize:'10px',color:'rgba(255,80,80,0.6)',border:'1px solid rgba(255,80,80,0.2)',padding:'1px 6px',letterSpacing:'1px'}}>HIDDEN</span>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'12px',flexWrap:'wrap'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <label style={{fontSize:'11px',color:'rgba(232,220,200,0.4)'}}>Order:</label>
                    <input type="number" value={cat.sort_order} onChange={e=>updateOrder(cat.id,Number(e.target.value))}
                      style={{...inp,width:'60px',padding:'5px 8px',fontSize:'12px'}}/>
                  </div>
                  <label style={{display:'flex',alignItems:'center',gap:'6px',cursor:'pointer',fontSize:'11px',color:'rgba(232,220,200,0.5)'}}>
                    <input type="checkbox" checked={cat.is_active} onChange={e=>toggle(cat.id,e.target.checked)} style={{accentColor:'#c9a84c'}}/>
                    Visible
                  </label>
                  <button onClick={()=>del(cat.id,cat.name)}
                    style={{padding:'5px 10px',background:'rgba(255,80,80,0.08)',border:'1px solid rgba(255,80,80,0.2)',color:'#ff8080',fontSize:'11px',cursor:'pointer'}}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p style={{marginTop:'12px',fontSize:'11px',color:'rgba(232,220,200,0.3)',lineHeight:1.7}}>
            Note: Category delete karne se wo menu pe nazar nahi aayegi, lekin us category ke existing menu items delete nahi honge.
          </p>
        </>
      )}
    </div>
  );
}
