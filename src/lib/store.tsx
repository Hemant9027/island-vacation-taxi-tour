import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Draft = {
  service?: string;
  date?: string;
  time?: string;
  passengers: number;
  luggage: number;
  pickup?: string;
  dropoff?: string;
  flight?: string;
  cruise?: string;
  notes?: string;
  stops?: string[];
  length?: "half" | "full";
  ref?: string;
};

export type BookingRecord = Draft & {
  ref: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  kind: "booking" | "quote";
};

type Toast = { id: number; message: string; tone: "ok" | "info" | "warn" };

type Ctx = {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
  reset: () => void;
  bookings: BookingRecord[];
  saveBooking: (b: BookingRecord) => void;
  findByRef: (ref: string) => BookingRecord | undefined;
  toasts: Toast[];
  toast: (message: string, tone?: Toast["tone"]) => void;
  dismiss: (id: number) => void;
  itinerary: string[];
  setItinerary: (ids: string[]) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

const BOOKINGS_KEY = "ivt.bookings.v1";
const ITINERARY_KEY = "ivt.itinerary.v1";
const DRAFT_KEY = "ivt.draft.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<Draft>(() => read<Draft>(DRAFT_KEY, { passengers: 2, luggage: 2 }));
  const [bookings, setBookings] = useState<BookingRecord[]>(() => read<BookingRecord[]>(BOOKINGS_KEY, []));
  const [itinerary, setItineraryState] = useState<string[]>(() => read<string[]>(ITINERARY_KEY, []));
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch { /* ignore */ }
  }, [draft]);

  const update = useCallback((patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })), []);
  const reset = useCallback(() => setDraft({ passengers: 2, luggage: 2 }), []);

  const setItinerary = useCallback((ids: string[]) => {
    setItineraryState(ids);
    try {
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(ids));
    } catch { /* ignore */ }
  }, []);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message: string, tone: Toast["tone"] = "ok") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, tone }]);
      window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4600);
    },
    []
  );

  const saveBooking = useCallback((b: BookingRecord) => {
    setBookings((prev) => {
      const next = [b, ...prev.filter((x) => x.ref !== b.ref)].slice(0, 25);
      try {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const findByRef = useCallback(
    (ref: string) => bookings.find((b) => b.ref.toUpperCase() === ref.trim().toUpperCase()),
    [bookings]
  );

  const value = useMemo(
    () => ({ draft, update, reset, bookings, saveBooking, findByRef, toasts, toast, dismiss, itinerary, setItinerary }),
    [draft, update, reset, bookings, saveBooking, findByRef, toasts, toast, dismiss, itinerary, setItinerary]
  );

  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

export function makeRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `IVT-${s}`;
}
