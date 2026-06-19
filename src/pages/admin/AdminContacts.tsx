import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Msg { id:string; name:string; email:string; subject:string; message:string; is_read:boolean; created_at:string; }

export default function AdminContacts() {
  const [items,   setItems]   = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected,setSelected]= useState<Msg|null>(null);

  const load = async () => {
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase.from('contact_messages').select('*').order('created_at',{ascending:false});
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    if (!supabase) return;
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    setItems(p => p.map(m => m.id===id ? {...m,is_read:true} : m));
    if (selected?.id===id) setSelected(p => p ? {...p,is_read:true} : null);
  };

  const del = async (id: string) => {
    if (!supabase || !confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    setItems(p => p.filter(m => m.id!==id));
    if (selected?.id===id) setSelected(null);
  };

  const unread = items.filter(m => !m.is_read).length;

  return (
    <div>
      <div style={{marginBottom:'24px'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'32px',fontWeight:300,color:'#f0d080'}}>
          Contact Messages
          {unread > 0 && <span style={{marginLeft:'12px',fontSize:'14px',padding:'3px 10px',background:'rgba(201,168,76,0.2)',color:'#c9a84c',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'20px'}}>
            {unread} new
          </span>}
        </h1>
        <p style={{fontSize:'13px',color:'rgba(232,220,200,0.4)',marginTop:'4px'}}>{items.length} total messages</p>
      </div>

      {!supabase ? (
        <div style={{padding:'32px',background:'#161616',border:'1px solid rgba(201,168,76,0.12)',color:'rgba(232,220,200,0.4)',fontSize:'13px'}}>
          Connect Supabase to view contact messages. Also run schema_update.sql to create the contact_messages table.
        </div>
      ) : loading ? (
        <div style={{padding:'40px',textAlign:'center',color:'rgba(232,220,200,0.3)'}}>Loading…</div>
      ) : items.length===0 ? (
        <div style={{padding:'40px',textAlign:'center',background:'#161616',border:'1px solid rgba(201,168,76,0.12)',color:'rgba(232,220,200,0.3)'}}>No messages yet.</div>
      ) : (
        <div style={{display:'grid',gap:'8px'}}>
          {items.map(msg=>(
            <div key={msg.id}
              style={{background:'#161616',border:`1px solid ${msg.is_read?'rgba(201,168,76,0.1)':'rgba(201,168,76,0.3)'}`,padding:'16px 18px',cursor:'pointer',transition:'all 0.2s'}}
              onClick={()=>{setSelected(msg);if(!msg.is_read)markRead(msg.id);}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px'}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                    {!msg.is_read && <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#c9a84c',flexShrink:0}}/>}
                    <p style={{fontSize:'14px',color:'#e8dcc8',fontWeight:msg.is_read?400:600}}>{msg.name}</p>
                    <p style={{fontSize:'12px',color:'rgba(232,220,200,0.4)'}}>{msg.email}</p>
                  </div>
                  {msg.subject && <p style={{fontSize:'12px',color:'rgba(232,220,200,0.6)',marginTop:'3px'}}>{msg.subject}</p>}
                  <p style={{fontSize:'12px',color:'rgba(232,220,200,0.4)',marginTop:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                    {msg.message}
                  </p>
                </div>
                <div style={{display:'flex',gap:'8px',alignItems:'center',flexShrink:0}}>
                  <span style={{fontSize:'11px',color:'rgba(232,220,200,0.3)',whiteSpace:'nowrap'}}>
                    {new Date(msg.created_at).toLocaleDateString('en-PK',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}
                  </span>
                  <button onClick={e=>{e.stopPropagation();del(msg.id);}}
                    style={{padding:'4px 8px',background:'rgba(255,80,80,0.08)',border:'1px solid rgba(255,80,80,0.2)',color:'#ff8080',fontSize:'10px',cursor:'pointer'}}>
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}
          onClick={()=>setSelected(null)}>
          <div style={{background:'#161616',border:'1px solid rgba(201,168,76,0.25)',width:'100%',maxWidth:'540px',maxHeight:'90vh',overflowY:'auto'}}
            onClick={e=>e.stopPropagation()}>
            <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(201,168,76,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',color:'#f0d080',fontWeight:300}}>Message</h2>
              <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'rgba(232,220,200,0.5)',fontSize:'20px',cursor:'pointer'}}>×</button>
            </div>
            <div style={{padding:'22px'}}>
              {[
                ['From',    selected.name],
                ['Email',   selected.email],
                ['Subject', selected.subject||'—'],
                ['Date',    new Date(selected.created_at).toLocaleString('en-PK')],
              ].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <span style={{fontSize:'11px',letterSpacing:'1px',textTransform:'uppercase',color:'rgba(232,220,200,0.38)'}}>{l}</span>
                  <span style={{fontSize:'13px',color:'#e8dcc8',textAlign:'right',maxWidth:'65%'}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:'16px',padding:'16px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,168,76,0.1)'}}>
                <p style={{fontSize:'11px',letterSpacing:'1px',textTransform:'uppercase',color:'rgba(232,220,200,0.38)',marginBottom:'10px'}}>Message</p>
                <p style={{fontSize:'13px',color:'rgba(232,220,200,0.75)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject||'Your enquiry')}`}
                style={{display:'block',marginTop:'16px',width:'100%',padding:'12px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',textAlign:'center',fontFamily:'Lato,sans-serif',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,textDecoration:'none',boxSizing:'border-box'}}>
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
