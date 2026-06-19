import { LeafIcon, ChefHatIcon, WineGlassIcon } from '../../assets/svgs/Icons';

const PILLARS = [
  {
    Icon: LeafIcon,
    title: 'Fresh Daily',
    desc: 'Seasonal ingredients sourced every morning from trusted local farms and premium Italian importers.',
  },
  {
    Icon: ChefHatIcon,
    title: 'Expert Chefs',
    desc: 'Our executive chef brings 15 years of Naples to your table — every dish a labour of passion.',
  },
  {
    Icon: WineGlassIcon,
    title: 'Curated Wines',
    desc: 'Over 200 labels from Italian vineyards — Barolo to Brunello, paired by our resident sommelier.',
  },
];

export default function AboutStrip() {
  return (
    <section className="bg-[#f5f0e8] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">

        <p className="font-script text-3xl mb-4 reveal" style={{ color: '#c9a84c' }}>
          Our Philosophy
        </p>

        <div className="flex items-center justify-center gap-3 mb-8 reveal">
          <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
          <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
          <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
        </div>

        <h2 className="font-display text-3xl lg:text-5xl font-light leading-tight mb-8 reveal"
          style={{ color: '#1a1a1a', transitionDelay: '0.1s' }}>
          Food is not just fuel.
          <br />
          <em>It's culture, it's memory, it's passion.</em>
        </h2>

        <p className="font-body text-base max-w-2xl mx-auto mb-16 reveal"
          style={{ color: 'rgba(26,26,26,0.6)', lineHeight: 1.9, transitionDelay: '0.2s' }}>
          At Bella Vista, every dish tells the story of Italian <em>nonna's</em> kitchen — reborn
          with modern technique and the finest ingredients sourced daily. Our executive chef brings
          15 years of Naples to your table, channelling the soul of the Italian coast into every
          plate served in the heart of Islamabad.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className="reveal flex flex-col items-center gap-5 p-8 transition-all duration-400"
              style={{
                border: '1px solid rgba(201,168,76,0.2)',
                background: 'rgba(255,255,255,0.55)',
                transitionDelay: `${(i + 1) * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#c9a84c';
                el.style.background = 'rgba(255,255,255,0.9)';
                el.style.transform = 'translateY(-5px)';
                el.style.boxShadow = '0 18px 45px rgba(201,168,76,0.15)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(201,168,76,0.2)';
                el.style.background = 'rgba(255,255,255,0.55)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = '';
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)' }}>
                <Icon size={28} color="#c9a84c" />
              </div>
              <h3 className="font-display text-xl font-semibold" style={{ color: '#1a1a1a' }}>
                {title}
              </h3>
              <p className="font-body text-sm text-center" style={{ color: 'rgba(26,26,26,0.58)', lineHeight: 1.8 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
