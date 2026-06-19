import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useGalleryData } from '../hooks/useSupabaseData';
import { ArrowRightIcon } from '../assets/svgs/Icons';

const HEIGHTS = [340, 260, 280, 240, 300, 260, 340, 280, 240, 300, 260, 280];

export default function GalleryPage() {
  useScrollReveal();
  const { items } = useGalleryData();   // starts with local data immediately
  useEffect(() => { document.title = 'Gallery — Bella Vista'; }, []);

  return (
    <main className="bg-[#0c0c0c]">

      {/* Hero */}
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,#1a0a12 0%,#0c0c0c 70%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' }} />
        <div className="max-w-2xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{ color: '#c9a84c' }}>Step Inside</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-4" style={{ color: '#f0d080' }}>Gallery</h1>
          <p className="font-body text-sm" style={{ color: 'rgba(232,220,200,0.5)' }}>
            A visual journey through our restaurant, kitchen, and the stories we tell every evening.
          </p>
        </div>
      </section>

      {/* Masonry — NO reveal, always visible */}
      <section className="py-16 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {items.map((item, i) => (
              <div key={item.id} className="gallery-item break-inside-avoid"
                style={{ border: '1px solid rgba(201,168,76,0.1)' }}>
                <div className="gallery-placeholder w-full relative"
                  style={{ background: item.gradient, height: `${HEIGHTS[i] ?? 260}px` }}>
                  <img
                    src={`/images/${item.image_name}`}
                    alt={item.label}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="gallery-overlay">
                  <div>
                    <p className="font-display text-lg font-light" style={{ color: '#f0d080' }}>{item.label}</p>
                    <p className="font-body text-xs mt-1 leading-relaxed" style={{ color: 'rgba(232,220,200,0.7)' }}>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: '#111' }}>
        <div className="max-w-xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{ color: '#c9a84c' }}>Come see it for yourself</p>
          <h2 className="font-display text-3xl font-light mb-8" style={{ color: '#f0d080' }}>The ambiance is even better in person.</h2>
          <Link to="/reservations" className="btn-gold inline-flex items-center gap-2">
            Reserve a Table <ArrowRightIcon size={16} color="#0c0c0c" />
          </Link>
        </div>
      </section>
    </main>
  );
}
