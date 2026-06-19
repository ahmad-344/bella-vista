import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, CloseIcon } from '../../assets/svgs/Icons';
import { useSettings } from '../../contexts/SettingsContext';

const NAV_LINKS = [
  { label: 'Home',         href: '/'             },
  { label: 'Our Story',    href: '/our-story'    },
  { label: 'Menu',         href: '/menu'         },
  { label: 'Reservations', href: '/reservations' },
  { label: 'Gallery',      href: '/gallery'      },
  { label: 'Contact',      href: '/contact'      },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const location  = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      <nav
        id="main-navbar"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background: 'rgba(12,12,12,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
        } : { background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex flex-col leading-none">
              <span className="font-display text-2xl font-light tracking-wider gold-text" style={{ lineHeight: 1.1 }}>
                {settings.restaurant_name}
              </span>
              <span className="font-body text-[9px] tracking-[4px] uppercase" style={{ color: 'rgba(201,168,76,0.55)' }}>
                Ristorante Italiano
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} to={href}
                  className="font-body text-xs tracking-[2px] uppercase transition-colors duration-300 relative group"
                  style={{ color: isActive(href) ? '#c9a84c' : '#e8dcc8' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                  onMouseLeave={e => (e.currentTarget.style.color = isActive(href) ? '#c9a84c' : '#e8dcc8')}>
                  {label}
                  <span className="absolute -bottom-1 left-0 h-px bg-[#c9a84c] transition-all duration-300"
                    style={{ width: isActive(href) ? '100%' : '0%' }} />
                </Link>
              ))}
            </div>

            <div className="hidden lg:block">
              <Link to="/reservations" className="btn-outline-gold" style={{ fontSize: '11px' }}>
                Reserve a Table
              </Link>
            </div>

            <button className="lg:hidden p-2"
              onClick={() => setDrawerOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <MenuIcon size={26} color="#c9a84c" />
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />

      {/* Drawer */}
      <div className={`drawer${drawerOpen ? ' open' : ''}`}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)' }} />

        <div className="flex items-center justify-between mb-12">
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-light gold-text">{settings.restaurant_name}</span>
            <span className="font-body text-[8px] tracking-[4px] uppercase" style={{ color: 'rgba(201,168,76,0.45)' }}>
              Ristorante Italiano
            </span>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <CloseIcon size={22} color="#c9a84c" />
          </button>
        </div>

        <nav className="flex flex-col">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} to={href}
              className="font-body text-sm tracking-[2px] uppercase py-4 px-2 transition-colors duration-300"
              style={{
                color: isActive(href) ? '#c9a84c' : '#e8dcc8',
                borderBottom: `1px solid ${isActive(href) ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)'}`,
              }}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <Link to="/reservations" className="btn-gold w-full justify-center" style={{ fontSize: '11px' }}>
            Reserve a Table
          </Link>
        </div>

        <div className="mt-auto pt-12">
          <p className="font-body text-xs tracking-[2px]" style={{ color: 'rgba(232,220,200,0.35)' }}>
            {settings.phone}
          </p>
          <p className="font-body text-xs tracking-[1px] mt-1" style={{ color: 'rgba(232,220,200,0.25)' }}>
            {settings.address}
          </p>
        </div>
      </div>
    </>
  );
}
