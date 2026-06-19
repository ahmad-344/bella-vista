import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { menuItems as localMenu } from '../data/menuData';
import { galleryItems as localGallery, testimonials as localTestimonials } from '../data/restaurantData';

// ── Types ──────────────────────────────────────────────────────────────────
export interface DbMenuItem {
  id: string; name: string; description: string; price: number;
  category: string; dietary: string[]; is_signature: boolean;
  is_available: boolean; image_name: string; sort_order: number;
}
export interface DbGalleryItem {
  id: string; label: string; description: string;
  image_name: string; gradient: string; sort_order: number;
}
export interface DbTestimonial {
  id: string; text: string; author: string; location: string; rating: number;
}

// ── Local data — initialised immediately so page never starts blank ───────
function getLocalMenu(): DbMenuItem[] {
  return localMenu.map(m => ({
    id: m.id, name: m.name, description: m.description, price: m.price,
    category: m.category, dietary: (m.dietary ?? []) as string[],
    is_signature: m.isSignature ?? false, is_available: true,
    image_name: `dish_${m.id}.jpg`, sort_order: 0,
  }));
}
function getLocalGallery(): DbGalleryItem[] {
  return localGallery.map(g => ({
    id: String(g.id), label: g.label, description: g.description,
    image_name: `gallery_${g.id}.jpg`, gradient: g.gradient, sort_order: g.id,
  }));
}
function getLocalTestimonials(): DbTestimonial[] {
  return localTestimonials.map(t => ({
    id: String(t.id), text: t.text, author: t.author,
    location: t.location, rating: t.rating,
  }));
}

// ── useMenuData ────────────────────────────────────────────────────────────
export function useMenuData() {
  const [items, setItems] = useState<DbMenuItem[]>(getLocalMenu);
  useEffect(() => {
    if (!supabase) return;
    supabase.from('menu_items').select('*').eq('is_available', true).order('sort_order')
      .then(({ data, error }) => { if (!error && data && data.length > 0) setItems(data); });
  }, []);
  return { items };
}

// ── useGalleryData ─────────────────────────────────────────────────────────
export function useGalleryData() {
  const [items, setItems] = useState<DbGalleryItem[]>(getLocalGallery);
  useEffect(() => {
    if (!supabase) return;
    supabase.from('gallery_items').select('*').eq('is_active', true).order('sort_order')
      .then(({ data, error }) => { if (!error && data && data.length > 0) setItems(data); });
  }, []);
  return { items };
}

// ── useTestimonialsData ────────────────────────────────────────────────────
export function useTestimonialsData() {
  const [items, setItems] = useState<DbTestimonial[]>(getLocalTestimonials);
  useEffect(() => {
    if (!supabase) return;
    supabase.from('testimonials').select('*').eq('is_active', true)
      .then(({ data, error }) => { if (!error && data && data.length > 0) setItems(data); });
  }, []);
  return { items };
}

// ── useCategoriesData ──────────────────────────────────────────────────────
export function useCategoriesData() {
  const [cats, setCats] = useState<string[]>(['Antipasti','Pasta','Pizza','Mains','Desserts','Drinks']);
  useEffect(() => {
    if (!supabase) return;
    supabase.from('categories').select('name').eq('is_active', true).order('sort_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setCats(data.map((c: { name: string }) => c.name));
        // If error (table missing), keep defaults — no crash
      });
  }, []);
  return { cats };
}

// ── useBookedSlots ─────────────────────────────────────────────────────────
export function useBookedSlots(date: string) {
  const [bookedSlots, setBooked] = useState<string[]>([]);
  useEffect(() => {
    if (!date || !supabase) return;
    supabase.from('reservations')
      .select('time').eq('date', date).in('status', ['pending','confirmed'])
      .then(({ data, error }) => {
        if (!error && data) setBooked(data.map((r: { time: string }) => r.time));
      });
  }, [date]);
  return { bookedSlots };
}

// ── saveReservationToSupabase ─────────────────────────────────────────────
export async function saveReservationToSupabase(data: {
  date: string; time: string; guests: string; seating: string;
  occasion: string; specialRequests: string;
  name: string; phone: string; email: string; source: string;
}): Promise<{ confirmationCode: string } | { error: string }> {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  if (!supabase) {
    try {
      const stored = JSON.parse(localStorage.getItem('bv_reservations') ?? '[]');
      const entry = { ...data, id: Date.now().toString(), confirmation_code: code, status: 'pending', created_at: new Date().toISOString() };
      localStorage.setItem('bv_reservations', JSON.stringify([entry, ...stored].slice(0, 10)));
    } catch { /* ignore */ }
    return { confirmationCode: code };
  }

  const { error } = await supabase.from('reservations').insert({
    confirmation_code: code, date: data.date, time: data.time,
    guests: data.guests, seating: data.seating, occasion: data.occasion,
    special_requests: data.specialRequests, name: data.name,
    phone: data.phone, email: data.email, source: data.source,
    status: 'pending',
  });

  if (error) return { error: error.message };
  return { confirmationCode: code };
}

// ── cancelReservationInSupabase ────────────────────────────────────────────
// Updates status to 'cancelled' in Supabase using confirmation_code
export async function cancelReservationInSupabase(code: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('confirmation_code', code);
}

// ── saveContactMessage ─────────────────────────────────────────────────────
// Saves to Supabase contact_messages table
export async function saveContactMessage(data: {
  name: string; email: string; subject: string; message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database not connected.' };

  const { error } = await supabase.from('contact_messages').insert(data);
  if (error) {
    console.error('contact_messages error:', error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}
