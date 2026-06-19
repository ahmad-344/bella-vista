import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';

import Navbar  from './components/layout/Navbar';
import Footer  from './components/layout/Footer';
import HomePage         from './pages/HomePage';
import OurStoryPage     from './pages/OurStoryPage';
import MenuPage         from './pages/MenuPage';
import ReservationsPage from './pages/ReservationsPage';
import GalleryPage      from './pages/GalleryPage';
import ContactPage      from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage    from './pages/TermsOfUsePage';

import AdminLogin        from './pages/admin/AdminLogin';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminReservations from './pages/admin/AdminReservations';
import AdminMenu         from './pages/admin/AdminMenu';
import AdminGallery      from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminSettings     from './pages/admin/AdminSettings';
import AdminCategories   from './pages/admin/AdminCategories';
import AdminContacts     from './pages/admin/AdminContacts';
import AdminLayout       from './components/admin/AdminLayout';
import ProtectedRoute    from './components/admin/ProtectedRoute';

function ScrollRevealRefresh() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
      els.forEach(el => el.classList.remove('visible'));
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
      );
      els.forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  return null;
}

function AdminWrapper({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute><AdminLayout>{children}</AdminLayout></ProtectedRoute>;
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-[#e8dcc8]">
      <ScrollRevealRefresh/>
      <Navbar/>
      <Routes>
        <Route path="/"               element={<HomePage/>}/>
        <Route path="/our-story"      element={<OurStoryPage/>}/>
        <Route path="/menu"           element={<MenuPage/>}/>
        <Route path="/reservations"   element={<ReservationsPage/>}/>
        <Route path="/gallery"        element={<GalleryPage/>}/>
        <Route path="/contact"        element={<ContactPage/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
        <Route path="/terms-of-use"   element={<TermsOfUsePage/>}/>
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <p className="font-script text-5xl mb-4" style={{color:'#c9a84c'}}>Oops</p>
            <h1 className="font-display text-8xl font-light mb-4" style={{color:'#f0d080'}}>404</h1>
            <p className="font-body text-sm mb-10" style={{color:'rgba(232,220,200,0.5)'}}>This page has left the menu.</p>
            <a href="/" className="btn-gold">Return Home</a>
          </div>
        }/>
      </Routes>
      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login"        element={<AdminLogin/>}/>
            <Route path="/admin"              element={<AdminWrapper><AdminDashboard/></AdminWrapper>}/>
            <Route path="/admin/reservations" element={<AdminWrapper><AdminReservations/></AdminWrapper>}/>
            <Route path="/admin/menu"         element={<AdminWrapper><AdminMenu/></AdminWrapper>}/>
            <Route path="/admin/categories"   element={<AdminWrapper><AdminCategories/></AdminWrapper>}/>
            <Route path="/admin/gallery"      element={<AdminWrapper><AdminGallery/></AdminWrapper>}/>
            <Route path="/admin/testimonials" element={<AdminWrapper><AdminTestimonials/></AdminWrapper>}/>
            <Route path="/admin/contacts"     element={<AdminWrapper><AdminContacts/></AdminWrapper>}/>
            <Route path="/admin/settings"     element={<AdminWrapper><AdminSettings/></AdminWrapper>}/>
            <Route path="/*"                  element={<PublicLayout/>}/>
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
