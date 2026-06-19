import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Res { id:string; confirmation_code:string; date:string; time:string; guests:string; seating:string; occasion:string; special_requests:string; name:string; phone:string; email:string; source:string; status:string; created_at:string; }

const STATUS_COLORS: Record<string,{bg:string;color:string;border:string}> = {
  pending:   {bg:'rgba(96,165,250,0.1)',  color:'#60a5fa', border:'rgba(96,165,250,0.3)'},
  confirmed: {bg:'rgba(74,222,128,0.1)',  color:'#4ade80', border:'rgba(74,222,128,0.3)'},
  cancelled: {bg:'rgba(255,80,80,0.1)',   color:'#ff8080', border:'rgba(255,80,80,0.3)'},
  completed: {bg:'rgba(201,168,76,0.1)',  color:'#c9a84c', border:'rgba(201,168,76,0.3)'},
};

export default function AdminReservations() {
  const [items,    setItems]    = useState<Res[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [selected, setSelected] = useState<Res|null>(null);

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('reservations').select('*').order('created_at',{ascending:false});
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from('reservations').update({ status }).eq('id', id);
    setItems(p => p.map(r => r.id===id ? {...r,status} : r));
    if (selected?.id===id) setSelected(p => p ? {...p,status} : null);
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete reservation?')) return;
    await supabase.from('reservations').delete().eq('id', id);
    setItems(p => p.filter(r => r.id!==id));
    if (selected?.id===id) setSelected(null);
  };

  const filtered = items.filter(r => {
    const q = search.toLowerCase();
    const ms = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.confirmation_code.includes(q) || (r.phone||'').includes(q);
    const mf = filter==='all' || r.status===filter || (filter==='today' && r.date===new Date().toISOString().split('T')[0]);
    return ms && mf;
  });

  const pending = items.filter(r=>r.status==='pending').length;
  const inp: React.CSSProperties = {padding:'9px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(201,168,76,0.2)',color:'#e8dcc8',fontSize:'13px',outline:'none',fontFamily:'Lato,sans-serif',transition:'border-color 0.2s'};

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'32px',fontWeight:300,color:'#f0d080'}}>
          Reservations
          {pending>0 && <span style={{marginLeft:'12px',fontSize:'14px',padding:'3px 10px',background:'rgba(96,165,250,0.15)',color:'#60a5fa',border:'1px solid rgba(96,165,250,0.35)',borderRadius:'20px'}}>
            {pending} pending
          </span>}
        </h1>
        <p style={{fontSize:'13px',color:'rgba(232,220,200,0.4)',marginTop:'4px'}}>{items.length} total bookings</p>
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:'10px',marginBottom:'18px',flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, code, phone…"
          style={{...inp,flex:1,minWidth:'200px'}}/>
        {['all','today','pending','confirmed','cancelled','completed'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:'9px 14px',fontSize:'11px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Lato,sans-serif',transition:'all 0.2s',background:filter===f?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.04)',color:filter===f?'#c9a84c':'rgba(232,220,200,0.5)',border:filter===f?'1px solid rgba(201,168,76,0.4)':'1px solid rgba(201,168,76,0.15)'}}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{background:'#161616',border:'1px solid rgba(201,168,76,0.12)',overflow:'hidden'}}>
        {loading ? (
          <div style={{padding:'40px',textAlign:'center',color:'rgba(232,220,200,0.3)'}}>Loading…</div>
        ) : !supabase ? (
          <div style={{padding:'40px',textAlign:'center',color:'rgba(232,220,200,0.4)',fontSize:'13px'}}>Supabase not configured.</div>
        ) : filtered.length===0 ? (
          <div style={{padding:'40px',textAlign:'center',color:'rgba(232,220,200,0.3)'}}>No reservations found.</div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
              <thead>
                <tr style={{background:'rgba(201,168,76,0.05)'}}>
                  {['Code','Guest','Phone','Date','Time','Guests','Status','Actions'].map(h=>(
                    <th key={h} style={{padding:'11px 14px',textAlign:'left',fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase',color:'rgba(232,220,200,0.4)',fontWeight:400,whiteSpace:'nowrap'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r,i)=>{
                  const sc = STATUS_COLORS[r.status] ?? STATUS_COLORS['pending'];
                  return (
                    <tr key={r.id} style={{borderTop:'1px solid rgba(255,255,255,0.04)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)',cursor:'pointer'}}
                      onClick={()=>setSelected(r)}>
                      <td style={{padding:'12px 14px',color:'#c9a84c',fontWeight:700}}>#{r.confirmation_code}</td>
                      <td style={{padding:'12px 14px'}}>
                        <p style={{color:'#e8dcc8'}}>{r.name}</p>
                        <p style={{color:'rgba(232,220,200,0.4)',fontSize:'11px'}}>{r.email}</p>
                      </td>
                      <td style={{padding:'12px 14px',color:'rgba(232,220,200,0.65)',whiteSpace:'nowrap'}}>{r.phone||'—'}</td>
                      <td style={{padding:'12px 14px',color:'rgba(232,220,200,0.65)',whiteSpace:'nowrap'}}>{r.date}</td>
                      <td style={{padding:'12px 14px',color:'rgba(232,220,200,0.65)'}}>{r.time}</td>
                      <td style={{padding:'12px 14px',color:'rgba(232,220,200,0.65)'}}>{r.guests}</td>
                      <td style={{padding:'12px 14px'}}>
                        <span style={{padding:'3px 8px',fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`}}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{padding:'12px 14px'}} onClick={e=>e.stopPropagation()}>
                        <div style={{display:'flex',gap:'6px'}}>
                          <select value={r.status} onChange={e=>updateStatus(r.id,e.target.value)}
                            style={{...inp,padding:'5px 8px',fontSize:'11px'}}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button onClick={()=>del(r.id)}
                            style={{padding:'5px 10px',background:'rgba(255,80,80,0.1)',border:'1px solid rgba(255,80,80,0.25)',color:'#ff8080',fontSize:'11px',cursor:'pointer'}}>
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}
          onClick={()=>setSelected(null)}>
          <div style={{background:'#161616',border:'1px solid rgba(201,168,76,0.25)',width:'100%',maxWidth:'520px',maxHeight:'90vh',overflowY:'auto'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{padding:'20px 24px',borderBottom:'1px solid rgba(201,168,76,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',color:'#f0d080',fontWeight:300}}>Reservation Detail</h2>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'rgba(232,220,200,0.5)',fontSize:'20px',cursor:'pointer'}}>×</button>
            </div>
            <div style={{padding:'24px'}}>
              {[
                ['Confirmation', `#${selected.confirmation_code}`],
                ['Status',       selected.status.toUpperCase()],
                ['Guest Name',   selected.name],
                ['Phone',        selected.phone||'—'],
                ['Email',        selected.email],
                ['Date',         selected.date],
                ['Time',         selected.time],
                ['Party Size',   selected.guests],
                ['Seating',      selected.seating||'—'],
                ['Occasion',     selected.occasion||'—'],
                ['Source',       selected.source||'—'],
                ['Booked At',    new Date(selected.created_at).toLocaleString('en-PK')],
              ].map(([label,val])=>(
                <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <span style={{fontSize:'11px',letterSpacing:'1px',textTransform:'uppercase',color:'rgba(232,220,200,0.4)'}}>{label}</span>
                  <span style={{fontSize:'13px',color:label==='Status'?STATUS_COLORS[selected.status.toLowerCase()]?.color||'#e8dcc8':'#e8dcc8',textAlign:'right',maxWidth:'60%'}}>{val}</span>
                </div>
              ))}
              {selected.special_requests&&(
                <div style={{marginTop:'16px',padding:'14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,168,76,0.1)'}}>
                  <p style={{fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:'rgba(232,220,200,0.38)',marginBottom:'8px'}}>Special Requests</p>
                  <p style={{fontSize:'13px',color:'rgba(232,220,200,0.7)',lineHeight:1.7}}>{selected.special_requests}</p>
                </div>
              )}
              <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
                <select value={selected.status} onChange={e=>updateStatus(selected.id,e.target.value)}
                  style={{...inp,flex:1,padding:'10px 12px'}}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <a href={`tel:${selected.phone}`} style={{padding:'10px 18px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',fontFamily:'Lato,sans-serif',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,textDecoration:'none',display:'flex',alignItems:'center'}}>
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
