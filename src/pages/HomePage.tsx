import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import HeroSection     from '../components/sections/HeroSection';
import AboutStrip      from '../components/sections/AboutStrip';
import SignatureDishes from '../components/sections/SignatureDishes';
import GallerySection  from '../components/sections/GallerySection';
import Testimonials    from '../components/sections/Testimonials';
import ContactSection  from '../components/sections/ContactSection';
import { CalendarIcon, ClockIcon, PhoneIcon } from '../assets/svgs/Icons';

export default function HomePage() {
  useScrollReveal();
  const { settings } = useSettings();

  useEffect(() => {
    document.title = `${settings.restaurant_name} — Italian Fine Dining, Islamabad`;
  }, [settings.restaurant_name]);

  return (
    <main>
      <HeroSection />
      <AboutStrip />
      <SignatureDishes />

      {/* CTA Banner */}
      <section className="py-20 px-6 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#1a0f06 0%,#0c0c0c 50%,#0f1a0a 100%)' }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center,rgba(201,168,76,0.06) 0%,transparent 70%)' }} />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6 reveal">
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-16" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light mb-5 reveal"
            style={{ color: '#f0d080', transitionDelay: '0.1s' }}>
            An Evening to Remember
          </h2>
          <p className="font-body text-sm leading-relaxed mb-10 max-w-md mx-auto reveal"
            style={{ color: 'rgba(232,220,200,0.55)', transitionDelay: '0.2s' }}>
            Reserve your table today and experience the finest Italian cuisine in the heart of Islamabad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal"
            style={{ transitionDelay: '0.3s' }}>
            <Link to="/reservations" className="btn-gold">
              <CalendarIcon size={16} color="#0c0c0c" /> Book a Table
            </Link>
            <a href={`tel:${settings.phone}`} className="btn-outline-gold">
              <PhoneIcon size={16} color="#c9a84c" /> {settings.phone}
            </a>
          </div>
          <div className="flex items-center justify-center gap-2 mt-8 reveal"
            style={{ transitionDelay: '0.4s' }}>
            <ClockIcon size={14} color="rgba(201,168,76,0.45)" />
            <p className="font-body text-xs" style={{ color: 'rgba(232,220,200,0.3)' }}>
              Open daily — {settings.hours_mon_thu}
            </p>
          </div>
        </div>
      </section>

      <GallerySection limit={6} />
      <Testimonials />
      <ContactSection />
    </main>
  );
}
