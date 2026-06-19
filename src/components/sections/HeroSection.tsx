import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScrollDownIcon, ArrowRightIcon } from '../../assets/svgs/Icons';

export default function HeroSection() {
  const contentRef  = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      el.style.opacity = String(Math.max(0, 1 - y / (vh * 0.55)));
      el.style.transform = `translateY(${y * 0.28}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    const nodes: HTMLDivElement[] = [];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 5 + 2;
      const alpha = (0.3 + Math.random() * 0.4).toFixed(2);
      Object.assign(p.style, {
        position: 'absolute', borderRadius: '50%',
        background: `radial-gradient(circle,rgba(201,168,76,${alpha}) 0%,transparent 70%)`,
        width: `${size}px`, height: `${size}px`,
        left: `${Math.random() * 100}%`,
        animation: `floatParticle ${8 + Math.random() * 14}s linear ${Math.random() * 10}s infinite`,
        pointerEvents: 'none',
      });
      container.appendChild(p);
      nodes.push(p);
    }
    return () => nodes.forEach(n => n.remove());
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0" style={{background:'radial-gradient(ellipse at 60% 40%,#2a0a12 0%,#1a0808 30%,#0c0c0c 70%)'}}/>
      <div className="absolute inset-0 z-0 opacity-25"
        style={{backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,backgroundSize:'300px 300px'}}/>
      <div className="absolute inset-0 z-0" style={{background:'radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.75) 100%)'}}/>
      <div ref={particlesRef} className="absolute inset-0 z-0 overflow-hidden"/>
      <div className="absolute top-0 left-0 right-0 h-px z-10" style={{background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)'}}/>
      <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.2),transparent)'}}/>

      {/* Content — vertically centered with extra bottom padding for scroll indicator */}
      <div className="flex-1 flex items-start justify-start pb-1000 pt-24 md:pt-28 lg:pt-24">
        <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{willChange:'opacity,transform'}}>

          <div className="flex items-center justify-center gap-3 mb-6"
            style={{opacity:0,animation:'fadeInUp 0.8s ease 0.2s forwards'}}>
            <span className="w-8 h-px bg-[#c9a84c]"/>
            <span className="font-body text-[11px] tracking-[4px] uppercase" style={{color:'#c9a84c'}}>Welcome to</span>
            <span className="w-8 h-px bg-[#c9a84c]"/>
          </div>

          <h1 className="font-display gold-shimmer leading-none mb-2"
            style={{fontSize:'clamp(62px,10vw,110px)',fontWeight:300,opacity:0,animation:'fadeInUp 1s ease 0.4s forwards'}}>
            Bella Vista
          </h1>

          <p className="font-script text-3xl lg:text-4xl mb-8"
            style={{color:'#e8dcc8',opacity:0,animation:'fadeInUp 0.8s ease 0.65s forwards'}}>
            Ristorante Italiano
          </p>

          <div className="flex items-center justify-center gap-4 mb-8"
            style={{opacity:0,animation:'fadeInUp 0.8s ease 0.85s forwards'}}>
            <div className="h-px w-16" style={{background:'linear-gradient(90deg,transparent,#c9a84c)'}}/>
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45"/>
            <div className="w-1 h-1 border border-[#c9a84c] rotate-45"/>
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45"/>
            <div className="h-px w-16" style={{background:'linear-gradient(90deg,#c9a84c,transparent)'}}/>
          </div>

          <p className="font-body font-light text-base lg:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
            style={{color:'rgba(232,220,200,0.72)',letterSpacing:'0.4px',opacity:0,animation:'fadeInUp 0.8s ease 1.05s forwards'}}>
            Where tradition meets modern Italian cuisine — crafted with love in the heart of Islamabad.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{opacity:0,animation:'fadeInUp 0.8s ease 1.25s forwards'}}>
            <Link to="/reservations" className="btn-gold">
              Reserve a Table <ArrowRightIcon size={16} color="#0c0c0c"/>
            </Link>
            <Link to="/menu" className="btn-outline-gold">View Our Menu</Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator — always at bottom, separate from content */}
      <div className="relative z-10 flex flex-col items-center pb-8"
        style={{opacity:0,animation:'fadeIn 1s ease 2s forwards'}}>
        <button onClick={()=>window.scrollTo({top:window.innerHeight,behavior:'smooth'})}
          className="flex flex-col items-center gap-2 bounce-down"
          style={{background:'none',border:'none',cursor:'pointer'}}>
          <span className="font-body text-[10px] tracking-[3px] uppercase" style={{color:'rgba(201,168,76,0.55)'}}>Scroll</span>
          <ScrollDownIcon size={28} color="rgba(201,168,76,0.65)"/>
        </button>
      </div>
    </section>
  );
}
