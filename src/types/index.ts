// ============================================
// BELLA VISTA — TypeScript Types
// ============================================

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  dietary?: Array<'vegan' | 'gluten-free' | 'spicy'>;
  isSignature?: boolean;
}

export type MenuCategory =
  | 'Antipasti'
  | 'Pasta'
  | 'Pizza'
  | 'Mains'
  | 'Desserts'
  | 'Drinks';

export interface Reservation {
  id: string;
  confirmationCode: string;
  date: string;
  time: string;
  guests: string;
  seating: string;
  occasion: string;
  specialRequests: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  createdAt: string;
}

export interface ReservationStep1 {
  date: string;
  time: string;
  guests: string;
  seating: string;
  occasion: string;
  specialRequests: string;
}

export interface ReservationStep2 {
  name: string;
  phone: string;
  email: string;
  source: string;
  agreedToPolicy: boolean;
}

export interface GalleryItem {
  id: number;
  label: string;
  gradient: string;
  description: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  location: string;
  rating: number;
}
