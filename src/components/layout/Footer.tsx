import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, TwitterIcon, WhatsAppIcon } from '../../assets/svgs/Icons';
import { useSettings } from '../../contexts/SettingsContext';

const NAV_LINKS = [
  { label:'Home',         href:'/'             },
  { label:'Our Story',    href:'/our-story'    },
  { label:'Menu',         href:'/menu'         },
  { label:'Reservations', href:'/reservations' },
  { label:'Gallery',      href:'/gallery'      },
  { label:'Contact',      href:'/contact'      },
];

export default function Footer() {
  const { settings } = useSettings();

  const socials = [
    { Icon: InstagramIcon, href: settings.instagram_url || '#', label:'Instagram' },
    { Icon: FacebookIcon,  href: settings.facebook_url  || '#', label:'Facebook'  },
    { Icon: TwitterIcon,   href: settings.x_url         || '#', label:'X'         },
    { Icon: WhatsAppIcon,  href: `https://wa.me/${(settings.whatsapp||'').replace(/\D/g,'')}`, label:'WhatsApp' },
  ];

  return (
    <footer className="bg-[#0c0c0c] pt-20 pb-10" style={{ borderTop:'1px solid rgba(201,168,76,0.1)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-4 mb-14">
          <div className="flex-1 h-px" style={{ background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.3))' }} />
          <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
          <div className="flex-1 h-px" style={{ background:'linear-gradient(90deg,rgba(201,168,76,0.3),transparent)' }} />
        </div>

        <div className="text-center mb-12">
          <h2 className="font-display text-5xl lg:text-6xl font-light gold-shimmer mb-1">{settings.restaurant_name}</h2>
          <p className="font-script text-xl" style={{ color:'rgba(201,168,76,0.55)' }}>Ristorante Italiano</p>
          <p className="font-body text-xs tracking-[3px] uppercase mt-3" style={{ color:'rgba(232,220,200,0.3)' }}>{settings.tagline}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-10 mb-10">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} to={href}
              className="font-body text-xs tracking-[2px] uppercase transition-colors duration-300"
              style={{ color:'rgba(232,220,200,0.42)' }}
              onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(232,220,200,0.42)')}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mb-12">
          {socials.map(({ Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="w-10 h-10 flex items-center justify-center transition-all duration-300"
              style={{ border:'1px solid rgba(201,168,76,0.18)', color:'rgba(201,168,76,0.45)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='#c9a84c'; (e.currentTarget as HTMLElement).style.borderColor='#c9a84c'; (e.currentTarget as HTMLElement).style.boxShadow='0 0 20px rgba(201,168,76,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='rgba(201,168,76,0.45)'; (e.currentTarget as HTMLElement).style.borderColor='rgba(201,168,76,0.18)'; (e.currentTarget as HTMLElement).style.boxShadow=''; }}>
              <Icon size={17} color="currentColor" />
            </a>
          ))}
        </div>

        <div className="h-px mb-8" style={{ background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.12),transparent)' }} />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs" style={{ color:'rgba(232,220,200,0.25)' }}>
            &copy; {new Date().getFullYear()} {settings.restaurant_name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="/privacy-policy"
              className="font-body text-xs transition-colors duration-300" style={{ color:'rgba(232,220,200,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(232,220,200,0.25)')}>
              Privacy Policy
            </Link>
            <Link to="/terms-of-use"
              className="font-body text-xs transition-colors duration-300" style={{ color:'rgba(232,220,200,0.25)' }}
              onMouseEnter={e => (e.currentTarget.style.color='#c9a84c')}
              onMouseLeave={e => (e.currentTarget.style.color='rgba(232,220,200,0.25)')}>
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
