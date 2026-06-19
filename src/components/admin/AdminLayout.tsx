import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { href: '/admin',              label: 'Dashboard',    icon: '▦' },
  { href: '/admin/reservations', label: 'Reservations', icon: '📅' },
  { href: '/admin/menu',         label: 'Menu',         icon: '🍽' },
  { href: '/admin/categories',   label: 'Categories',   icon: '≡'  },
  { href: '/admin/gallery',      label: 'Gallery',      icon: '🖼' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '★'  },
  { href: '/admin/contacts',     label: 'Messages',     icon: '✉'  },
  { href: '/admin/settings',     label: 'Settings',     icon: '⚙'  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => { await signOut(); navigate('/admin/login'); };
  const isActive = (href: string) => href==='/admin' ? location.pathname==='/admin' : location.pathname.startsWith(href);

  return (
    <div className="min-h-screen flex" style={{background:'#0a0a0a',fontFamily:'Lato,sans-serif'}}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{background:'rgba(0,0,0,0.7)'}}
          onClick={()=>setSidebarOpen(false)}/>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}
        style={{width:'240px',background:'#111',borderRight:'1px solid rgba(201,168,76,0.15)',flexShrink:0}}>

        <div style={{padding:'20px 20px 16px',borderBottom:'1px solid rgba(201,168,76,0.1)'}}>
          <Link to="/" target="_blank" style={{textDecoration:'none'}}>
            <p style={{fontFamily:'Cormorant Garamond,serif',fontSize:'22px',fontWeight:300,color:'#c9a84c',lineHeight:1}}>Bella Vista</p>
            <p style={{fontSize:'9px',letterSpacing:'3px',color:'rgba(201,168,76,0.5)',textTransform:'uppercase',marginTop:'2px'}}>Admin Panel</p>
          </Link>
        </div>

        <nav style={{flex:1,paddingTop:'8px',overflowY:'auto'}}>
          {NAV.map(({href,label,icon})=>(
            <Link key={href} to={href} onClick={()=>setSidebarOpen(false)}
              style={{display:'flex',alignItems:'center',gap:'12px',padding:'11px 18px',fontSize:'13px',textDecoration:'none',transition:'all 0.2s',background:isActive(href)?'rgba(201,168,76,0.12)':'transparent',color:isActive(href)?'#c9a84c':'rgba(232,220,200,0.55)',borderLeft:isActive(href)?'2px solid #c9a84c':'2px solid transparent'}}>
              <span style={{fontSize:'15px',width:'20px',textAlign:'center'}}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div style={{padding:'14px 16px',borderTop:'1px solid rgba(201,168,76,0.1)'}}>
          <p style={{fontSize:'11px',color:'rgba(232,220,200,0.3)',marginBottom:'8px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</p>
          <button onClick={handleSignOut}
            style={{width:'100%',padding:'8px',fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer',background:'rgba(255,80,80,0.08)',color:'rgba(255,120,120,0.8)',border:'1px solid rgba(255,80,80,0.2)',transition:'all 0.2s',fontFamily:'Lato,sans-serif'}}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header style={{background:'#111',borderBottom:'1px solid rgba(201,168,76,0.12)',padding:'0 24px',height:'58px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
          <button className="lg:hidden" onClick={()=>setSidebarOpen(true)}
            style={{background:'none',border:'none',cursor:'pointer',color:'#c9a84c',fontSize:'20px'}}>☰</button>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'#4ade80'}}/>
            <span style={{fontSize:'11px',color:'rgba(232,220,200,0.4)',letterSpacing:'1px'}}>Live</span>
          </div>
          <Link to="/" target="_blank" style={{fontSize:'11px',color:'rgba(201,168,76,0.6)',letterSpacing:'1px',textDecoration:'none'}}
            onMouseEnter={e=>(e.currentTarget.style.color='#c9a84c')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(201,168,76,0.6)')}>
            View Website ↗
          </Link>
        </header>
        <main className="flex-1 overflow-auto" style={{padding:'28px 24px'}}>{children}</main>
      </div>
    </div>
  );
}
