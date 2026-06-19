import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import ReservationForm, { BookedReservation } from '../components/sections/ReservationForm';
import { cancelReservationInSupabase } from '../hooks/useSupabaseData';
import { ClockIcon, PhoneIcon, CalendarIcon } from '../assets/svgs/Icons';

const WHY_DINE = [
  'Award-winning Italian cuisine crafted with seasonal ingredients sourced daily.',
  'Impeccable, warm hospitality in an intimate and elegantly designed space.',
  'Curated wine list of 200+ Italian labels with expert sommelier pairing.',
];

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function isWithin24h(date: string, time: string): boolean {
  const [tp, ap] = time.split(' ');
  const [hh, mm] = tp.split(':');
  let h = parseInt(hh);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  const d = new Date(date + 'T00:00:00'); d.setHours(h, parseInt(mm), 0, 0);
  return (d.getTime() - Date.now()) < 24 * 60 * 60 * 1000;
}
function buildSlots(): string[] {
  const s: string[] = [];
  for (let h = 12; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break;
      const d = h > 12 ? h - 12 : 12;
      s.push(`${d}:${m === 0 ? '00' : '30'} ${h < 12 ? 'AM' : 'PM'}`);
    }
  }
  return s;
}
const ALL_SLOTS = buildSlots();

function downloadPDF(r: BookedReservation) {
  const win = window.open('', '_blank');
  if (!win) return;
  const dateLabel = new Date(r.date+'T12:00:00').toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  win.document.write(`<!DOCTYPE html><html><head><title>Reservation #${r.code}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:60px;color:#1a1a1a}
  .logo{font-size:40px;color:#c9a84c}.sub{font-size:11px;letter-spacing:4px;color:#888;text-transform:uppercase;margin-bottom:36px}
  .code{font-size:28px;color:#c9a84c;font-weight:bold;margin-bottom:32px}
  .row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f0f0f0}
  .lbl{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#888}.val{font-size:14px}
  .foot{margin-top:48px;font-size:11px;color:#999;text-align:center;line-height:1.8}</style></head>
  <body><div class="logo">Bella Vista</div><div class="sub">Ristorante Italiano · Islamabad</div>
  <div class="code">Reservation #${r.code}</div>
  ${[['Guest',r.name],['Phone',r.phone],['Email',r.email],['Table for',r.guests],['Date',dateLabel],['Time',r.time]]
    .map(([l,v])=>`<div class="row"><span class="lbl">${l}</span><span class="val">${v}</span></div>`).join('')}
  <div class="foot">Bella Vista · Blue Area, Islamabad<br>Please present this confirmation upon arrival.</div>
  </body></html>`);
  win.document.close();
  setTimeout(() => { win.print(); win.close(); }, 500);
}

// ── Storage helpers ──────────────────────────────────
function loadStored(): BookedReservation[] {
  try { return JSON.parse(localStorage.getItem('bv_my_reservations') ?? '[]'); } catch { return []; }
}
function saveStored(list: BookedReservation[]) {
  localStorage.setItem('bv_my_reservations', JSON.stringify(list));
}

type ModalType = null | 'cancel-confirm' | 'cancel-done' | 'reschedule' | 'reschedule-done' | 'within24h';

// ── My Reservations section ──────────────────────────
function MyReservations({ phone, email }: { phone: string; email: string }) {
  const today = todayLocal();
  const [reservations, setReservations] = useState<BookedReservation[]>(loadStored);
  const [activeRes,    setActiveRes]    = useState<BookedReservation | null>(null);
  const [modal,        setModal]        = useState<ModalType>(null);
  const [newDate,      setNewDate]      = useState('');
  const [newTime,      setNewTime]      = useState('');
  const [cancelling,   setCancelling]   = useState(false);

  // Refresh from localStorage whenever component mounts or becomes visible
  useEffect(() => {
    const refresh = () => setReservations(loadStored());
    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const update = (list: BookedReservation[]) => {
    setReservations(list);
    saveStored(list);
  };

  const openAction = (res: BookedReservation, action: 'cancel' | 'reschedule') => {
    setActiveRes(res);
    if (isWithin24h(res.date, res.time)) {
      setModal('within24h');
    } else {
      if (action === 'cancel') setModal('cancel-confirm');
      else { setNewDate(today); setNewTime(''); setModal('reschedule'); }
    }
  };

  const confirmCancel = async () => {
    if (!activeRes) return;
    setCancelling(true);
    // 1. Update Supabase status to 'cancelled'
    await cancelReservationInSupabase(activeRes.code);
    // 2. Remove from localStorage
    update(reservations.filter(r => r.code !== activeRes.code));
    setCancelling(false);
    setModal('cancel-done');
  };

  const confirmReschedule = () => {
    if (!activeRes || !newDate || !newTime) return;
    const updated = reservations.map(r =>
      r.code === activeRes.code ? { ...r, date: newDate, time: newTime } : r
    );
    update(updated);
    setActiveRes(prev => prev ? { ...prev, date: newDate, time: newTime } : null);
    setModal('reschedule-done');
  };

  const closeModal = () => { setModal(null); setActiveRes(null); };

  const modalBg: React.CSSProperties = { position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' };
  const modalBox: React.CSSProperties = { background:'#161616',border:'1px solid rgba(201,168,76,0.3)',maxWidth:'440px',width:'100%',padding:'32px' };
  const inp: React.CSSProperties = { width:'100%',padding:'11px 14px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(201,168,76,0.22)',color:'#e8dcc8',fontSize:'13px',outline:'none',fontFamily:'Lato,sans-serif',transition:'border-color 0.2s' };
  const btnGold: React.CSSProperties = { width:'100%',padding:'13px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',fontFamily:'Lato,sans-serif',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,border:'none',cursor:'pointer' };
  const btnGhost: React.CSSProperties = { width:'100%',padding:'12px',background:'transparent',border:'1px solid rgba(201,168,76,0.25)',color:'rgba(201,168,76,0.7)',fontFamily:'Lato,sans-serif',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',cursor:'pointer',marginTop:'10px' };
  const btnRed: React.CSSProperties = { ...btnGold, background: cancelling ? 'rgba(192,57,43,0.5)' : 'linear-gradient(135deg,#c0392b,#e74c3c)' };

  return (
    <>
      <section className="py-16 px-6" style={{ background:'#111',borderTop:'1px solid rgba(201,168,76,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="font-script text-2xl mb-1" style={{ color:'#c9a84c' }}>Your bookings</p>
            <h2 className="font-display text-3xl font-light" style={{ color:'#f0d080' }}>My Reservations</h2>
          </div>

          {reservations.length === 0 ? (
            <div style={{ padding:'32px',textAlign:'center',border:'1px solid rgba(201,168,76,0.1)',background:'rgba(255,255,255,0.02)' }}>
              <p style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'20px',color:'rgba(232,220,200,0.35)',marginBottom:'8px' }}>No reservations yet</p>
              <p style={{ fontSize:'13px',color:'rgba(232,220,200,0.25)' }}>Your bookings will appear here after you reserve a table.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map(res => {
                const within = isWithin24h(res.date, res.time);
                const dateLabel = new Date(res.date+'T12:00:00').toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
                return (
                  <div key={res.code} style={{ background:'#161616',border:'1px solid rgba(201,168,76,0.15)',padding:'20px 24px' }}>
                    <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'16px',flexWrap:'wrap' }}>
                      <div>
                        <p style={{ fontSize:'12px',fontWeight:700,color:'#c9a84c',letterSpacing:'1px',marginBottom:'4px' }}>#{res.code}</p>
                        <p style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'20px',color:'#f0d080',marginBottom:'4px' }}>{res.name}</p>
                        <p style={{ fontSize:'12px',color:'rgba(232,220,200,0.5)' }}>{dateLabel} · {res.time} · {res.guests} guests</p>
                      </div>
                      <div style={{ display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center' }}>
                        <button onClick={() => downloadPDF(res)}
                          style={{ padding:'8px 14px',background:'transparent',border:'1px solid rgba(201,168,76,0.35)',color:'#c9a84c',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Lato,sans-serif' }}
                          onMouseEnter={e => (e.currentTarget.style.background='rgba(201,168,76,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                          PDF
                        </button>
                        <button onClick={() => openAction(res, 'reschedule')}
                          style={{ padding:'8px 14px',background:'transparent',border:'1px solid rgba(201,168,76,0.35)',color:'#c9a84c',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Lato,sans-serif' }}
                          onMouseEnter={e => (e.currentTarget.style.background='rgba(201,168,76,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                          Reschedule
                        </button>
                        <button onClick={() => openAction(res, 'cancel')}
                          style={{ padding:'8px 14px',background:'transparent',border:'1px solid rgba(255,80,80,0.3)',color:'rgba(255,100,100,0.8)',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',fontFamily:'Lato,sans-serif' }}
                          onMouseEnter={e => (e.currentTarget.style.background='rgba(255,80,80,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                          Cancel
                        </button>
                      </div>
                    </div>
                    {within && (
                      <p style={{ marginTop:'8px',fontSize:'11px',color:'rgba(255,140,100,0.7)' }}>
                        ⚠ Less than 24 hours away — changes require calling us directly.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Within 24h popup */}
      {modal === 'within24h' && activeRes && (
        <div style={modalBg} onClick={closeModal}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'#f0d080',marginBottom:'12px' }}>Less than 24 hours</h3>
            <p style={{ fontSize:'13px',color:'rgba(232,220,200,0.65)',lineHeight:1.8,marginBottom:'20px' }}>
              Your reservation at <strong style={{ color:'#c9a84c' }}>{activeRes.time}</strong> on{' '}
              <strong style={{ color:'#c9a84c' }}>{new Date(activeRes.date+'T12:00:00').toLocaleDateString('en-PK',{weekday:'long',month:'long',day:'numeric'})}</strong>{' '}
              is within 24 hours. Please contact us:
            </p>
            <p style={{ fontSize:'20px',color:'#c9a84c',fontWeight:'bold',marginBottom:'4px' }}>{phone}</p>
            <p style={{ fontSize:'13px',color:'rgba(232,220,200,0.45)',marginBottom:'24px' }}>{email}</p>
            <button style={btnGold} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      {modal === 'cancel-confirm' && activeRes && (
        <div style={modalBg} onClick={closeModal}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'#f0d080',marginBottom:'12px' }}>Cancel Reservation</h3>
            <p style={{ fontSize:'13px',color:'rgba(232,220,200,0.65)',lineHeight:1.8,marginBottom:'8px' }}>
              Are you sure you want to cancel this reservation?
            </p>
            <div style={{ padding:'14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,168,76,0.12)',marginBottom:'24px' }}>
              <p style={{ fontSize:'14px',color:'#e8dcc8',marginBottom:'4px' }}>#{activeRes.code}</p>
              <p style={{ fontSize:'12px',color:'rgba(232,220,200,0.5)' }}>
                {new Date(activeRes.date+'T12:00:00').toLocaleDateString('en-PK',{weekday:'long',month:'long',day:'numeric'})} · {activeRes.time} · {activeRes.guests} guests
              </p>
            </div>
            <button style={btnRed} onClick={confirmCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling…' : 'Yes, Cancel Reservation'}
            </button>
            <button style={btnGhost} onClick={closeModal}>Keep Reservation</button>
          </div>
        </div>
      )}

      {/* Cancel done */}
      {modal === 'cancel-done' && (
        <div style={modalBg} onClick={closeModal}>
          <div style={{ ...modalBox, textAlign:'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width:'64px',height:'64px',borderRadius:'50%',background:'rgba(74,222,128,0.1)',border:'2px solid #4ade80',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px' }}>✓</div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'#f0d080',marginBottom:'10px' }}>Reservation Cancelled</h3>
            <p style={{ fontSize:'13px',color:'rgba(232,220,200,0.55)',lineHeight:1.8,marginBottom:'24px' }}>
              Your reservation has been cancelled and the status updated in our system. We hope to welcome you again soon.
            </p>
            <button style={btnGold} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Reschedule form */}
      {modal === 'reschedule' && activeRes && (
        <div style={modalBg} onClick={closeModal}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'#f0d080',marginBottom:'6px' }}>Reschedule</h3>
            <p style={{ fontSize:'12px',color:'rgba(232,220,200,0.4)',marginBottom:'20px' }}>
              Current: {new Date(activeRes.date+'T12:00:00').toLocaleDateString('en-PK',{weekday:'short',month:'short',day:'numeric'})} · {activeRes.time}
            </p>
            <div style={{ display:'grid',gap:'14px',marginBottom:'24px' }}>
              <div>
                <label style={{ display:'block',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'rgba(232,220,200,0.45)',marginBottom:'7px' }}>New Date *</label>
                <input type="date" min={today} value={newDate}
                  onChange={e => { setNewDate(e.target.value); setNewTime(''); }}
                  style={{ ...inp, colorScheme:'dark' }}
                  onFocus={e => (e.currentTarget.style.borderColor='#c9a84c')}
                  onBlur={e  => (e.currentTarget.style.borderColor='rgba(201,168,76,0.22)')} />
              </div>
              <div>
                <label style={{ display:'block',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'rgba(232,220,200,0.45)',marginBottom:'7px' }}>New Time *</label>
                <select value={newTime} onChange={e => setNewTime(e.target.value)}
                  style={{ ...inp, cursor:'pointer' }}
                  onFocus={e => (e.currentTarget.style.borderColor='#c9a84c')}
                  onBlur={e  => (e.currentTarget.style.borderColor='rgba(201,168,76,0.22)')}>
                  <option value="">Select time…</option>
                  {ALL_SLOTS.map(slot => (
                    <option key={slot} value={slot} style={{ background:'#1a1a1a',color:'#e8dcc8' }}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
            <button style={{ ...btnGold, opacity: newDate&&newTime?1:0.5, cursor:newDate&&newTime?'pointer':'not-allowed' }}
              onClick={confirmReschedule} disabled={!newDate||!newTime}>
              Confirm Reschedule
            </button>
            <button style={btnGhost} onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}

      {/* Reschedule done */}
      {modal === 'reschedule-done' && activeRes && (
        <div style={modalBg} onClick={closeModal}>
          <div style={{ ...modalBox, textAlign:'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ width:'64px',height:'64px',borderRadius:'50%',background:'rgba(201,168,76,0.1)',border:'2px solid #c9a84c',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:'28px' }}>📅</div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'24px',color:'#f0d080',marginBottom:'10px' }}>Rescheduled!</h3>
            <p style={{ fontSize:'15px',color:'#c9a84c',fontWeight:'bold',marginBottom:'4px' }}>
              {new Date(activeRes.date+'T12:00:00').toLocaleDateString('en-PK',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
            </p>
            <p style={{ fontSize:'14px',color:'#c9a84c',marginBottom:'16px' }}>{activeRes.time}</p>
            <p style={{ fontSize:'12px',color:'rgba(232,220,200,0.35)',marginBottom:'24px',lineHeight:1.7 }}>
              Please call us to officially confirm the change with our team.
            </p>
            <button style={btnGold} onClick={closeModal}>Done</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function ReservationsPage() {
  useScrollReveal();
  const { settings } = useSettings();
  useEffect(() => { document.title = 'Reservations — Bella Vista'; }, []);

  const HOURS = [
    { days:'Monday – Thursday', time:settings.hours_mon_thu },
    { days:'Friday – Saturday', time:settings.hours_fri_sat },
    { days:'Sunday',            time:settings.hours_sun     },
  ];

  return (
    <main className="bg-[#0c0c0c]">
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden"
        style={{ background:'radial-gradient(ellipse at 50% 0%,#0f1a08 0%,#0c0c0c 70%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' }} />
        <div className="max-w-2xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{ color:'#c9a84c' }}>An evening you'll never forget</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background:'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background:'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-4" style={{ color:'#f0d080' }}>Reservations</h1>
          <p className="font-body text-sm" style={{ color:'rgba(232,220,200,0.5)' }}>Secure your table online. We'll call to confirm shortly.</p>
        </div>
      </section>

      <section className="py-16 px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="reveal-left space-y-10">
            <div>
              <h2 className="font-display text-3xl font-light mb-6" style={{ color:'#f0d080' }}>Why Dine With Us</h2>
              <div className="space-y-5">
                {WHY_DINE.map((point, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45 mt-2 flex-shrink-0" />
                    <p className="font-body text-sm" style={{ color:'rgba(232,220,200,0.62)', lineHeight:1.85 }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <ClockIcon size={18} color="#c9a84c" />
                <h3 className="font-body text-xs tracking-[3px] uppercase" style={{ color:'#c9a84c' }}>Opening Hours</h3>
              </div>
              <div className="p-6" style={{ border:'1px solid rgba(201,168,76,0.15)', background:'rgba(201,168,76,0.03)' }}>
                {HOURS.map(({ days, time }, i) => (
                  <div key={days} className="flex items-center justify-between py-3"
                    style={{ borderBottom: i < HOURS.length-1 ? '1px solid rgba(201,168,76,0.08)' : 'none' }}>
                    <span className="font-body text-sm" style={{ color:'rgba(232,220,200,0.58)' }}>{days}</span>
                    <span className="font-body text-sm font-bold" style={{ color:'#c9a84c' }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6" style={{ border:'1px solid rgba(201,168,76,0.15)', background:'rgba(201,168,76,0.03)' }}>
              <div className="flex items-center gap-3 mb-3">
                <CalendarIcon size={18} color="#c9a84c" />
                <h3 className="font-body text-xs tracking-[3px] uppercase" style={{ color:'#c9a84c' }}>Private Dining</h3>
              </div>
              <p className="font-body text-sm" style={{ color:'rgba(232,220,200,0.58)', lineHeight:1.85 }}>
                Host your private celebration in our exclusive dining room, accommodating up to 20 guests. Available for birthdays, anniversaries, corporate events and proposals.
              </p>
              <Link to="/contact"
                className="inline-block mt-4 font-body text-xs tracking-[2px] uppercase transition-colors duration-300"
                style={{ color:'#c9a84c', textDecoration:'none' }}
                onMouseEnter={e => (e.currentTarget.style.color='#f0d080')}
                onMouseLeave={e => (e.currentTarget.style.color='#c9a84c')}>
                Enquire about private dining →
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 flex items-center justify-center"
                style={{ border:'1px solid rgba(201,168,76,0.22)', background:'rgba(201,168,76,0.05)' }}>
                <PhoneIcon size={18} color="#c9a84c" />
              </div>
              <div>
                <p className="font-body text-xs tracking-[2px] uppercase mb-1" style={{ color:'rgba(232,220,200,0.38)' }}>Call to reserve</p>
                <a href={`tel:${settings.phone}`} className="font-body text-base transition-colors duration-300" style={{ color:'#e8dcc8' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
                  onMouseLeave={e => (e.currentTarget.style.color='#e8dcc8')}>
                  {settings.phone}
                </a>
              </div>
            </div>
          </div>
          <div className="reveal-right"><ReservationForm /></div>
        </div>
      </section>

      {/* My Reservations — always visible */}
      <MyReservations phone={settings.phone} email={settings.email} />
    </main>
  );
}
