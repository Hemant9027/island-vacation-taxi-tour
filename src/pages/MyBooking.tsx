import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ticket, ArrowRight, MessageCircle, Trash2 } from "lucide-react";
import { useBooking, type BookingRecord } from "@/lib/store";
import { MSG, waLink, BUSINESS } from "@/lib/data";
import { Btn, Eyebrow, DemoNote, usePageMeta, ease, inputCls, Field } from "@/components/ui";

function Card({ b, onOpen }: { b: BookingRecord; onOpen: (r: string) => void }) {
  return (
    <div className="rounded-[22px] border border-cocoa/12 bg-white/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="eyebrow text-cocoa-3">{b.kind === "quote" ? "Quote request" : "Demo booking"}</span>
          <p className="mt-1 font-display text-2xl font-light tabular-nums">{b.ref}</p>
        </div>
        <span className="rounded-full bg-cream-3 px-3 py-1 text-[0.6875rem] font-medium text-cocoa-2">
          {b.date ? new Date(b.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No date"}
        </span>
      </div>
      <dl className="mt-4 space-y-1.5 text-[0.875rem] text-cocoa-2">
        <div className="flex gap-3"><dt className="w-24 text-cocoa-3">Service</dt><dd className="min-w-0 flex-1 break-words">{b.service ?? "—"}</dd></div>
        <div className="flex gap-3"><dt className="w-24 text-cocoa-3">Guest</dt><dd className="min-w-0 flex-1 break-words">{b.name} · {b.passengers} pax</dd></div>
        <div className="flex gap-3"><dt className="w-24 text-cocoa-3">Route</dt><dd className="min-w-0 flex-1 break-words">{b.pickup ?? "—"} → {b.dropoff ?? "—"}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <Btn size="sm" variant="solid" onClick={() => onOpen(b.ref)}>View summary <ArrowRight size={14} /></Btn>
        <Btn size="sm" variant="outline" href={waLink(MSG.booking(b.ref))}>
          <MessageCircle size={14} /> WhatsApp
        </Btn>
      </div>
    </div>
  );
}

export default function MyBooking() {
  usePageMeta(
    "My Booking | Lookup a Demo Reservation — Island Vacation Taxi & Tours",
    "Look up your demo booking reference for Island Vacation Taxi & Tours in Grenada. Demo reservations are stored in this browser only.",
    "Grenada taxi booking lookup, Island Vacation Taxi reservation reference"
  );

  const { bookings, findByRef, toast } = useBooking();
  const [q, setQ] = useState("");
  const [result, setResult] = useState<BookingRecord | null | undefined>(undefined);

  const search = (e?: React.FormEvent) => {
    e?.preventDefault();
    const found = findByRef(q);
    if (!q.trim()) return toast("Enter your reference, e.g. IVT-7K2M9.", "warn");
    setResult(found ?? null);
    if (found) toast(`Found ${found.ref}.`, "ok");
    else toast("No booking matches that reference in this browser.", "warn");
  };

  const open = (ref: string) => {
    setQ(ref);
    setResult(findByRef(ref));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <Eyebrow>Reservation lookup</Eyebrow>
      <h1 className="display-lg mt-4 max-w-2xl">Find your demo booking.</h1>
      <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa-2">
        Enter the reference from your confirmation screen. Demo reservations live in this browser's local storage — a reference
        created elsewhere will not appear here.
      </p>

      <form
        onSubmit={search}
        className="mt-8 flex flex-col gap-3 rounded-[24px] border border-cocoa/12 bg-white/60 p-5 sm:flex-row sm:items-end"
      >
        <Field label="Booking reference" hint="e.g. IVT-7K2M9" className="flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value.toUpperCase())}
            placeholder="IVT-XXXXXX"
            className={`${inputCls} tracking-[0.12em]`}
          />
        </Field>
        <Btn type="submit" variant="terracotta" size="lg" className="sm:mb-0.5">
          <Search size={16} /> Look up
        </Btn>
      </form>

      <AnimatePresence mode="wait">
        {result === null && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mt-8 rounded-[24px] border border-dashed border-cocoa/25 px-6 py-14 text-center"
          >
            <Ticket size={24} className="mx-auto text-terracotta" />
            <p className="mt-3 font-display text-2xl font-light">No match for “{q}”</p>
            <p className="mx-auto mt-2 max-w-md text-[0.9375rem] text-cocoa-3">
              Check the reference, or start a new demo booking — references are stored per browser, per device.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Btn to="/booking" variant="solid">Start a booking</Btn>
              <Btn href={waLink(MSG.general("a booking reference"))} variant="outline">
                <MessageCircle size={15} /> Ask Annie
              </Btn>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            key={result.ref}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mt-8 grid gap-6 lg:grid-cols-12"
          >
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-[26px] border border-cocoa/12 bg-white/70">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-cocoa px-6 py-5 text-cream">
                  <div>
                    <span className="eyebrow text-sun">{result.kind === "quote" ? "Quote request" : "Demo booking"}</span>
                    <p className="mt-1 font-display text-3xl font-light tabular-nums">{result.ref}</p>
                  </div>
                  <span className="text-[0.75rem] text-cream/60">
                    {new Date(result.createdAt).toLocaleString("en-GB")}
                  </span>
                </div>
                <dl className="divide-y divide-cocoa/10">
                  {[
                    ["Service", result.service ?? "—"],
                    ["Date & time", `${result.date ?? "—"} · ${result.time ?? "—"}`],
                    ["Passengers", `${result.passengers} · ${result.luggage ?? "—"} bags`],
                    ["Pickup", result.pickup ?? "—"],
                    ["Drop-off", result.dropoff ?? "—"],
                    ["Contact", `${result.name} · ${result.email}`],
                    ["Phone", result.phone],
                    ["Country", result.country ?? "—"],
                    ["Details", [result.flight, result.cruise].filter(Boolean).join(" · ") || "—"],
                    ["Notes", result.notes || "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-4 px-6 py-3">
                      <dt className="w-28 shrink-0 text-[0.6875rem] tracking-[0.16em] text-cocoa-3 uppercase">{k}</dt>
                      <dd className="min-w-0 flex-1 break-words text-[0.9375rem]">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <DemoNote className="mt-4">Demo reservation — not a real booking, and no payment was taken.</DemoNote>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[26px] bg-cocoa p-6 text-cream">
                <h2 className="font-display text-2xl font-light">Confirm with Annie</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-cream/70">
                  Send this reference to {BUSINESS.phoneDisplay} so Annie can match it to your trip and confirm the real details.
                </p>
                <div className="mt-5 grid gap-2.5">
                  <Btn href={waLink(MSG.booking(result.ref))} variant="cream">
                    <MessageCircle size={16} /> Send reference on WhatsApp
                  </Btn>
                  <Btn to="/booking" variant="outline" className="border-cream/30 text-cream hover:bg-cream hover:text-cocoa">
                    Make another booking
                  </Btn>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {bookings.length > 0 && (
        <section aria-labelledby="recent-heading" className="mt-14 border-t border-cocoa/12 pt-10">
          <h2 id="recent-heading" className="font-display text-2xl font-light">Recent demo reservations on this device</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {bookings.map((b) => (
              <Card key={b.ref} b={b} onOpen={open} />
            ))}
          </div>
          <p className="mt-6 text-[0.8125rem] text-cocoa-3">
            Stored with localStorage · <Link to="/booking" className="text-terracotta underline underline-offset-4">create another</Link>
          </p>
        </section>
      )}

      {bookings.length === 0 && result === undefined && (
        <div className="mt-14 rounded-[24px] border border-dashed border-cocoa/25 px-6 py-12 text-center">
          <Trash2 size={20} className="mx-auto text-cocoa-3" />
          <p className="mt-3 font-display text-xl font-light">No demo bookings on this device yet</p>
          <Btn to="/booking" variant="outline" size="sm" className="mt-5">Create one</Btn>
        </div>
      )}
    </div>
  );
}
