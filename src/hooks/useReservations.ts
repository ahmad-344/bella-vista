import { useState, useCallback } from 'react';
import { Reservation } from '../types';

const STORAGE_KEY = 'bv_reservations';
const MAX_RESERVATIONS = 5;

function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function readStorage(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reservation[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(data: Reservation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(readStorage);

  const saveReservation = useCallback(
    (data: Omit<Reservation, 'id' | 'confirmationCode' | 'createdAt'>): Reservation => {
      const newItem: Reservation = {
        ...data,
        id: Date.now().toString(),
        confirmationCode: genCode(),
        createdAt: new Date().toISOString(),
      };
      setReservations((prev) => {
        const updated = [newItem, ...prev].slice(0, MAX_RESERVATIONS);
        writeStorage(updated);
        return updated;
      });
      return newItem;
    },
    []
  );

  const clearReservations = useCallback(() => {
    setReservations([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* empty */ }
  }, []);

  return { reservations, saveReservation, clearReservations };
}
