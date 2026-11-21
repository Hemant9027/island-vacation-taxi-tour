import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Printer, MessageCircle, Home as HomeIcon, Search, CalendarDays, MapPin, Users, Ticket } from "lucide-react";
import { useBooking, type BookingRecord } from "@/lib/store";
import { BUSINESS, MSG, waLink } from "@/lib/data";
import { Btn, Eyebrow, DemoNote, usePageMeta, ease } from "@/components/ui";

export default function Confirmation() {
  usePageMeta(
    "Booking Confirmation (Demo) | Island Vacation Taxi & Tours Grenada",
    "Your demo booking reference with Island Vacation Taxi & Tours in Grenada. Demo reservations are not real bookings.",
    "Grenada taxi booking confirmation"
  );

  const location = useLocation();
  const navigate = useNavigate();
  const { bookings, findByRef, toast } = useBooking();
  const stateRef = (location.state as { ref?: string } | null)?.ref;

  const record: BookingRecord | undefined = useMemo(() => {
    if (stateRef) return findByRef(stateRef);
    if (bookings.length) return bookings[0];
    return undefined;
  }, [stateRef, bookings, findByRef]);

  useEffect(() => {
    if (!record && !stateRef) toast("No demo booking found yet — create one to see this screen.", "info");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!record) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-36 text-center">
        <Ticket size={26} className="mx-auto text-terracotta" />
        <h1 className="display-lg mt-5">No booking to show</h1>
        <p className="mt-4 text-cocoa-2">Nothing in this browser matches that reference yet.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Btn to="/booking" variant="solid">Start a booking</Btn>
          <Btn to="/my-booking" variant="outline">Look up a reference</Btn>
        </div>
      </div>
    );
  }

  const isQuote = record.kind === "quote";

  const wa = () =>
    waLink(
      isQuote
        ? MSG.tour({
            date: record.date ?? "",
            guests: record.passengers,
            interests: [record.service ?? "a Grenada experience"],
            pickup: record.pickup ?? "",
          })
        : MSG.booking(record.ref)
    );

  const rows: [string, string][] = [
    ["Reference", record.ref],
    ["Service", record.service ?? "—"],
    [
      "Date",
      record.date
        ? new Date(record.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : "—",
    ],
    ["Time", record.time ?? "—"],
    ["Passengers", String(record.passengers)],
    ["Luggage", String(record.luggage ?? "—")],
    ["Pickup", record.pickup ?? "—"],
    ["Drop-off", record.dropoff ?? "—"],
    ["Contact", `${record.name} · ${record.email} · ${record.phone}`],
    ["From", record.country ?? "—"],
    ["Flight / ship", [record.flight, record.cruise].filter(Boolean).join(" · ") || "—"],
    ["Notes", record.notes || "—"],
  ];

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="overflow-hidden rounded-[30px] border border-cocoa/12 bg-white/70"
      >
        <div className="relative bg-cocoa px-6 py-10 text-cream sm:px-10">
          <div className="grain absolute inset-0 opacity-30" aria-hidden />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div>
              <Eyebrow tone="cream">{isQuote ? "Quote request saved" : "Demo booking confirmed"}</Eyebrow>
              <h1 className="display-lg mt-4 text-cream">
                {isQuote ? "Your request is ready." : "You're on the list."}
              </h1>
              <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-cream/70">
                {isQuote
                  ? "Annie will confirm availability and pricing personally — nothing is committed yet."
                  : "This is a front-end demonstration. Your reservation is stored in this browser only."}
              </p>
            </div>
            <div className="rounded-2xl border border-cream/25 px-5 py-4 text-center">
              <span className="eyebrow block text-sun">Reference</span>
              <span className="mt-1.5 block font-display text-3xl font-light tabular-nums">{record.ref}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-light">Reservation summary</h2>
            <dl className="mt-5 divide-y divide-cocoa/10 overflow-hidden rounded-2xl border border-cocoa/12">
              {rows.map(([k, v]) => (
                <div key={k} className="flex gap-4 bg-cream-2/50 px-5 py-3">
                  <dt className="w-28 shrink-0 text-[0.6875rem] tracking-[0.16em] text-cocoa-3 uppercase">{k}</dt>
                  <dd className="min-w-0 flex-1 break-words text-[0.9375rem]">{v}</dd>
                </div>
              ))}
            </dl>
            <DemoNote className="mt-5">
              Demo bookings are not real reservations and no payment was processed. Annie confirms every trip by WhatsApp or phone
              on {BUSINESS.phoneDisplay}.
            </DemoNote>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[24px] border border-cocoa/12 bg-cream-2/70 p-6">
              <h2 className="font-display text-2xl font-light">What happens next</h2>
              <ol className="mt-5 space-y-4 text-[0.9375rem] text-cocoa-2">
                {[
                  "Send the details to Annie on WhatsApp — it is prefilled for you.",
                  "Annie confirms availability, the pickup point and the real price.",
                  "You get a personal confirmation, and that is your trip booked.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-[0.75rem] font-bold text-cream">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid gap-2.5">
                <Btn href={wa()} variant="terracotta" size="lg">
                  <MessageCircle size={16} /> Send to Annie on WhatsApp
                </Btn>
                <Btn onClick={() => window.print()} variant="outline">
                  <Printer size={16} /> Print this summary
                </Btn>
                <Btn to="/my-booking" variant="outline">
                  <Search size={16} /> Look up a booking
                </Btn>
                <Btn to="/" variant="solid">
                  <HomeIcon size={16} /> Return to homepage
                </Btn>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                [CalendarDays, record.date ?? "—"],
                [Users, `${record.passengers} pax`],
                [MapPin, (record.pickup ?? "—").split(",")[0]],
              ].map(([Icon, text], i) => {
                const I = Icon as typeof MapPin;
                return (
                  <div key={i} className="rounded-2xl border border-cocoa/12 bg-white/60 px-3 py-4">
                    <I size={15} className="mx-auto text-sea" />
                    <span className="mt-2 block truncate text-[0.75rem] text-cocoa-2">{text as string}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.875rem] text-cocoa-3">
          Saved references:{" "}
          {bookings.slice(0, 4).map((b, i) => (
            <span key={b.ref}>
              {i > 0 && ", "}
              <Link to="/my-booking" className="font-medium text-terracotta underline underline-offset-4">
                {b.ref}
              </Link>
            </span>
          ))}
        </p>
        <Btn onClick={() => navigate("/build-your-tour")} variant="outline">
          Plan another day
        </Btn>
      </div>

      <p className="mt-6 flex items-center gap-2 text-[0.8125rem] text-cocoa-3">
        <Check size={14} className="text-sea" /> Stored in localStorage on this device only — nothing was transmitted.
      </p>
    </div>
  );
}
