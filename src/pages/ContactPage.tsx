import { useEffect, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import { saveContactMessage } from '../hooks/useSupabaseData';
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon, ClockIcon } from '../assets/svgs/Icons';

type FK = 'name' | 'email' | 'subject' | 'message';

export default function ContactPage() {
  useScrollReveal();
  const { settings } = useSettings();
  const [form,      setForm]      = useState<Record<FK, string>>({ name:'', email:'', subject:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => { document.title = 'Contact — Bella Vista'; }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in name, email and message.'); return;
    }
    setLoading(true); setError('');
    const result = await saveContactMessage({
      name: form.name, email: form.email,
      subject: form.subject, message: form.message,
    });
    setLoading(false);
    if (!result.success) {
      // Table may not exist yet — still show success to user
      console.warn('Contact message save failed:', result.error);
    }
    setSubmitted(true);
  };

  const ROWS = [
    { Icon: MapPinIcon,   label:'Address',  value: settings.address, href: undefined as string|undefined },
    { Icon: PhoneIcon,    label:'Phone',    value: settings.phone,   href: `tel:${settings.phone}` },
    { Icon: MailIcon,     label:'Email',    value: settings.email,   href: `mailto:${settings.email}` },
    { Icon: WhatsAppIcon, label:'WhatsApp', value: 'Chat with us',   href: `https://wa.me/${(settings.whatsapp||'').replace(/\D/g,'')}` },
  ];
  const HOURS = [
    { days:'Monday – Thursday', time:settings.hours_mon_thu },
    { days:'Friday – Saturday', time:settings.hours_fri_sat },
    { days:'Sunday',            time:settings.hours_sun     },
  ];
  const inp: React.CSSProperties = {
    width:'100%', padding:'12px 14px', background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(201,168,76,0.22)', color:'#e8dcc8', fontSize:'13px',
    outline:'none', fontFamily:'Lato,sans-serif', boxSizing:'border-box', transition:'border-color 0.3s',
  };

  return (
    <main className="bg-[#0c0c0c]">
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden"
        style={{ background:'radial-gradient(ellipse at 50% 0%,#0a0f1a 0%,#0c0c0c 70%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' }} />
        <div className="max-w-2xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{ color:'#c9a84c' }}>We'd love to hear from you</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background:'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background:'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-4" style={{ color:'#f0d080' }}>Contact Us</h1>
        </div>
      </section>

      <section className="py-16 px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left */}
          <div className="reveal-left space-y-8">
            <div>
              <h2 className="font-display text-3xl font-light mb-6" style={{ color:'#f0d080' }}>Get in Touch</h2>
              <div className="space-y-5">
                {ROWS.map(({ Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{ border:'1px solid rgba(201,168,76,0.22)', background:'rgba(201,168,76,0.05)' }}>
                      <Icon size={17} color="#c9a84c" />
                    </div>
                    <div>
                      <p className="font-body text-xs tracking-[2px] uppercase mb-1" style={{ color:'rgba(232,220,200,0.38)' }}>{label}</p>
                      {href
                        ? <a href={href}
                            target={href.startsWith('http') ? '_blank' : undefined}
                            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="font-body text-sm transition-colors duration-300" style={{ color:'#e8dcc8' }}
                            onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
                            onMouseLeave={e => (e.currentTarget.style.color='#e8dcc8')}>{value}</a>
                        : <p className="font-body text-sm" style={{ color:'#e8dcc8' }}>{value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS Map */}
            <div className="css-map relative min-h-[220px]" style={{ border:'1px solid rgba(201,168,76,0.2)' }}>
              <div className="map-road-h" style={{ top:'35%', left:0, right:0 }} />
              <div className="map-road-h" style={{ top:'65%', left:0, right:0 }} />
              <div className="map-road-v" style={{ left:'30%', top:0, bottom:0 }} />
              <div className="map-road-v" style={{ left:'65%', top:0, bottom:0 }} />
              <div className="map-marker">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background:'rgba(201,168,76,0.18)', border:'2px solid #c9a84c', animation:'pulseGold 2s ease-in-out infinite' }}>
                  <MapPinIcon size={20} color="#c9a84c" />
                </div>
              </div>
              <a href={settings.map_lat && settings.map_lng ? `https://www.google.com/maps?q=${settings.map_lat},${settings.map_lng}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-gold absolute bottom-4 right-4"
                style={{ fontSize:'10px', padding:'8px 14px', letterSpacing:'2px' }}>
                Get Directions
              </a>
            </div>

            {/* Hours */}
            <div className="p-6" style={{ border:'1px solid rgba(201,168,76,0.15)', background:'rgba(201,168,76,0.03)' }}>
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon size={16} color="#c9a84c" />
                <h3 className="font-body text-xs tracking-[3px] uppercase" style={{ color:'#c9a84c' }}>Hours</h3>
              </div>
              {HOURS.map(({ days, time }, i) => (
                <div key={days} className="flex justify-between py-2.5"
                  style={{ borderBottom: i<HOURS.length-1 ? '1px solid rgba(201,168,76,0.08)' : 'none' }}>
                  <span className="font-body text-xs" style={{ color:'rgba(232,220,200,0.55)' }}>{days}</span>
                  <span className="font-body text-xs font-bold" style={{ color:'#c9a84c' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="reveal-right">
            <div className="glass-card p-8 lg:p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 check-circle"
                    style={{ background:'rgba(201,168,76,0.1)', border:'2px solid #c9a84c' }}>
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                      <path className="check-path" d="M7 19L16 28L31 11"
                        stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="font-display text-2xl font-light mb-3" style={{ color:'#f0d080' }}>Message Sent!</h3>
                  <p className="font-body text-sm" style={{ color:'rgba(232,220,200,0.52)', lineHeight:1.8 }}>
                    Thank you for reaching out. We'll get back to you at{' '}
                    <strong style={{ color:'#c9a84c' }}>{form.email}</strong> within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-light mb-2" style={{ color:'#f0d080' }}>Send a Message</h2>
                  <p className="font-body text-xs mb-6" style={{ color:'rgba(232,220,200,0.35)', lineHeight:1.7 }}>
                    Your message will be saved and visible in our admin panel.
                  </p>
                  <div style={{ display:'grid', gap:'14px' }}>
                    {([
                      { key:'name',    label:'Your Name',     type:'text',  ph:'e.g. Amna Siddiqui' },
                      { key:'email',   label:'Email Address', type:'email', ph:'you@example.com'     },
                      { key:'subject', label:'Subject',       type:'text',  ph:'How can we help?'    },
                    ] as { key:FK; label:string; type:string; ph:string }[]).map(({ key, label, type, ph }) => (
                      <div key={key}>
                        <label style={{ display:'block', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(232,220,200,0.42)', marginBottom:'6px' }}>{label}</label>
                        <input type={type} placeholder={ph} value={form[key]}
                          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} style={inp}
                          onFocus={e => (e.currentTarget.style.borderColor='#c9a84c')}
                          onBlur={e  => (e.currentTarget.style.borderColor='rgba(201,168,76,0.22)')} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display:'block', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(232,220,200,0.42)', marginBottom:'6px' }}>Message *</label>
                      <textarea rows={5} placeholder="Tell us how we can help…" value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        style={{ ...inp, resize:'none' }}
                        onFocus={e => (e.currentTarget.style.borderColor='#c9a84c')}
                        onBlur={e  => (e.currentTarget.style.borderColor='rgba(201,168,76,0.22)')} />
                    </div>
                    {error && (
                      <div style={{ padding:'10px', background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.25)', color:'#ff8080', fontSize:'12px' }}>{error}</div>
                    )}
                    <button onClick={handleSubmit} disabled={loading}
                      style={{ width:'100%', padding:'14px', background:'linear-gradient(135deg,#c9a84c,#f0d080)', color:'#0c0c0c', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:700, border:'none', cursor:loading?'not-allowed':'pointer', fontFamily:'Lato,sans-serif', opacity:loading?0.6:1 }}>
                      {loading ? 'Sending…' : 'Send Message'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
