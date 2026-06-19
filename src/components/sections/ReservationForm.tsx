import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saveReservationToSupabase, useBookedSlots } from '../../hooks/useSupabaseData';
import { useSettings } from '../../contexts/SettingsContext';
import { ReservationStep1, ReservationStep2 } from '../../types';
import { WindowTableIcon, GardenIcon, HallIcon, PrivateRoomIcon, CheckIcon, ArrowRightIcon } from '../../assets/svgs/Icons';

const GUEST_OPTIONS   = ['1 – 2', '3 – 4', '5 – 6', '7 – 8', '8+'];
const SEATING_OPTIONS = [
  { key: 'window',  label: 'Window Table', Icon: WindowTableIcon },
  { key: 'garden',  label: 'Garden',       Icon: GardenIcon      },
  { key: 'hall',    label: 'Main Hall',    Icon: HallIcon        },
  { key: 'private', label: 'Private Room', Icon: PrivateRoomIcon },
] as const;
const OCCASION_OPTIONS = ['None','Birthday','Anniversary','Business Dinner','Proposal','Celebration','Other'];
const SOURCE_OPTIONS   = ['Google','Instagram','Friend / Family','Facebook','Walk-in','Other'];

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
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

function isPastTime(slot: string): boolean {
  const now = new Date();
  const [tp, ap] = slot.split(' ');
  const [hh, mm] = tp.split(':');
  let h = parseInt(hh);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  const s = new Date(); s.setHours(h, parseInt(mm), 0, 0);
  return s <= now;
}

// Build Google Calendar URL
function buildCalUrl(code: string, date: string, time: string): string {
  const [tp, ap] = time.split(' ');
  const [hh, mm] = tp.split(':');
  let h = parseInt(hh);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  const ds = date.replace(/-/g, '');
  const start = `${ds}T${String(h).padStart(2,'0')}${mm}00`;
  const end   = `${ds}T${String(Math.min(h + 2, 23)).padStart(2,'0')}${mm}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Dinner+at+Bella+Vista&dates=${start}/${end}&details=Reservation+%23${code}&location=Blue+Area%2C+Islamabad`;
}

type Step = 1 | 2 | 'success';
const D2: ReservationStep2 = { name: '', phone: '', email: '', source: '', agreedToPolicy: false };

export interface BookedReservation {
  code: string; date: string; time: string; guests: string;
  name: string; email: string; phone: string;
}

// Store reservation in localStorage for "My Reservations" section
function storeLocal(r: BookedReservation) {
  try {
    const stored: BookedReservation[] = JSON.parse(localStorage.getItem('bv_my_reservations') ?? '[]');
    // Avoid duplicates
    if (!stored.find(x => x.code === r.code)) {
      localStorage.setItem('bv_my_reservations', JSON.stringify([r, ...stored].slice(0, 5)));
    }
  } catch { /* ignore */ }
}

export default function ReservationForm() {
  const { settings } = useSettings();
  const today = todayLocal();

  const [step,        setStep]        = useState<Step>(1);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState<Record<string,boolean>>({});
  const [s1, setS1]   = useState<ReservationStep1>({ date: today, time: '', guests: '', seating: '', occasion: 'None', specialRequests: '' });
  const [s2, setS2]   = useState<ReservationStep2>(D2);
  const [confirmed,   setConfirmed]   = useState<BookedReservation | null>(null);
  const [submitErr,   setSubmitErr]   = useState('');

  const { bookedSlots } = useBookedSlots(s1.date);

  // Reset past date
  useEffect(() => { if (s1.date < today) setS1(p => ({ ...p, date: today, time: '' })); });

  const shake = (f: string) => {
    setErrors(p => ({ ...p, [f]: true }));
    setTimeout(() => setErrors(p => { const n = { ...p }; delete n[f]; return n; }), 650);
  };
  const cls = (f: string) => `form-input${errors[f] ? ' shake' : ''}`;

  const v1 = () => {
    let ok = true;
    if (!s1.date)    { shake('date');    ok = false; }
    if (!s1.time)    { shake('time');    ok = false; }
    if (!s1.guests)  { shake('guests');  ok = false; }
    if (!s1.seating) { shake('seating'); ok = false; }
    return ok;
  };
  const v2 = () => {
    let ok = true;
    if (!s2.name.trim())                             { shake('name');   ok = false; }
    if (!s2.phone.trim())                            { shake('phone');  ok = false; }
    if (!s2.email.trim() || !s2.email.includes('@')) { shake('email');  ok = false; }
    if (!s2.agreedToPolicy)                          { shake('policy'); ok = false; }
    return ok;
  };

  const handleSubmit = async () => {
    if (!v2()) return;
    setLoading(true); setSubmitErr('');
    const res = await saveReservationToSupabase({
      date: s1.date, time: s1.time, guests: s1.guests, seating: s1.seating,
      occasion: s1.occasion, specialRequests: s1.specialRequests,
      name: s2.name, phone: s2.phone, email: s2.email, source: s2.source,
    });
    setLoading(false);
    if ('error' in res) { setSubmitErr(res.error); return; }
    const booked: BookedReservation = {
      code: res.confirmationCode, date: s1.date, time: s1.time,
      guests: s1.guests, email: s2.email, name: s2.name, phone: s2.phone,
    };
    storeLocal(booked);
    setConfirmed(booked);
    setStep('success');
  };

  const sn = step === 'success' ? 3 : (step as number);

  return (
    <div className="glass-card p-8 lg:p-10 w-full">

      {/* SUCCESS — only Add to Calendar + View Menu */}
      {step === 'success' && confirmed && (
        <div className="text-center py-4">
          <div className="flex justify-center mb-8">
            <div className="check-circle w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background:'rgba(201,168,76,0.1)',border:'2px solid #c9a84c' }}>
              <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
                <path className="check-path" d="M9 23L19 33L37 13" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h3 className="font-display text-3xl font-light mb-2" style={{ color:'#f0d080' }}>Booking Received!</h3>
          <p className="font-body text-xs tracking-[3px] uppercase mb-2" style={{ color:'rgba(201,168,76,0.65)' }}>Reference #{confirmed.code}</p>
          <p className="font-body text-xs mb-6" style={{ color:'rgba(232,220,200,0.4)' }}>Our team will call you shortly to confirm.</p>

          <div className="p-5 mb-8 text-left space-y-3" style={{ border:'1px solid rgba(201,168,76,0.2)',background:'rgba(201,168,76,0.04)' }}>
            {[
              { label:'Table for', value: confirmed.guests },
              { label:'Date',      value: new Date(confirmed.date+'T12:00:00').toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) },
              { label:'Time',      value: confirmed.time   },
              { label:'Email',     value: confirmed.email  },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="font-body text-xs tracking-[1px] uppercase flex-shrink-0" style={{ color:'rgba(232,220,200,0.4)' }}>{label}</span>
                <span className="font-body text-sm text-right" style={{ color:'#e8dcc8' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Only 2 buttons on success */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={buildCalUrl(confirmed.code, confirmed.date, confirmed.time)}
              target="_blank" rel="noopener noreferrer"
              className="btn-outline-gold flex-1 justify-center" style={{ fontSize:'11px' }}>
              Add to Calendar
            </a>
            <Link to="/menu" className="btn-gold flex-1 justify-center" style={{ fontSize:'11px' }}>
              View Menu
            </Link>
          </div>

          <p className="font-body text-xs mt-5" style={{ color:'rgba(232,220,200,0.3)' }}>
            To cancel or reschedule, scroll down to <strong style={{ color:'rgba(201,168,76,0.5)' }}>My Reservations</strong> below.
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center py-20">
          <div className="flex justify-center mb-6"><div className="loading-ring" /></div>
          <p className="font-body text-sm tracking-[3px] uppercase" style={{ color:'rgba(201,168,76,0.6)' }}>Processing…</p>
        </div>
      )}

      {/* FORM */}
      {!loading && step !== 'success' && (
        <>
          {/* Step dots */}
          <div className="flex items-center mb-10 gap-2">
            {[1,2].map(n => {
              const done = sn > n, act = sn === n;
              return (
                <div key={n} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className="step-dot flex-shrink-0"
                    style={{ background: done||act ? 'linear-gradient(135deg,#c9a84c,#f0d080)' : 'rgba(201,168,76,0.08)', color: done||act ? '#0c0c0c' : 'rgba(232,220,200,0.3)', border: done||act ? 'none' : '1px solid rgba(201,168,76,0.2)' }}>
                    {done ? <CheckIcon size={14} color="#0c0c0c" /> : n}
                  </div>
                  {n===1 && <div className="step-line flex-1" style={{ background: sn>1 ? '#c9a84c' : 'rgba(201,168,76,0.15)' }} />}
                </div>
              );
            })}
            <span className="font-body text-xs ml-1 whitespace-nowrap" style={{ color:'rgba(232,220,200,0.35)' }}>Step {step} of 2</span>
          </div>

          {submitErr && (
            <div className="mb-4 p-3 text-xs" style={{ background:'rgba(255,80,80,0.08)',border:'1px solid rgba(255,80,80,0.25)',color:'#ff8080' }}>{submitErr}</div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-light" style={{ color:'#f0d080' }}>Table Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs tracking-[2px] uppercase mb-2" style={{ color:'rgba(232,220,200,0.45)' }}>Date *</label>
                  <input type="date" min={today} className={cls('date')} value={s1.date}
                    onChange={e => setS1(p => ({ ...p, date: e.target.value, time: '' }))}
                    style={{ colorScheme:'dark' }} />
                </div>
                <div>
                  <label className="block font-body text-xs tracking-[2px] uppercase mb-2" style={{ color:'rgba(232,220,200,0.45)' }}>Time *</label>
                  <select className={cls('time')} value={s1.time}
                    onChange={e => setS1(p => ({ ...p, time: e.target.value }))}>
                    <option value="">Select time…</option>
                    {ALL_SLOTS.map(slot => {
                      const past   = s1.date === today && isPastTime(slot);
                      const booked = bookedSlots.includes(slot);
                      return (
                        <option key={slot} value={slot} disabled={past || booked}
                          style={{ color: past||booked ? 'rgba(232,220,200,0.25)' : '#e8dcc8' }}>
                          {slot}{booked ? '  — Booked' : past ? '  — Passed' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-body text-xs tracking-[2px] uppercase mb-3" style={{ color:'rgba(232,220,200,0.45)' }}>Guests *</label>
                <div className={`flex flex-wrap gap-2${errors['guests'] ? ' shake' : ''}`}>
                  {GUEST_OPTIONS.map(g => (
                    <button key={g} type="button" onClick={() => setS1(p => ({ ...p, guests: g }))}
                      className={`guest-btn${s1.guests === g ? ' selected' : ''}`}>{g}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body text-xs tracking-[2px] uppercase mb-3" style={{ color:'rgba(232,220,200,0.45)' }}>Seating Preference *</label>
                <div className={`grid grid-cols-2 gap-3${errors['seating'] ? ' shake' : ''}`}>
                  {SEATING_OPTIONS.map(({ key, label, Icon }) => (
                    <div key={key} className={`seating-card${s1.seating === key ? ' selected' : ''}`}
                      onClick={() => setS1(p => ({ ...p, seating: key }))}>
                      <Icon size={26} color={s1.seating === key ? '#c9a84c' : 'rgba(201,168,76,0.45)'} />
                      <p className="font-body text-xs mt-2" style={{ color: s1.seating===key ? '#c9a84c' : 'rgba(232,220,200,0.55)' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body text-xs tracking-[2px] uppercase mb-2" style={{ color:'rgba(232,220,200,0.45)' }}>
                  Occasion <span style={{ color:'rgba(232,220,200,0.28)' }}>(optional)</span>
                </label>
                <select className="form-input" value={s1.occasion} onChange={e => setS1(p => ({ ...p, occasion: e.target.value }))}>
                  {OCCASION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-body text-xs tracking-[2px] uppercase mb-2" style={{ color:'rgba(232,220,200,0.45)' }}>Special Requests</label>
                <textarea rows={3} className="form-input resize-none"
                  placeholder="Allergies, dietary needs, special arrangements…"
                  value={s1.specialRequests} onChange={e => setS1(p => ({ ...p, specialRequests: e.target.value }))} />
              </div>

              <button className="btn-gold w-full justify-center" onClick={() => { if (v1()) setStep(2); }}>
                Next Step <ArrowRightIcon size={16} color="#0c0c0c" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <button type="button" onClick={() => setStep(1)}
                  style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(201,168,76,0.5)',fontSize:'12px',letterSpacing:'2px',textTransform:'uppercase',fontFamily:'Lato,sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(201,168,76,0.5)')}>
                  ← Back
                </button>
                <h3 className="font-display text-2xl font-light" style={{ color:'#f0d080' }}>Your Details</h3>
              </div>

              {([
                { label:'Full Name *',     key:'name',  type:'text',  ph:'e.g. Amna Siddiqui'  },
                { label:'Phone Number *',  key:'phone', type:'tel',   ph:'+92 300 000 0000'     },
                { label:'Email Address *', key:'email', type:'email', ph:'you@example.com'      },
              ] as { label:string; key:keyof ReservationStep2; type:string; ph:string }[]).map(({ label, key, type, ph }) => (
                <div key={String(key)}>
                  <label className="block font-body text-xs tracking-[2px] uppercase mb-2" style={{ color:'rgba(232,220,200,0.45)' }}>{label}</label>
                  <input type={type} placeholder={ph} className={cls(String(key))} value={String(s2[key])}
                    onChange={e => setS2(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}

              <div>
                <label className="block font-body text-xs tracking-[2px] uppercase mb-2" style={{ color:'rgba(232,220,200,0.45)' }}>How did you hear about us?</label>
                <select className="form-input" value={s2.source} onChange={e => setS2(p => ({ ...p, source: e.target.value }))}>
                  <option value="">Select…</option>
                  {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className={`flex items-start gap-3 pt-1${errors['policy'] ? ' shake' : ''}`}>
                <input id="bv-policy" type="checkbox" className="custom-checkbox mt-0.5 flex-shrink-0"
                  checked={s2.agreedToPolicy} onChange={e => setS2(p => ({ ...p, agreedToPolicy: e.target.checked }))} />
                <label htmlFor="bv-policy" className="font-body text-xs leading-relaxed cursor-pointer" style={{ color:'rgba(232,220,200,0.5)' }}>
                  I agree to the cancellation policy. Reservations cancelled less than 24 hours in advance may incur a fee.
                </label>
              </div>

              <button className="btn-gold w-full justify-center mt-2" onClick={handleSubmit}>
                Confirm Booking <CheckIcon size={16} color="#0c0c0c" />
              </button>

              <p className="text-center font-body text-xs pt-1" style={{ color:'rgba(232,220,200,0.3)' }}>
                Prefer to call?{' '}
                <a href={`tel:${settings.phone}`} style={{ color:'rgba(201,168,76,0.55)' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(201,168,76,0.55)')}>
                  {settings.phone}
                </a>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
