import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon } from '../../assets/svgs/Icons';
import { useSettings } from '../../contexts/SettingsContext';

export default function ContactSection() {
  const { settings } = useSettings();

  const mapsUrl = settings.map_lat && settings.map_lng
    ? `https://www.google.com/maps?q=${settings.map_lat},${settings.map_lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;

  const ROWS = [
    { Icon: MapPinIcon,   label: 'Address',      value: settings.address,   href: undefined as string|undefined },
    { Icon: PhoneIcon,    label: 'Reservations', value: settings.phone,     href: `tel:${settings.phone}` },
    { Icon: MailIcon,     label: 'Email',        value: settings.email,     href: `mailto:${settings.email}` },
    { Icon: WhatsAppIcon, label: 'WhatsApp',     value: 'Chat with us now', href: `https://wa.me/${(settings.whatsapp||'').replace(/\D/g,'')}` },
  ];
  const HOURS = [
    { days: 'Monday – Thursday', time: settings.hours_mon_thu },
    { days: 'Friday – Saturday', time: settings.hours_fri_sat },
    { days: 'Sunday',            time: settings.hours_sun     },
  ];

  return (
    <section className="bg-[#111] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <p className="font-script text-3xl mb-4 reveal" style={{ color:'#c9a84c' }}>Come Find Us</p>
          <div className="flex items-center justify-center gap-4 mb-5 reveal" style={{ transitionDelay:'0.1s' }}>
            <div className="h-px w-10" style={{ background:'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background:'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light reveal" style={{ color:'#f0d080',transitionDelay:'0.2s' }}>
            Contact &amp; Location
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* CSS Map */}
          <div className="css-map reveal-left min-h-[360px] relative" style={{ border:'1px solid rgba(201,168,76,0.2)' }}>
            <div className="map-road-h" style={{ top:'30%',left:0,right:0 }} />
            <div className="map-road-h" style={{ top:'55%',left:0,right:0 }} />
            <div className="map-road-h" style={{ top:'78%',left:0,right:0 }} />
            <div className="map-road-v" style={{ left:'25%',top:0,bottom:0 }} />
            <div className="map-road-v" style={{ left:'60%',top:0,bottom:0 }} />
            <div className="map-road-v" style={{ left:'82%',top:0,bottom:0 }} />
            <div className="map-marker">
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background:'rgba(201,168,76,0.18)',border:'2px solid #c9a84c',animation:'pulseGold 2s ease-in-out infinite' }}>
                <MapPinIcon size={20} color="#c9a84c" />
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45" style={{ background:'#c9a84c' }} />
            </div>
            {/* Location label from settings */}
            <div className="absolute bottom-14 left-4 right-4 text-center font-body text-xs tracking-[2px] uppercase py-2"
              style={{ background:'rgba(12,12,12,0.85)',color:'#c9a84c',border:'1px solid rgba(201,168,76,0.2)' }}>
              {settings.map_label || settings.address}
            </div>
            {/* Directions uses real lat/lng */}
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="btn-gold absolute bottom-4 right-4" style={{ fontSize:'10px',padding:'8px 14px',letterSpacing:'2px' }}>
              Get Directions
            </a>
          </div>

          {/* Contact details */}
          <div className="reveal-right space-y-6">
            <h3 className="font-display text-2xl lg:text-3xl font-light" style={{ color:'#f0d080' }}>Reach Us</h3>
            <div className="h-px w-12 bg-[#c9a84c]" />
            {ROWS.map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-5">
                <div className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                  style={{ border:'1px solid rgba(201,168,76,0.22)',background:'rgba(201,168,76,0.05)' }}>
                  <Icon size={18} color="#c9a84c" />
                </div>
                <div>
                  <p className="font-body text-xs tracking-[2px] uppercase mb-1" style={{ color:'rgba(232,220,200,0.38)' }}>{label}</p>
                  {href
                    ? <a href={href} target={href.startsWith('http')?'_blank':undefined}
                        rel={href.startsWith('http')?'noopener noreferrer':undefined}
                        className="font-body text-sm transition-colors duration-300" style={{ color:'#e8dcc8' }}
                        onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
                        onMouseLeave={e => (e.currentTarget.style.color='#e8dcc8')}>{value}</a>
                    : <p className="font-body text-sm" style={{ color:'#e8dcc8' }}>{value}</p>
                  }
                </div>
              </div>
            ))}
            <div className="p-6" style={{ border:'1px solid rgba(201,168,76,0.15)',background:'rgba(201,168,76,0.03)' }}>
              <p className="font-body text-xs tracking-[3px] uppercase mb-5" style={{ color:'#c9a84c' }}>Opening Hours</p>
              {HOURS.map(({ days, time }, i) => (
                <div key={days} className="flex items-center justify-between py-2.5"
                  style={{ borderBottom:i<HOURS.length-1?'1px solid rgba(201,168,76,0.08)':'none' }}>
                  <span className="font-body text-xs" style={{ color:'rgba(232,220,200,0.58)' }}>{days}</span>
                  <span className="font-body text-xs font-bold" style={{ color:'#c9a84c' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
