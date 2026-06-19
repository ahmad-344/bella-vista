import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ArrowRightIcon, LeafIcon, ChefHatIcon, WineGlassIcon } from '../assets/svgs/Icons';

const TIMELINE = [
  { year: '2009', title: 'Born in Naples',         text: "Our head chef Marco Esposito begins his culinary journey as an apprentice in a traditional Neapolitan trattoria, under the guidance of the legendary Signora Conti." },
  { year: '2014', title: 'Training Across Italy',   text: "Five years traversing Italy's greatest kitchens — from the risotto halls of Milan to the seafood trattorias of Sicily — refining technique and collecting the stories of every nonna he meets." },
  { year: '2019', title: 'Islamabad Calls',         text: "Recognising the hunger for authentic Italian fine dining in Pakistan, Marco arrives in Islamabad with a suitcase full of recipes, a palate honed across a continent, and a dream." },
  { year: '2021', title: 'Bella Vista Opens',       text: "The doors of Bella Vista open in the heart of Blue Area. From the first evening, guests are transported — the scent of truffle, the sound of piano, the glimmer of candlelight." },
  { year: '2024', title: 'Recognition & Growth',    text: "Three consecutive years named Islamabad's finest Italian restaurant. A wine list grown to 200+ labels. A private dining room that has hosted proposals, anniversaries and landmark business dinners." },
];

const VALUES = [
  { Icon: LeafIcon,      title: 'Provenance',   text: 'We know the name of every farm and supplier. Ingredients are chosen for their story as much as their flavour.' },
  { Icon: ChefHatIcon,   title: 'Craft',        text: 'Every pasta hand-rolled at dawn. Every sauce slow-cooked for hours. Speed has no place in our kitchen — only patience and passion.' },
  { Icon: WineGlassIcon, title: 'Hospitality',  text: 'Italian hospitality is not a service — it is a philosophy. Every guest is family. Every evening, a celebration at the table.' },
];

export default function OurStoryPage() {
  useScrollReveal();
  useEffect(() => { document.title = 'Our Story — Bella Vista'; }, []);

  return (
    <main className="bg-[#0c0c0c]">

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,#2d0a12 0%,#0c0c0c 70%)' }}>
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)' }} />
        <div className="max-w-3xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{ color: '#c9a84c' }}>Est. 2021</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-light mb-6" style={{ color: '#f0d080' }}>Our Story</h1>
          <p className="font-body text-base" style={{ color: 'rgba(232,220,200,0.55)', lineHeight: 1.9 }}>
            A tale of passion, tradition, and the relentless pursuit of perfection — from a Neapolitan kitchen to the heart of Islamabad.
          </p>
        </div>
      </section>

      {/* Chef intro */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Chef photo */}
          <div className="reveal-left relative overflow-hidden"
            style={{ height: '480px', border: '1px solid rgba(201,168,76,0.2)', background: 'linear-gradient(135deg,#2d0a12 0%,#4a1520 45%,#1a0808 100%)' }}>
            {/* Real image - shows if available, gradient shows as fallback */}
            <img src="/images/chef_marco.jpg" alt="Chef Marco Esposito"
              className="absolute inset-0 w-full h-full object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)' }} />
            {/* Fallback letter if no image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-display text-9xl" style={{ color: 'rgba(201,168,76,0.08)' }}>M</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="font-display text-2xl font-light" style={{ color: '#f0d080' }}>Chef Marco Esposito</p>
              <p className="font-body text-xs tracking-[2px] uppercase mt-1" style={{ color: 'rgba(201,168,76,0.6)' }}>
                Executive Chef &amp; Co-Founder
              </p>
            </div>
          </div>

          {/* Text */}
          <div className="reveal-right space-y-6">
            <p className="font-script text-3xl" style={{ color: '#c9a84c' }}>The Chef</p>
            <h2 className="font-display text-3xl lg:text-4xl font-light leading-tight" style={{ color: '#f0d080' }}>
              Fifteen years of Italy in every dish.
            </h2>
            <div className="h-px w-12 bg-[#c9a84c]" />
            {[
              "Marco Esposito grew up in the shadow of Vesuvius, where food is not a profession but a language — the way a family says 'I love you', the way a grandmother preserves memory, the way a city defines itself.",
              "After training under Michelin-starred chefs in Milan and Rome, and spending five years quietly learning the secrets of the Italian countryside, Marco arrived in Islamabad in 2019 with one mission: to bring the soul of Italy here.",
              '"I do not cook Italian food," Marco says. "I tell Italian stories. Every ingredient has a face, a farm, a season. Every dish has a memory attached to it. My job is to make sure that memory reaches your table intact."',
            ].map((para, i) => (
              <p key={i} className="font-body text-sm" style={{ color: 'rgba(232,220,200,0.62)', lineHeight: 1.9 }}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6" style={{ background: '#111' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="font-script text-3xl mb-4" style={{ color: '#c9a84c' }}>The Journey</p>
            <h2 className="font-display text-4xl font-light" style={{ color: '#f0d080' }}>From Naples to Islamabad</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom,transparent,rgba(201,168,76,0.3),transparent)' }} />
            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <div key={item.year}
                  className={`relative flex gap-8 lg:gap-0 reveal ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  style={{ transitionDelay: `${(i % 4) * 0.1}s` }}>
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
                    style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d080)', top: '4px' }}>
                    <span className="font-body text-[9px] font-bold" style={{ color: '#0c0c0c' }}>{item.year}</span>
                  </div>
                  <div className={`ml-16 lg:ml-0 ${i % 2 === 0 ? 'lg:pr-16 lg:text-right lg:w-1/2' : 'lg:pl-16 lg:w-1/2 lg:ml-auto'}`}>
                    <div className="p-6" style={{ border: '1px solid rgba(201,168,76,0.15)', background: 'rgba(201,168,76,0.03)' }}>
                      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: '#f0d080' }}>{item.title}</h3>
                      <p className="font-body text-sm" style={{ color: 'rgba(232,220,200,0.58)', lineHeight: 1.85 }}>{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-[#f5f0e8]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-script text-3xl mb-4 reveal" style={{ color: '#c9a84c' }}>What Drives Us</p>
          <h2 className="font-display text-4xl font-light mb-16 reveal" style={{ color: '#1a1a1a', transitionDelay: '0.1s' }}>Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map(({ Icon, title, text }, i) => (
              <div key={title} className="reveal p-8 text-center"
                style={{ border: '1px solid rgba(201,168,76,0.22)', background: 'rgba(255,255,255,0.65)', transitionDelay: `${(i + 1) * 0.1}s` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.28)' }}>
                  <Icon size={28} color="#c9a84c" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3" style={{ color: '#1a1a1a' }}>{title}</h3>
                <p className="font-body text-sm" style={{ color: 'rgba(26,26,26,0.58)', lineHeight: 1.85 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-[#0c0c0c]">
        <div className="max-w-xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{ color: '#c9a84c' }}>Come dine with us</p>
          <h2 className="font-display text-3xl font-light mb-8" style={{ color: '#f0d080' }}>The table is set. The wine is poured.</h2>
          <Link to="/reservations" className="btn-gold inline-flex items-center gap-2">
            Reserve Your Table <ArrowRightIcon size={16} color="#0c0c0c" />
          </Link>
        </div>
      </section>
    </main>
  );
}
