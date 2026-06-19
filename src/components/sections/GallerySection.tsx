import { Link } from 'react-router-dom';
import { useGalleryData } from '../../hooks/useSupabaseData';
import { ArrowRightIcon } from '../../assets/svgs/Icons';

interface Props { limit?: number; showCta?: boolean; }

const HEIGHTS = [260, 320, 260, 280, 300, 260, 280, 260, 320];

export default function GallerySection({ limit = 9, showCta = true }: Props) {
  const { items } = useGalleryData();   // starts with local data — never empty
  const visible   = items.slice(0, limit);

  return (
    <section className="bg-[#111] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* header uses reveal — static text, always triggered */}
        <div className="text-center mb-14">
          <p className="font-script text-3xl mb-4 reveal" style={{ color: '#c9a84c' }}>Step Inside</p>
          <div className="flex items-center justify-center gap-4 mb-6 reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light reveal"
            style={{ color: '#f0d080', transitionDelay: '0.2s' }}>The Ambiance</h2>
        </div>

        {/* ─── Gallery items — NO reveal, always visible ─── */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {visible.map((item, i) => (
            <div key={item.id} className="gallery-item break-inside-avoid"
              style={{ border: '1px solid rgba(201,168,76,0.12)' }}>

              {/* Gradient bg always renders — image on top if available */}
              <div
                className="gallery-placeholder w-full relative"
                style={{ background: item.gradient, height: `${HEIGHTS[i] ?? 260}px` }}
              >
                <img
                  src={`/images/${item.image_name}`}
                  alt={item.label}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Hover overlay */}
              <div className="gallery-overlay">
                <div>
                  <p className="font-display text-lg font-light" style={{ color: '#f0d080' }}>{item.label}</p>
                  <p className="font-body text-xs mt-1 leading-relaxed" style={{ color: 'rgba(232,220,200,0.7)' }}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCta && (
          <div className="text-center mt-14 reveal">
            <Link to="/gallery" className="btn-outline-gold inline-flex items-center gap-2">
              View Full Gallery <ArrowRightIcon size={16} color="#c9a84c" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
