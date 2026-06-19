import { useEffect } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSettings } from '../contexts/SettingsContext';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using the Bella Vista website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website. We reserve the right to modify these terms at any time.`,
  },
  {
    title: '2. Reservation Policy',
    content: `Reservations made through our website are subject to availability. A reservation constitutes an agreement to dine at the specified date and time. We reserve the right to cancel reservations that have not been confirmed within 24 hours of the reservation time.`,
  },
  {
    title: '3. Cancellation & Rescheduling',
    content: `We request a minimum of 24 hours notice for cancellations or rescheduling. Cancellations made less than 24 hours before the reservation time may incur a cancellation fee. For last-minute changes, please contact us directly by phone.`,
  },
  {
    title: '4. No-Show Policy',
    content: `Guests who fail to arrive for their reservation without prior notice (no-show) may be subject to a fee. Repeated no-shows may result in the inability to make future reservations through our online system.`,
  },
  {
    title: '5. Special Dietary Requirements',
    content: `While we endeavour to accommodate dietary requirements and allergies, we cannot guarantee that our kitchen is entirely free from specific allergens. Please inform us of any severe allergies at the time of booking and when ordering.`,
  },
  {
    title: '6. Intellectual Property',
    content: `All content on this website, including text, images, logos, and design, is the intellectual property of Bella Vista and is protected by applicable copyright laws. Reproduction or distribution without written permission is prohibited.`,
  },
  {
    title: '7. Limitation of Liability',
    content: `Bella Vista shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website or our services. Our maximum liability shall not exceed the value of the reservation in question.`,
  },
  {
    title: '8. Governing Law',
    content: `These terms are governed by the laws of Pakistan. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Islamabad.`,
  },
  {
    title: '9. Contact',
    content: `For any questions regarding these Terms of Use, please contact our management team through the contact page or visit us at our restaurant during business hours.`,
  },
];

export default function TermsOfUsePage() {
  useScrollReveal();
  const { settings } = useSettings();
  useEffect(() => { document.title = 'Terms of Use — Bella Vista'; }, []);

  return (
    <main className="bg-[#0c0c0c]">
      <section className="relative pt-40 pb-16 px-6 text-center overflow-hidden"
        style={{background:'radial-gradient(ellipse at 50% 0%,#1a0a12 0%,#0c0c0c 70%)'}}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)'}}/>
        <div className="max-w-2xl mx-auto reveal">
          <p className="font-script text-3xl mb-4" style={{color:'#c9a84c'}}>Legal</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10" style={{background:'linear-gradient(90deg,transparent,#c9a84c)'}}/><div className="w-1.5 h-1.5 bg-[#c9a84c] rotate-45"/><div className="h-px w-10" style={{background:'linear-gradient(90deg,#c9a84c,transparent)'}}/>
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-light mb-4" style={{color:'#f0d080'}}>Terms of Use</h1>
          <p className="font-body text-xs tracking-[2px]" style={{color:'rgba(232,220,200,0.4)'}}>Effective date: {new Date().toLocaleDateString('en-PK',{year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
      </section>

      <section className="py-16 px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="reveal mb-10 p-6" style={{border:'1px solid rgba(201,168,76,0.15)',background:'rgba(201,168,76,0.03)'}}>
            <p className="font-body text-sm leading-relaxed" style={{color:'rgba(232,220,200,0.65)',lineHeight:1.9}}>
              Welcome to <strong style={{color:'#c9a84c'}}>{settings.restaurant_name}</strong>. Please read these Terms of Use carefully before using our website or making a reservation. Your use of our services constitutes acceptance of these terms.
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
            <h2 className="font-display text-xl font-semibold mb-3" style={{color:'#f0d080'}}>Questions?</h2>
            <p className="font-body text-sm mb-4" style={{color:'rgba(232,220,200,0.6)'}}>If you have any questions about these terms, please do not hesitate to contact us.</p>
            <div className="space-y-2">
              <p className="font-body text-sm" style={{color:'rgba(232,220,200,0.6)'}}>Email: <a href={`mailto:${settings.email}`} style={{color:'#c9a84c'}}>{settings.email}</a></p>
              <p className="font-body text-sm" style={{color:'rgba(232,220,200,0.6)'}}>Phone: <a href={`tel:${settings.phone}`} style={{color:'#c9a84c'}}>{settings.phone}</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
