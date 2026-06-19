import { GalleryItem, Testimonial } from '../types';

export const galleryItems: GalleryItem[] = [
  { id: 1,  label: 'The Main Dining Hall',   gradient: 'linear-gradient(135deg,#2d0a12 0%,#4a1520 50%,#1a0a08 100%)', description: 'Intimate candlelit tables beneath hand-painted Venetian ceilings.' },
  { id: 2,  label: "Chef's Open Kitchen",    gradient: 'linear-gradient(135deg,#1a0f00 0%,#3d2800 50%,#1a1200 100%)', description: 'Watch our brigade craft each dish with precision and passion.' },
  { id: 3,  label: 'The Wine Cellar Bar',    gradient: 'linear-gradient(135deg,#0a1a0a 0%,#1a3015 50%,#0c1508 100%)', description: 'Over 200 Italian labels curated by our resident sommelier.' },
  { id: 4,  label: 'Garden Terrace',         gradient: 'linear-gradient(135deg,#0f1a0a 0%,#263d1a 50%,#141f0c 100%)', description: 'Al fresco dining under jasmine canopies and fairy lights.' },
  { id: 5,  label: 'Private Dining Room',    gradient: 'linear-gradient(135deg,#1a0a1a 0%,#32153a 50%,#180c18 100%)', description: 'Exclusively yours for up to 20 guests — celebrations done right.' },
  { id: 6,  label: 'The Pasta Atelier',      gradient: 'linear-gradient(135deg,#1a1200 0%,#3d2e00 50%,#1a1800 100%)', description: 'Daily hand-rolling — tagliatelle, pappardelle, ravioli and more.' },
  { id: 7,  label: 'Dessert Showcase',       gradient: 'linear-gradient(135deg,#1a0c06 0%,#3d1e10 50%,#1a0e08 100%)', description: 'Pâtisserie crafted by our award-winning pastry chef.' },
  { id: 8,  label: 'Lounge & Aperitivo',     gradient: 'linear-gradient(135deg,#0a0f1a 0%,#152038 50%,#0c1220 100%)', description: 'Begin your evening with a Negroni and house-cured antipasti.' },
  { id: 9,  label: "Chef's Table",           gradient: 'linear-gradient(135deg,#0c0c0c 0%,#2a2215 50%,#0c0c0c 100%)', description: 'An 8-course journey — your private theatre with our head chef.' },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "The truffle tagliatelle was the most exquisite thing I've ever tasted. The ambiance is pure magic — golden candlelight, impeccable service. Bella Vista is now our family's celebration restaurant. We booked again before even leaving.",
    author: 'Amna S.',
    location: 'Islamabad',
    rating: 5,
  },
  {
    id: 2,
    text: "We celebrated our anniversary here and it exceeded every expectation. The wine pairing was masterful, the osso buco simply melted. The private dining room felt like dining in a palazzo. Truly world-class in every dimension.",
    author: 'Omar & Fatima R.',
    location: 'Lahore',
    rating: 5,
  },
  {
    id: 3,
    text: "As someone who has dined in Naples and Rome, I can honestly say Bella Vista stands among them. The authenticity, the quality of ingredients, the attention to detail — it is extraordinary. Islamabad is so lucky to have this.",
    author: 'Dr. Tariq M.',
    location: 'Islamabad',
    rating: 5,
  },
];

export const RESTAURANT_INFO = {
  name:      'Bella Vista',
  tagline:   'An Experience for All Your Senses.',
  address:   'Blue Area, Islamabad, Pakistan',
  phone:     '+92 51 234 5678',
  whatsapp:  '+923001234567',
  email:     'reservations@bellavista.pk',
  instagram: 'https://instagram.com/',
  facebook:  'https://facebook.com/',
  hours: {
    monThu: '12:00 PM — 10:00 PM',
    friSat: '12:00 PM — 11:30 PM',
    sun:    '1:00 PM — 10:00 PM',
  },
};
