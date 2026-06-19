import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import FullMenu from '../components/sections/FullMenu';
import { ArrowRightIcon } from '../assets/svgs/Icons';

export default function MenuPage() {
  useScrollReveal();
  const { settings } = useSettings();
  useEffect(() => { document.title = `Menu — ${settings.restaurant_name}`; }, [settings.restaurant_name]);

  return (
    <main className="bg-[#0c0c0c]">
      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,#1a1200 0%,#0c0c0c 70%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' }} />
        <div className="max-w-2xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{ color: '#c9a84c' }}>Cucina Italiana</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-6" style={{ color: '#f0d080' }}>Our Menu</h1>
          <p className="font-body text-sm" style={{ color: 'rgba(232,220,200,0.52)', lineHeight: 1.9 }}>
            Each dish is crafted daily using seasonal ingredients — a living document of Italy's culinary regions, reimagined with care in Islamabad.
          </p>
        </div>
      </section>

      <FullMenu />

      <section className="py-20 px-6 text-center" style={{ background: '#111' }}>
        <div className="max-w-xl mx-auto reveal">
          <h2 className="font-display text-3xl font-light mb-4" style={{ color: '#f0d080' }}>Ready to experience it?</h2>
          <p className="font-body text-sm mb-8" style={{ color: 'rgba(232,220,200,0.48)' }}>
            Reserve your table and let our chefs take you on a journey through Italy.
          </p>
          <Link to="/reservations" className="btn-gold inline-flex items-center gap-2">
            Book Your Table <ArrowRightIcon size={16} color="#0c0c0c" />
          </Link>
        </div>
      </section>
    </main>
  );
}
