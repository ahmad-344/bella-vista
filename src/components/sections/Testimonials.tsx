import { useState, useEffect, useRef } from 'react';
import { useTestimonialsData } from '../../hooks/useSupabaseData';
import { StarIcon, QuoteIcon } from '../../assets/svgs/Icons';

export default function Testimonials() {
  const { items } = useTestimonialsData();
  const [active, setActive]  = useState(0);
  const [fading, setFading]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (idx === active || items.length === 0) return;
    setFading(true);
    setTimeout(() => { setActive(idx % items.length); setFading(false); }, 380);
  };

  useEffect(() => {
    if (items.length === 0) return;
    timerRef.current = setInterval(() => goTo((active + 1) % items.length), 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  });

  const t = items[active % Math.max(items.length, 1)];
  if (!t) return null;

  return (
    <section className="bg-[#0c0c0c] py-24 lg:py-32 overflow-hidden relative">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center,rgba(201,168,76,0.04) 0%,transparent 70%)' }} />
      <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
        <div className="mb-14 reveal">
          <p className="font-script text-3xl mb-5" style={{ color: '#c9a84c' }}>What Our Guests Say</p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
        </div>

        <div style={{ transition: 'opacity 0.38s ease, transform 0.38s ease', opacity: fading ? 0 : 1, transform: fading ? 'translateY(14px)' : 'translateY(0)' }}>
          <div className="flex justify-center mb-6"><QuoteIcon size={44} color="#c9a84c" /></div>
          <div className="flex items-center justify-center gap-1 mb-8">
            {Array.from({ length: t.rating }).map((_, i) => <StarIcon key={i} size={18} color="#c9a84c" filled />)}
          </div>
          <blockquote className="font-display text-xl lg:text-2xl font-light max-w-3xl mx-auto mb-10"
            style={{ color: '#e8dcc8', fontStyle: 'italic', lineHeight: 1.85 }}>
            "{t.text}"
          </blockquote>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-px bg-[#c9a84c]" />
            <p className="font-body font-bold text-sm tracking-[2px] uppercase" style={{ color: '#c9a84c' }}>{t.author}</p>
            <p className="font-body text-xs tracking-[1px]" style={{ color: 'rgba(232,220,200,0.38)' }}>{t.location}</p>
          </div>
        </div>

        {items.length > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            {items.map((_, idx) => (
              <button key={idx} onClick={() => goTo(idx)} aria-label={`Testimonial ${idx+1}`}
                style={{ width: idx===active?'28px':'8px', height:'8px', borderRadius: idx===active?'4px':'50%', background: idx===active?'linear-gradient(90deg,#c9a84c,#f0d080)':'rgba(201,168,76,0.22)', border:'none', cursor:'pointer', padding:0, transition:'all 0.3s ease' }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
