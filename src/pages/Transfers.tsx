import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Info, Repeat, Luggage, Users, CalendarClock } from "lucide-react";
import { PLACES, VEHICLE_CLASSES, estimateFare, waLink, SLOT_TIMES } from "@/lib/data";
import { useBooking } from "@/lib/store";
import { Btn, Eyebrow, DemoNote, usePageMeta, ease, inputCls, Select, Field } from "@/components/ui";

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function Transfers() {
  usePageMeta(
    "Grenada Airport Transfers & Private Taxi Fares | Island Vacation Taxi & Tours",
    "Request a fare quote for Grenada airport transfers and private taxi rides — Maurice Bishop International Airport, Grand Anse, St. George's, cruise terminal and island-wide.",
    "Grenada airport transfers, private taxi Grenada, Maurice Bishop airport transfer, Grenada taxi fare quote"
  );

  const { update, toast } = useBooking();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("mbia");
  const [dropoff, setDropoff] = useState("grand-anse-hotels");
  const [date, setDate] = useState(todayPlus(5));
  const [time, setTime] = useState("13:00");
  const [pax, setPax] = useState(2);
  const [bags, setBags] = useState(2);
  const [roundTrip, setRoundTrip] = useState(false);
  const [notes, setNotes] = useState("");

  const fare = useMemo(() => estimateFare({ pickup, dropoff, passengers: pax, luggage: bags, roundTrip }), [pickup, dropoff, pax, bags, roundTrip]);
  const pickupName = PLACES.find((p) => p.id === pickup)?.name ?? "";
  const dropName = PLACES.find((p) => p.id === dropoff)?.name ?? "";

  const requestQuote = () => {
    const msg = `Hello Annie! I'd like a fare quote for a ${roundTrip ? "round trip" : "one-way"} private taxi in Grenada on ${new Date(
      date + "T00:00:00"
    ).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} at ${time}. Pickup: ${pickupName}. Drop-off: ${dropName}. Passengers: ${pax}. Luggage: ${bags}.${
      notes ? ` Notes: ${notes}` : ""
    } Could you confirm availability and pricing?`;
    window.open(waLink(msg), "_blank", "noopener");
    toast("WhatsApp opened with your route prefilled — press send when ready.", "info");
  };

  const continueToBooking = () => {
    update({
      service: roundTrip ? "Private taxi — round trip" : "Private taxi / airport transfer",
      date,
      time,
      passengers: pax,
      luggage: bags,
      pickup: pickupName,
      dropoff: dropName,
      notes: notes || (roundTrip ? "Round trip" : "One way"),
    });
    toast("Route saved — add your contact details next.", "info");
    navigate("/booking");
  };

  const hubs = PLACES.filter((p) => p.kind !== "hotel" || true);

  return (
    <>
      <header className="relative overflow-hidden pt-32 pb-10 sm:pt-36">
        <div aria-hidden className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-sea/20" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow>Transfers &amp; private taxi</Eyebrow>
          <h1 className="display-xl mt-6 max-w-4xl">
            Point to point, <em className="font-normal italic text-sea">island-wide.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa-2">
            Airport pickups, hotel-to-beach runs, town trips and cross-island days — private, air-conditioned, and scheduled
            around you. Use the estimator below to frame a budget, then ask Annie for the real number.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* estimator */}
          <section aria-labelledby="fare-heading" className="lg:col-span-7">
            <div className="rounded-[28px] border border-cocoa/12 bg-white/60 p-5 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 id="fare-heading" className="font-display text-3xl font-light">Fare estimator</h2>
                <span className="rounded-full bg-sun/30 px-3 py-1 text-[0.625rem] font-bold tracking-[0.16em] uppercase">Demo tool</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Pickup location">
                  <Select value={pickup} onChange={(e) => setPickup(e.target.value)}>
                    {hubs.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Drop-off location">
                  <Select value={dropoff} onChange={(e) => setDropoff(e.target.value)}>
                    {PLACES.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Date">
                  <input type="date" value={date} min={todayPlus(0)} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Time">
                  <Select value={time} onChange={(e) => setTime(e.target.value)}>
                    {SLOT_TIMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Passengers">
                  <Select value={pax} onChange={(e) => setPax(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Luggage" hint="large bags">
                  <Select value={bags} onChange={(e) => setBags(Number(e.target.value))}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex overflow-hidden rounded-full border border-cocoa/15">
                  {[false, true].map((r) => (
                    <button
                      key={String(r)}
                      type="button"
                      onClick={() => setRoundTrip(r)}
                      className={`px-5 py-2.5 text-[0.8125rem] font-medium transition ${
                        roundTrip === r ? "bg-cocoa text-cream" : "bg-white/70 text-cocoa-2 hover:bg-cream-3"
                      }`}
                    >
                      {r ? "Round trip" : "One way"}
                    </button>
                  ))}
                </div>
                <span className="flex items-center gap-1.5 text-[0.8125rem] text-cocoa-3">
                  <Repeat size={14} /> {roundTrip ? "Return leg included in the demo figure" : "Single journey"}
                </span>
              </div>

              <div className="mt-5">
                <Field label="Additional notes" hint="flight number, child seats, extra stops…">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Arriving on B6 1234, one infant seat needed…"
                    className={`${inputCls} min-h-24 resize-y`}
                  />
                </Field>
              </div>

              {/* result */}
              <motion.div
                key={`${fare.low}-${fare.high}-${roundTrip}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
                className="mt-6 overflow-hidden rounded-[22px] border border-cocoa/12 bg-cream-2 p-5"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <span className="eyebrow flex items-center gap-2 text-cocoa-3"><Info size={13} /> Illustrative estimate — subject to confirmation</span>
                    <p className="mt-2 font-display text-5xl font-light leading-none tabular-nums">
                      ${fare.low}<span className="text-2xl text-cocoa-3"> – </span>${fare.high}
                    </p>
                    <p className="mt-2 text-[0.875rem] text-cocoa-2">
                      {pickupName} <span className="text-terracotta">→</span> {dropName} · zone band {fare.band}
                    </p>
                  </div>
                  <ul className="space-y-1 text-[0.75rem] text-cocoa-3">
                    {fare.breakdown.map((b) => (
                      <li key={b.label} className="flex justify-between gap-4">
                        <span className="max-w-[15rem]">{b.label}</span>
                        <span className="tabular-nums">${b.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="mt-4 border-t border-cocoa/12 pt-3 text-[0.75rem] leading-relaxed text-cocoa-3">
                  This is a demo calculation built from mock zone bands. <strong className="font-medium text-cocoa-2">It is not an
                  official Island Vacation Taxi &amp; Tours price</strong> — no published fares exist. Always request a fare quote
                  before travelling.
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Btn onClick={requestQuote} variant="terracotta">
                    <MessageCircle size={16} /> Request fare quote
                  </Btn>
                  <Btn onClick={continueToBooking} variant="solid">
                    Continue to booking <ArrowRight size={15} />
                  </Btn>
                </div>
              </motion.div>
            </div>

            {/* vehicle classes */}
            <div className="mt-6">
              <Eyebrow>Vehicle categories · demo configuration</Eyebrow>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {VEHICLE_CLASSES.map((v) => (
                  <div key={v.id} className="rounded-2xl border border-cocoa/12 bg-white/60 p-4">
                    <div className="flex items-center gap-2 text-cocoa-2">
                      <Users size={15} className="text-sea" />
                      <span className="text-[0.8125rem] font-medium">{v.label}</span>
                    </div>
                    <p className="mt-2 font-display text-3xl font-light tabular-nums">{v.pax}<span className="text-base text-cocoa-3"> pax</span></p>
                    <p className="mt-1 flex items-center gap-1.5 text-[0.75rem] text-cocoa-3">
                      <Luggage size={12} /> up to {v.bags} bags
                    </p>
                    <p className="mt-2 text-[0.75rem] leading-snug text-cocoa-3">{v.note}</p>
                  </div>
                ))}
              </div>
              <DemoNote className="mt-3">
                Generic capacity categories only — no fleet is claimed. Annie confirms the actual vehicle for your booking.
              </DemoNote>
            </div>
          </section>

          {/* side rail */}
          <aside className="lg:col-span-5">
            <div className="rounded-[28px] bg-cocoa p-6 text-cream">
              <Eyebrow tone="cream">How transfers work</Eyebrow>
              <ol className="mt-5 space-y-5">
                {[
                  ["Send your details", "Date, time, flight or ship, passengers and luggage."],
                  ["Annie confirms", "Availability, the real price and the pickup point, on WhatsApp."],
                  ["You travel private", "Air-conditioned, door to door, on your schedule."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/30 text-[0.8125rem] tabular-nums text-sun">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-display text-xl font-light text-cream">{t}</span>
                      <span className="mt-1 block text-[0.875rem] leading-relaxed text-cream/65">{d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-7 border-t border-cream/15 pt-5">
                <p className="flex items-start gap-2 text-[0.875rem] leading-relaxed text-cream/70">
                  <CalendarClock size={16} className="mt-0.5 shrink-0 text-sun" />
                  Popular runs: airport → Grand Anse, airport → St. George's, cruise terminal → island attractions, hotel →
                  waterfall days.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-cocoa/12 bg-white/60 p-6">
              <h2 className="font-display text-2xl font-light">Popular pickup points</h2>
              <ul className="mt-4 divide-y divide-cocoa/10">
                {PLACES.filter((p) => p.kind === "hub" || p.kind === "hotel").map((p) => (
                  <li key={p.id} className="flex items-baseline justify-between gap-3 py-2.5">
                    <span className="text-[0.9375rem]">{p.name}</span>
                    <span className="shrink-0 text-[0.75rem] text-cocoa-3">{p.note ?? p.zone}</span>
                  </li>
                ))}
              </ul>
              <Btn onClick={requestQuote} variant="outline" className="mt-5 w-full">
                <MessageCircle size={16} /> Ask about a route
              </Btn>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
