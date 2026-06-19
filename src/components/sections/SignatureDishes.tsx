import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenuData } from '../../hooks/useSupabaseData';
import { ArrowRightIcon } from '../../assets/svgs/Icons';

const GRADIENTS = [
  'linear-gradient(135deg,#3d0a18 0%,#6b1f35 40%,#2a0810 100%)',
  'linear-gradient(135deg,#2a1a00 0%,#5a3d00 40%,#3a2500 100%)',
  'linear-gradient(135deg,#0a2010 0%,#1a4020 40%,#0d2512 100%)',
];

interface DishInfo { name: string; description: string; price: number; imageName: string; }

function DishModal({ dish, onClose }: { dish: DishInfo; onClose: () => void }) {
  return (
    <div
      style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}
      onClick={onClose}
    >
      <div
        style={{ background:'#111',border:'1px solid rgba(201,168,76,0.35)',width:'100%',maxWidth:'460px',overflow:'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div style={{ height:'260px',background:GRADIENTS[0],position:'relative',overflow:'hidden' }}>
          <img src={`/images/${dish.imageName}`} alt={dish.name}
            style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.7),transparent 50%)' }} />
          <button onClick={onClose}
            style={{ position:'absolute',top:14,right:14,width:32,height:32,borderRadius:'50%',background:'rgba(0,0,0,0.6)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            ×
          </button>
          <span style={{ position:'absolute',top:14,left:14,padding:'3px 10px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',fontSize:'9px',letterSpacing:'2px',fontWeight:700,fontFamily:'Lato,sans-serif',textTransform:'uppercase' }}>
            Signature
          </span>
        </div>
        {/* Content */}
        <div style={{ padding:'24px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',marginBottom:'12px' }}>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'24px',fontWeight:300,color:'#f0d080',lineHeight:1.2 }}>{dish.name}</h2>
            <div style={{ textAlign:'right',flexShrink:0 }}>
              <p style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'22px',color:'#c9a84c' }}>{dish.price.toLocaleString()}</p>
              <p style={{ fontSize:'10px',color:'rgba(201,168,76,0.5)',fontFamily:'Lato,sans-serif' }}>PKR</p>
            </div>
          </div>
          <p style={{ fontFamily:'Lato,sans-serif',fontSize:'13px',color:'rgba(232,220,200,0.65)',lineHeight:1.8,marginBottom:'20px' }}>{dish.description}</p>
          <Link to="/reservations" onClick={onClose}
            style={{ display:'block',padding:'13px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',textAlign:'center',fontFamily:'Lato,sans-serif',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,textDecoration:'none' }}>
            Reserve a Table
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignatureDishes() {
  const { items } = useMenuData();   // starts with local data — never empty
  const [modal, setModal] = useState<DishInfo | null>(null);

  const signatures = items.filter(i => i.is_signature).slice(0, 3);
  const display: DishInfo[] = signatures.map(d => ({
    name: d.name, description: d.description,
    price: d.price, imageName: d.image_name,
  }));

  return (
    <section className="bg-[#0c0c0c] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header — static text, reveal works fine */}
        <div className="text-center mb-16">
          <p className="font-script text-3xl mb-3 reveal" style={{ color: '#c9a84c' }}>A taste of what awaits you</p>
          <div className="flex items-center justify-center gap-4 mb-6 reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#c9a84c)' }} />
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45" />
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#c9a84c,transparent)' }} />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-light reveal"
            style={{ color: '#f0d080', transitionDelay: '0.2s' }}>Chef's Signatures</h2>
        </div>

        {/* Cards — NO reveal, always visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {display.map((dish, i) => (
            <div
              key={dish.name}
              className="dish-card"
              style={{ border: '1px solid rgba(201,168,76,0.18)', background: '#111', cursor: 'pointer' }}
              onClick={() => setModal(dish)}
            >
              {/* Gradient bg always visible, image overlays it */}
              <div className="relative h-64 overflow-hidden" style={{ background: GRADIENTS[i] }}>
                <img
                  src={`/images/${dish.imageName}`}
                  alt={dish.name}
                  style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover' }}
                  loading="lazy"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <span style={{ position:'absolute',top:16,right:16,padding:'4px 12px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',fontSize:'9px',letterSpacing:'2px',fontWeight:700,fontFamily:'Lato,sans-serif',textTransform:'uppercase' }}>
                  Signature
                </span>
                <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'80px',background:'linear-gradient(to top,#111,transparent)' }} />
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl font-light mb-3" style={{ color: '#f0d080' }}>{dish.name}</h3>
                <p className="font-body text-sm mb-6" style={{ color: 'rgba(232,220,200,0.55)', lineHeight: 1.75 }}>{dish.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl" style={{ color: '#c9a84c' }}>PKR {dish.price.toLocaleString()}</span>
                  <Link to="/reservations"
                    className="font-body text-xs tracking-[2px] uppercase px-5 py-2.5 transition-all duration-300"
                    style={{ border:'1px solid rgba(201,168,76,0.35)',color:'#c9a84c' }}
                    onClick={e => e.stopPropagation()}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(201,168,76,0.1)'; (e.currentTarget as HTMLElement).style.borderColor='#c9a84c'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background=''; (e.currentTarget as HTMLElement).style.borderColor='rgba(201,168,76,0.35)'; }}>
                    Reserve
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14 reveal">
          <Link to="/menu" className="btn-outline-gold inline-flex items-center gap-2">
            Explore Full Menu <ArrowRightIcon size={16} color="#c9a84c" />
          </Link>
        </div>
      </div>

      {modal && <DishModal dish={modal} onClose={() => setModal(null)} />}
    </section>
  );
}
