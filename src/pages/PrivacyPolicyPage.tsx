import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSettings } from '../contexts/SettingsContext';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `When you make a reservation or contact us, we collect personal information including your name, email address, phone number, and dining preferences. We also collect technical data such as browser type and pages visited to improve our website experience.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to process and confirm reservations, send booking confirmations, contact you regarding your reservation, improve our services, and occasionally send promotional content (only with your consent). We do not sell your personal data to third parties.`,
  },
  {
    title: '3. Data Retention',
    content: `Reservation records are retained for a period of 2 years for operational purposes. Contact enquiries are retained for 1 year. You may request deletion of your personal data at any time by contacting us.`,
  },
  {
    title: '4. Cookies',
    content: `Our website uses essential cookies to ensure basic website functionality. We do not use tracking or advertising cookies. By continuing to use our website, you consent to our use of essential cookies.`,
  },
  {
    title: '5. Data Security',
    content: `We take reasonable measures to protect your personal information using industry-standard encryption and secure database storage. However, no method of transmission over the Internet is 100% secure.`,
  },
  {
    title: '6. Your Rights',
    content: `You have the right to access, correct, or request deletion of your personal information. To exercise these rights, please contact us at the email address provided below.`,
  },
  {
    title: '7. Third-Party Services',
    content: `We use Supabase for secure database management. Your data is processed in accordance with Supabase's privacy policy. We do not share your data with any other third parties without your explicit consent.`,
  },
  {
    title: '8. Contact Us',
    content: `For any privacy-related concerns or requests, please contact us directly through our contact page or by visiting our restaurant.`,
  },
];

export default function PrivacyPolicyPage() {
  useScrollReveal();
  const { settings } = useSettings();
  useEffect(() => { document.title = 'Privacy Policy — Bella Vista'; }, []);

  return (
    <main className="bg-[#0c0c0c]">
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden"
        style={{background:'radial-gradient(ellipse at 50% 0%,#0a0f1a 0%,#0c0c0c 70%)'}}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)'}}/>
        <div className="max-w-2xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{color:'#c9a84c'}}>Legal</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10" style={{background:'linear-gradient(90deg,transparent,#c9a84c)'}}/><div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45"/><div className="h-px w-10" style={{background:'linear-gradient(90deg,#c9a84c,transparent)'}}/>
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-light mb-4" style={{color:'#f0d080'}}>Privacy Policy</h1>
          <p className="font-body text-xs tracking-[2px]" style={{color:'rgba(232,220,200,0.4)'}}>Last updated: {new Date().toLocaleDateString('en-PK',{year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
      </section>

      <section className="py-16 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-10 p-6" style={{border:'1px solid rgba(201,168,76,0.15)',background:'rgba(201,168,76,0.03)'}}>
            <p className="font-body text-sm leading-relaxed" style={{color:'rgba(232,220,200,0.65)',lineHeight:1.9}}>
              At <strong style={{color:'#c9a84c'}}>{settings.restaurant_name}</strong>, we are committed to protecting your privacy and handling your personal information with care and transparency. This policy outlines how we collect, use, and protect your data.
            </p>
          </div>

          <div className="space-y-8">
            {SECTIONS.map((section, i) => (
              <div key={i} className="reveal" style={{transitionDelay:`${i*0.05}s`}}>
                <h2 className="font-display text-xl font-semibold mb-4" style={{color:'#f0d080'}}>{section.title}</h2>
                <p className="font-body text-sm leading-relaxed" style={{color:'rgba(232,220,200,0.6)',lineHeight:1.9}}>{section.content}</p>
                <div className="mt-4 h-px" style={{background:'linear-gradient(90deg,rgba(201,168,76,0.15),transparent)'}}/>
              </div>
            ))}
          </div>

          <div className="mt-12 reveal p-6" style={{border:'1px solid rgba(201,168,76,0.15)',background:'rgba(201,168,76,0.03)'}}>
            <h2 className="font-display text-xl font-semibold mb-3" style={{color:'#f0d080'}}>Contact Information</h2>
            <div className="space-y-2">
              <p className="font-body text-sm" style={{color:'rgba(232,220,200,0.6)'}}>Email: <a href={`mailto:${settings.email}`} style={{color:'#c9a84c'}}>{settings.email}</a></p>
              <p className="font-body text-sm" style={{color:'rgba(232,220,200,0.6)'}}>Phone: <a href={`tel:${settings.phone}`} style={{color:'#c9a84c'}}>{settings.phone}</a></p>
              <p className="font-body text-sm" style={{color:'rgba(232,220,200,0.6)'}}>Address: {settings.address}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
