import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useSettings } from '../../contexts/SettingsContext';

const FIELDS = [
  { key:'restaurant_name', label:'Restaurant Name',   ph:'Bella Vista'                        },
  { key:'tagline',         label:'Tagline',            ph:'An Experience for All Your Senses.' },
  { key:'address',         label:'Address',            ph:'Blue Area, Islamabad, Pakistan'     },
  { key:'phone',           label:'Phone',              ph:'+92 51 234 5678'                    },
  { key:'whatsapp',        label:'WhatsApp Number',    ph:'+923001234567'                      },
  { key:'email',           label:'Email',              ph:'reservations@bellavista.pk'         },
  { key:'hours_mon_thu',   label:'Hours Mon–Thu',      ph:'12:00 PM — 10:00 PM'               },
  { key:'hours_fri_sat',   label:'Hours Fri–Sat',      ph:'12:00 PM — 11:30 PM'               },
  { key:'hours_sun',       label:'Hours Sunday',       ph:'1:00 PM — 10:00 PM'                },
  { key:'instagram_url',   label:'Instagram URL',      ph:'https://instagram.com/bellavista'   },
  { key:'facebook_url',    label:'Facebook URL',       ph:'https://facebook.com/bellavista'    },
  { key:'x_url',           label:'X (Twitter) URL',   ph:'https://x.com/bellavista'           },
];

const MAP_FIELDS = [
  { key:'map_label', label:'Map Location Label', ph:'Blue Area, Islamabad' },
  { key:'map_lat',   label:'Latitude',           ph:'33.7215'              },
  { key:'map_lng',   label:'Longitude',          ph:'73.0433'              },
];

export default function AdminSettings() {
  const { refreshSettings } = useSettings();
  const [values,  setValues]  = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [msg,     setMsg]     = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.from('settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string,string> = {};
        data.forEach((r: { key:string; value:string }) => { map[r.key] = r.value; });
        setValues(map);
      }
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!supabase) { setMsg('Supabase not configured.'); return; }
    setSaving(true); setMsg('');
    const upserts = Object.entries(values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' });
    setSaving(false);
    if (error) { setMsg(error.message); return; }
    await refreshSettings();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inp: React.CSSProperties = {
    width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(201,168,76,0.2)', color:'#e8dcc8', fontSize:'13px',
    outline:'none', fontFamily:'Lato,sans-serif', boxSizing:'border-box', transition:'border-color 0.2s',
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = '#c9a84c');
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)');

  return (
    <div>
      <div style={{ marginBottom:'28px' }}>
        <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'32px', fontWeight:300, color:'#f0d080' }}>Settings</h1>
        <p style={{ fontSize:'13px', color:'rgba(232,220,200,0.4)', marginTop:'4px' }}>
          Jo bhi change karo, Save karte hi pori website pe live update ho jata hai
        </p>
      </div>

      {!supabase ? (
        <div style={{ padding:'32px', background:'#161616', border:'1px solid rgba(201,168,76,0.12)', color:'rgba(232,220,200,0.5)', fontSize:'14px' }}>
          Supabase connected nahi hai. .env file mein credentials add karo.
        </div>
      ) : loading ? (
        <div style={{ padding:'40px', textAlign:'center', color:'rgba(232,220,200,0.3)' }}>Loading…</div>
      ) : (
        <div style={{ display:'grid', gap:'24px' }}>

          {/* Restaurant Info */}
          <div style={{ background:'#161616', border:'1px solid rgba(201,168,76,0.12)', padding:'28px' }}>
            <h2 style={{ fontSize:'16px', color:'#e8dcc8', marginBottom:'20px' }}>Restaurant Information</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'16px' }}>
              {FIELDS.map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(232,220,200,0.45)', marginBottom:'7px' }}>{label}</label>
                  <input type="text" placeholder={ph} value={values[key] ?? ''} style={inp} onFocus={onFocus} onBlur={onBlur}
                    onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Map Settings */}
          <div style={{ background:'#161616', border:'1px solid rgba(201,168,76,0.12)', padding:'28px' }}>
            <h2 style={{ fontSize:'16px', color:'#e8dcc8', marginBottom:'6px' }}>Map & Location</h2>
            <p style={{ fontSize:'12px', color:'rgba(232,220,200,0.38)', marginBottom:'20px', lineHeight:1.7 }}>
              Google Maps → location search → right click → "What's here?" → coordinates copy karo
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'16px', marginBottom:'20px' }}>
              {MAP_FIELDS.map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(232,220,200,0.45)', marginBottom:'7px' }}>{label}</label>
                  <input type="text" placeholder={ph} value={values[key] ?? ''} style={inp} onFocus={onFocus} onBlur={onBlur}
                    onChange={e => setValues(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ height:'120px', background:'linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px),#141414', backgroundSize:'40px 40px', position:'relative', border:'1px solid rgba(201,168,76,0.15)' }}>
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-100%)' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'rgba(201,168,76,0.2)', border:'2px solid #c9a84c', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px' }}>📍</div>
              </div>
              <div style={{ position:'absolute', bottom:'8px', left:'8px', right:'8px', textAlign:'center', background:'rgba(12,12,12,0.85)', padding:'5px', fontSize:'11px', color:'#c9a84c', border:'1px solid rgba(201,168,76,0.2)' }}>
                {values['map_label'] || 'Location Label'} — {values['map_lat'] || 'Lat'}, {values['map_lng'] || 'Lng'}
              </div>
            </div>
          </div>

          {msg  && <div style={{ padding:'10px 14px', background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.25)', color:'#ff8080', fontSize:'12px' }}>{msg}</div>}
          {saved && <div style={{ padding:'10px 14px', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.25)', color:'#4ade80', fontSize:'12px' }}>✓ Settings saved! Pori website pe update ho gaya.</div>}

          <button onClick={save} disabled={saving}
            style={{ padding:'14px 36px', background:saving?'rgba(201,168,76,0.4)':'linear-gradient(135deg,#c9a84c,#f0d080)', color:'#0c0c0c', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:700, border:'none', cursor:saving?'not-allowed':'pointer', fontFamily:'Lato,sans-serif', width:'fit-content' }}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>

          <div style={{ padding:'20px', background:'#161616', border:'1px solid rgba(201,168,76,0.12)' }}>
            <h2 style={{ fontSize:'14px', color:'#e8dcc8', marginBottom:'8px' }}>Admin Password Change</h2>
            <p style={{ fontSize:'12px', color:'rgba(232,220,200,0.4)', lineHeight:1.8 }}>
              Supabase Dashboard → Authentication → Users → apna email → Edit → Password change karo.
            </p>
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-block', marginTop:'10px', fontSize:'11px', color:'#c9a84c', letterSpacing:'1px', textDecoration:'none' }}>
              Open Supabase Dashboard →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
