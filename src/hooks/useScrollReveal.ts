import { useEffect, useRef, RefObject } from 'react';

// ============================================
// useScrollReveal — IntersectionObserver reveal
// ============================================
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const els = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ============================================
// useParallax — scroll-based CSS transform
// ============================================
export function useParallax(ref: RefObject<HTMLElement>, speed = 0.4) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      el.style.transform = `translateY(${window.scrollY * speed}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref, speed]);
}

// ============================================
// useNavbarScroll — transparent ➜ solid
// ============================================
export function useNavbarScroll(threshold = 80) {
  const isScrolled = useRef(false);
  useEffect(() => {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;
    const onScroll = () => {
      const solid = window.scrollY > threshold;
      if (solid !== isScrolled.current) {
        isScrolled.current = solid;
        navbar.classList.toggle('navbar-solid', solid);
        navbar.classList.toggle('navbar-transparent', !solid);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
}
