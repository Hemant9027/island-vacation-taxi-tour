import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight, Ship, Clock, ShieldCheck, AlertTriangle, MapPin } from "lucide-react";
import { DESTINATIONS, IMG, MSG, waLink } from "@/lib/data";
import { useBooking } from "@/lib/store";
import { Btn, Eyebrow, Reveal, SmartImage, DemoNote, usePageMeta, ease } from "@/components/ui";

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const ARRIVALS = ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"];
const DEPARTS = ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const PLANS = [
  { id: "quick", name: "The quick highlights", min: 120, max: 240, copy: "St. George's harbour, a fort viewpoint and one beach stop — back with time to spare." },
  { id: "half", name: "Half-day ashore", min: 240, max: 360, copy: "Capital sightseeing plus Grand Anse, or a waterfall run into the interior." },
  { id: "full", name: "Long port day", min: 360, max: 540, copy: "The full island loop: falls, rainforest, spice estate and the north of the island." },
];

export default function CruiseExcursions() {
  usePageMeta(
    "St. George's Cruise Excursions | Grenada Port Transportation — Island Vacation Taxi & Tours",
    "Cruise ship excursions in Grenada built around your port schedule: arrival time, all-aboard time, group size and a guaranteed return to the St. George's cruise terminal.",
    "St. George's cruise excursions, Grenada cruise port transportation, Grenada shore excursion private taxi"
  );

  const { update, toast } = useBooking();
  const [ship, setShip] = useState("");
  const [date, setDate] = useState(todayPlus(12));
  const [arrive, setArrive] = useState("08:00");
  const [depart, setDepart] = useState("17:00");
  const [pax, setPax] = useState(4);
  const [interest, setInterest] = useState("St. George's + Grand Anse");
  const [mustReturn, setMustReturn] = useState(true);

  const minutes = useMemo(() => {
    const toM = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    return Math.max(0, toM(depart) - toM(arrive));
  }, [arrive, depart]);

  const fitting = PLANS.filter((p) => minutes >= p.min && minutes <= p.max);
  const tooTight = minutes < 180;

  const message = () =>
    MSG.cruise({
      ship: ship || "our cruise ship",
      date: new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      arrive,
      depart,
      pax,
      interest,
    });

  const request = () => {
    if (!date) return toast("Choose your date in port.", "warn");
    if (tooTight) return toast("That is a very short window — message Annie directly so she can advise.", "warn");
    if (!mustReturn) return toast("Please confirm the return-to-port requirement.", "warn");
    window.open(waLink(message()), "_blank", "noopener");
    toast("WhatsApp opened with your port schedule — press send when ready.", "info");
  };

  const saveToBooking = () => {
    update({
      service: "Cruise port excursion",
      date,
      time: arrive,
      passengers: pax,
      pickup: "St. George's Cruise Terminal",
      dropoff: "St. George's Cruise Terminal",
      cruise: ship,
      notes: `Ship: ${ship || "not stated"} · in ${arrive} · all aboard ${depart} · preferred: ${interest}`,
    });
    toast("Cruise details saved — finish the booking request.", "info");
  };

  const cruiseStops = DESTINATIONS.filter((d) =>
    ["grand-anse", "st-georges", "fort-george", "annandale", "sculpture", "grand-etang"].includes(d.id)
  );

  return (
    <>
      {/* hero */}
      <header className="relative">
        <div className="relative h-[62vh] min-h-[440px] w-full overflow-hidden">
          <SmartImage
            src={IMG.cruisePort}
            fallback={IMG.cruisePort}
            alt="A cruise ship berthed at the cruise terminal in St. George's, Grenada"
            eager
            className="h-full w-full"
            imgClassName="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/40 to-cocoa/25" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-12 sm:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
              <Eyebrow tone="cream">Port of St. George's · Cruise visitors</Eyebrow>
              <h1 className="display-xl mt-5 max-w-4xl text-cream">
                Make Every Hour <em className="font-normal italic text-sun">Ashore Count.</em>
              </h1>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-cream/80">
                Your ship waits for nobody, so the day is planned backwards from all-aboard — with the return to port built in
                from the start.
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        <div className="grid gap-10 pt-12 lg:grid-cols-12 lg:gap-14">
          {/* schedule planner */}
          <section aria-labelledby="planner-heading" className="lg:col-span-7">
            <Reveal>
              <h2 id="planner-heading" className="display-lg max-w-2xl">
                Build your day <em className="font-normal italic text-terracotta">around the ship.</em>
              </h2>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa-2">
                Give us the essentials and we will shape an excursion that gets you back to the terminal with margin to spare.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-8 rounded-[28px] border border-cocoa/12 bg-white/60 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="eyebrow mb-2 block text-cocoa-3">Cruise ship name</span>
                  <input
                    value={ship}
                    onChange={(e) => setShip(e.target.value)}
                    placeholder="e.g. Vision of the Seas"
                    className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block text-cocoa-3">Date in port</span>
                  <input
                    type="date"
                    value={date}
                    min={todayPlus(0)}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block text-cocoa-3">Group size</span>
                  <select
                    value={pax}
                    onChange={(e) => setPax(Number(e.target.value))}
                    className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                      <option key={n} value={n}>{n} passengers</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block text-cocoa-3">Arrival time</span>
                  <select
                    value={arrive}
                    onChange={(e) => setArrive(e.target.value)}
                    className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                  >
                    {ARRIVALS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block text-cocoa-3">All aboard</span>
                  <select
                    value={depart}
                    onChange={(e) => setDepart(e.target.value)}
                    className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                  >
                    {DEPARTS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className="eyebrow mb-2 block text-cocoa-3">Preferred tour</span>
                  <select
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                  >
                    {[
                      "St. George's + Grand Anse",
                      "Waterfall morning",
                      "Full island highlights",
                      "Beach afternoon",
                      "Custom — I'll describe on WhatsApp",
                    ].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* window readout */}
              <motion.div
                key={`${arrive}-${depart}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
                className="mt-6 rounded-2xl border border-cocoa/12 bg-cream-2 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="eyebrow flex items-center gap-2 text-cocoa-3"><Clock size={13} /> Time ashore</span>
                  <span className="font-display text-3xl font-light tabular-nums">
                    {Math.floor(minutes / 60)}h {minutes % 60}m
                  </span>
                </div>

                {tooTight ? (
                  <p className="mt-3 flex items-start gap-2 text-[0.875rem] leading-relaxed text-terracotta-2">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                    Under three hours ashore — a full excursion is not realistic. Message Annie and she will advise on what is
                    achievable from the port.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {fitting.map((p) => (
                      <li key={p.id} className="flex gap-3 rounded-xl bg-white/70 px-4 py-3">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-sea" />
                        <span>
                          <span className="block text-[0.9375rem] font-medium">{p.name}</span>
                          <span className="block text-[0.8125rem] leading-snug text-cocoa-3">{p.copy}</span>
                        </span>
                      </li>
                    ))}
                    {fitting.length === 0 && (
                      <li className="rounded-xl bg-white/70 px-4 py-3 text-[0.875rem] text-cocoa-2">
                        {Math.floor(minutes / 60)} hours ashore — plenty of scope. Tell us what you most want to see and Annie
                        will shape the route.
                      </li>
                    )}
                  </ul>
                )}
              </motion.div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-sun/25 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={mustReturn}
                  onChange={(e) => setMustReturn(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#BB6C4C]"
                />
                <span className="text-[0.875rem] leading-snug text-cocoa-2">
                  We must be returned to the St. George's cruise terminal before all-aboard.
                </span>
              </label>

              <div className="mt-5 flex flex-wrap gap-3">
                <Btn onClick={request} variant="terracotta" size="lg">
                  <MessageCircle size={16} /> Request port itinerary
                </Btn>
                <Btn onClick={saveToBooking} variant="outline" size="lg">
                  Continue to booking <ArrowRight size={16} />
                </Btn>
              </div>
              <DemoNote className="mt-4">
                Opens WhatsApp with your schedule prefilled — nothing is sent until you press send. No payment is taken here.
              </DemoNote>
            </Reveal>
          </section>

          {/* side */}
          <aside className="lg:col-span-5">
            <Reveal delay={0.1} className="rounded-[28px] bg-cocoa p-6 text-cream">
              <Ship size={22} className="text-sun" />
              <h2 className="mt-4 font-display text-3xl font-light text-cream">Why port days need a plan</h2>
              <ul className="mt-5 space-y-4 text-[0.9375rem] leading-relaxed text-cream/70">
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-terracotta" />Pier queues, tender boats and traffic all eat into your hours ashore.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-terracotta" />Every plan includes the run back to the terminal, not just the outbound leg.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-terracotta" />Groups of any size can be accommodated — tell us how many when you enquire.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-terracotta" />Ship late into port or leaving early? Message Annie and the plan moves with it.</li>
              </ul>
              <Btn href={waLink(message())} variant="cream" className="mt-6 w-full">
                <MessageCircle size={16} /> Chat about my port day
              </Btn>
            </Reveal>

            <Reveal delay={0.16} className="mt-6 rounded-[28px] border border-cocoa/12 bg-white/60 p-6">
              <Eyebrow>Good fits for a port day</Eyebrow>
              <ul className="mt-4 space-y-3">
                {cruiseStops.map((d) => (
                  <li key={d.id} className="flex items-start justify-between gap-3 border-b border-cocoa/10 pb-3">
                    <span>
                      <span className="block font-display text-lg font-light">{d.name}</span>
                      <span className="block text-[0.8125rem] text-cocoa-3">{d.note}</span>
                    </span>
                    <Link
                      to="/build-your-tour"
                      className="shrink-0 rounded-full border border-cocoa/15 px-3 py-1.5 text-[0.75rem] transition hover:bg-cocoa hover:text-cream"
                    >
                      Add
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-[0.75rem] leading-relaxed text-cocoa-3">
                <MapPin size={13} className="mt-0.5 shrink-0" />
                Destinations only — we do not claim fixed cruise packages beyond the featured tours on the experiences page.
              </p>
            </Reveal>
          </aside>
        </div>
      </div>
    </>
  );
}
