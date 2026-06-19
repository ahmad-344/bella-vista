import { useState } from 'react';
import { useMenuData, DbMenuItem } from '../../hooks/useSupabaseData';
import { useCategoriesData } from '../../hooks/useSupabaseData';

const DIETARY: Record<string,{label:string;color:string}> = {
  'vegan':       {label:'V',  color:'#6dbf67'},
  'gluten-free': {label:'GF', color:'#e8c56d'},
  'spicy':       {label:'S',  color:'#e87060'},
};

const CAT_GRADIENT: Record<string,string> = {
  antipasti:'linear-gradient(135deg,#2d1a00,#5c3a00)',
  pasta:'linear-gradient(135deg,#1a0a12,#3d1520)',
  pizza:'linear-gradient(135deg,#1a1000,#3d2c00)',
  mains:'linear-gradient(135deg,#0a1a0a,#1e3d18)',
  desserts:'linear-gradient(135deg,#1a0c18,#3d1a38)',
  drinks:'linear-gradient(135deg,#0a0f1a,#1a2038)',
};

// ── Menu Item Modal ───────────────────────────────
function MenuModal({ item, onClose }: { item: DbMenuItem; onClose: () => void }) {
  const gradient = CAT_GRADIENT[item.category.toLowerCase()] ?? CAT_GRADIENT['antipasti'];
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}
      onClick={onClose}>
      <div style={{background:'#111',border:'1px solid rgba(201,168,76,0.3)',width:'100%',maxWidth:'480px',overflow:'hidden',boxShadow:'0 30px 80px rgba(0,0,0,0.8)'}}
        onClick={e=>e.stopPropagation()}>
        {/* Image */}
        <div style={{height:'260px',background:gradient,position:'relative',overflow:'hidden'}}>
          <img src={`/images/${item.image_name}`} alt={item.name}
            style={{width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}}
            onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none';}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 50%)'}}/>
          {item.is_signature && (
            <div style={{position:'absolute',top:16,right:16,padding:'4px 12px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',fontSize:'9px',letterSpacing:'2px',fontWeight:700,fontFamily:'Lato,sans-serif',textTransform:'uppercase'}}>
              Signature
            </div>
          )}
          <button onClick={onClose}
            style={{position:'absolute',top:16,left:16,width:32,height:32,borderRadius:'50%',background:'rgba(0,0,0,0.6)',border:'1px solid rgba(255,255,255,0.2)',color:'#fff',fontSize:'18px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>
            ×
          </button>
        </div>
        {/* Content */}
        <div style={{padding:'24px'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px',marginBottom:'8px'}}>
            <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'24px',fontWeight:300,color:'#f0d080',lineHeight:1.2}}>{item.name}</h2>
            <div style={{textAlign:'right',flexShrink:0}}>
              <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',color:'#c9a84c'}}>{item.price.toLocaleString()}</p>
              <p style={{fontSize:'10px',color:'rgba(201,168,76,0.5)',fontFamily:'Lato,sans-serif'}}>PKR</p>
            </div>
          </div>
          {/* Dietary tags */}
          {item.dietary && item.dietary.length > 0 && (
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px'}}>
              {item.dietary.map(d=>(
                <span key={d} style={{padding:'2px 8px',fontSize:'10px',fontWeight:700,fontFamily:'Lato,sans-serif',background:`${DIETARY[d]?.color??''}22`,color:DIETARY[d]?.color,border:`1px solid ${DIETARY[d]?.color??''}44`,borderRadius:'2px'}}>
                  {DIETARY[d]?.label} {d}
                </span>
              ))}
            </div>
          )}
          <p style={{fontFamily:'Lato,sans-serif',fontSize:'13px',color:'rgba(232,220,200,0.65)',lineHeight:1.8,marginBottom:'20px'}}>{item.description}</p>
          <a href="/reservations"
            style={{display:'block',width:'100%',padding:'13px',background:'linear-gradient(135deg,#c9a84c,#f0d080)',color:'#0c0c0c',textAlign:'center',fontFamily:'Lato,sans-serif',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,textDecoration:'none',transition:'all 0.3s ease'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(201,168,76,0.4)';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='';}}>
            Reserve a Table
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FullMenu() {
  const { items, loading } = useMenuData();
  const { cats } = useCategoriesData();
  const [active,        setActive]      = useState('');
  const [transitioning, setTransition]  = useState(false);
  const [selectedItem,  setSelectedItem] = useState<DbMenuItem|null>(null);
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);

  // Set active tab once cats load
  const activeTab = active || (cats[0] ?? 'Antipasti');

  const switchTab = (cat: string) => {
    if (cat === activeTab) return;
    setTransition(true);
    setTimeout(() => { setActive(cat); setTransition(false); }, 200);
  };

  const toggleDietary = (d: string) => {
    setDietaryFilter(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);
  };

  const filtered = items.filter(i => {
    if (i.category !== activeTab) return false;
    if (dietaryFilter.length === 0) return true;
    return dietaryFilter.every(d => i.dietary?.includes(d));
  });

  const gradient = CAT_GRADIENT[activeTab.toLowerCase()] ?? CAT_GRADIENT['antipasti'];

  return (
    <section className="bg-[#0f0f0f] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-14">
          <p className="font-script text-3xl mb-4 reveal" style={{color:'#c9a84c'}}>Every dish, a story</p>
          <div className="flex items-center justify-center gap-4 mb-6 reveal" style={{transitionDelay:'0.1s'}}>
            <div className="h-px w-10" style={{background:'linear-gradient(90deg,transparent,#c9a84c)'}}/>
            <div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45"/>
            <div className="h-px w-10" style={{background:'linear-gradient(90deg,#c9a84c,transparent)'}}/>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-light reveal" style={{color:'#f0d080',transitionDelay:'0.2s'}}>Our Menu</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-6 reveal">
          {cats.map(cat=>(
            <button key={cat} onClick={()=>switchTab(cat)}
              className="relative font-body text-xs tracking-[2px] uppercase px-5 py-3 transition-colors duration-300"
              style={{color:activeTab===cat?'#c9a84c':'rgba(232,220,200,0.42)',background:'none',border:'none',cursor:'pointer'}}>
              {cat}
              {activeTab===cat&&<span className="absolute bottom-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#c9a84c,transparent)'}}/>}
            </button>
          ))}
        </div>

        {/* Dietary filters — clickable */}
        <div className="flex flex-wrap items-center gap-3 justify-center mb-8 reveal">
          <span className="font-body text-xs tracking-[1px] uppercase" style={{color:'rgba(232,220,200,0.3)'}}>Filter:</span>
          {Object.entries(DIETARY).map(([key,{label,color}])=>{
            const active = dietaryFilter.includes(key);
            return (
              <button key={key} onClick={()=>toggleDietary(key)}
                className="flex items-center gap-2 transition-all duration-200"
                style={{background:'none',border:'none',cursor:'pointer',padding:'4px 10px',borderRadius:'2px',background: active?`${color}22`:'transparent',border:`1px solid ${active?color:'rgba(255,255,255,0.1)'}`}}>
                <span className="font-body text-[10px] font-bold px-1"
                  style={{background:`${color}22`,color,border:`1px solid ${color}44`,borderRadius:'2px'}}>{label}</span>
                <span className="font-body text-xs capitalize" style={{color:active?color:'rgba(232,220,200,0.38)'}}>{key}</span>
              </button>
            );
          })}
          {dietaryFilter.length>0&&(
            <button onClick={()=>setDietaryFilter([])}
              style={{background:'none',border:'1px solid rgba(255,80,80,0.25)',color:'rgba(255,80,80,0.6)',fontSize:'10px',letterSpacing:'1px',padding:'4px 8px',cursor:'pointer',fontFamily:'Lato,sans-serif'}}>
              Clear ×
            </button>
          )}
        </div>

        {/* Items */}
        <div style={{opacity:transitioning?0:1,transform:transitioning?'translateY(8px)':'translateY(0)',transition:'opacity 0.2s ease,transform 0.2s ease'}}>
          {loading ? (
            <div className="text-center py-16" style={{color:'rgba(232,220,200,0.3)',fontSize:'13px'}}>Loading menu…</div>
          ) : filtered.length===0 ? (
            <div className="text-center py-12" style={{color:'rgba(232,220,200,0.3)',fontSize:'13px'}}>No items match the selected filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {filtered.map(item=>(
                <div key={item.id} className="menu-item-row flex items-center gap-4 py-4 cursor-pointer"
                  style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}
                  onClick={()=>setSelectedItem(item)}>
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden relative"
                    style={{background:gradient,border:'1px solid rgba(201,168,76,0.18)'}}>
                    {item.image_name&&(
                      <img src={`/images/${item.image_name}`} alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none';}}/>
                    )}
                  </div>
                  {/* Name + desc */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-base font-semibold" style={{color:'#e8dcc8'}}>{item.name}</span>
                      {item.dietary?.map(d=>(
                        <span key={d} style={{padding:'1px 5px',fontSize:'9px',fontWeight:700,fontFamily:'Lato,sans-serif',background:`${DIETARY[d]?.color??''}22`,color:DIETARY[d]?.color,border:`1px solid ${DIETARY[d]?.color??''}44`,borderRadius:'2px'}}>
                          {DIETARY[d]?.label}
                        </span>
                      ))}
                      {item.is_signature&&(
                        <span style={{padding:'1px 6px',fontSize:'9px',letterSpacing:'1px',textTransform:'uppercase',fontFamily:'Lato,sans-serif',background:'rgba(201,168,76,0.12)',color:'#c9a84c',border:'1px solid rgba(201,168,76,0.28)',borderRadius:'2px'}}>Chef's Pick</span>
                      )}
                    </div>
                    <p style={{fontFamily:'Lato,sans-serif',fontSize:'11px',color:'rgba(232,220,200,0.42)',lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
                      {item.description}
                    </p>
                  </div>
                  {/* Price */}
                  <div className="flex-shrink-0 text-right">
                    <span className="font-display text-base" style={{color:'#c9a84c'}}>{item.price.toLocaleString()}</span>
                    <span className="font-body text-[10px] block" style={{color:'rgba(201,168,76,0.45)'}}>PKR</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center font-body text-xs mt-12 reveal" style={{color:'rgba(232,220,200,0.28)',lineHeight:1.9}}>
          Click any dish to view details. All prices inclusive of taxes. Menu subject to seasonal change.
        </p>
      </div>

      {/* Item Modal */}
      {selectedItem && <MenuModal item={selectedItem} onClose={()=>setSelectedItem(null)}/>}
    </section>
  );
}
