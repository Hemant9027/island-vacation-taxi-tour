import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ArrowUp, ArrowDown, MapPin, Clock, Users, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import {
  DESTINATIONS,
  BUDGETS,
  itineraryMinutes,
  STOP_BASE_MINUTES,
  TRANSFER_MINUTES,
  PICKUP_OPTIONS,
  MSG,
  waLink,
  type BudgetId,
  type Destination,
} from "@/lib/data";
import { useBooking } from "@/lib/store";
import { Btn, Field, Select, Eyebrow, ease } from "./ui";

const KIND_COLOR: Record<Destination["kind"], string> = {
  beach: "#407E91",
  falls: "#2F6273",
  town: "#BB6C4C",
  fort: "#9E563A",
  forest: "#A9B5A0",
  estate: "#E9BE6A",
  sea: "#407E91",
};

const ISLAND_PATH =
  "M 212 28 C 252 44, 292 88, 302 150 C 314 214, 302 270, 286 320 C 273 366, 269 410, 251 450 C 236 486, 226 520, 213 552 C 206 568, 190 566, 186 548 C 180 515, 168 486, 150 463 C 130 439, 108 425, 96 400 C 84 376, 92 350, 106 330 C 119 309, 121 286, 113 261 C 103 229, 93 201, 101 166 C 111 121, 150 70, 181 45 C 193 35, 202 26, 212 28 Z";

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function ItineraryBuilder({ compact = false }: { compact?: boolean }) {
  const { itinerary, setItinerary, update, toast } = useBooking();
  const navigate = useNavigate();

  const [date, setDate] = useState(todayPlus(7));
  const [length, setLength] = useState<BudgetId>("full");
  const [travelers, setTravelers] = useState(2);
  const [pickup, setPickup] = useState(PICKUP_OPTIONS[0]?.name ?? "Maurice Bishop International Airport");
  const [hover, setHover] = useState<string | null>(null);

  const selected = useMemo(
    () => itinerary.map((id) => DESTINATIONS.find((d) => d.id === id)).filter(Boolean) as Destination[],
    [itinerary]
  );
  const budget = BUDGETS[length];
  const used = itineraryMinutes(selected);
  const remaining = budget.hours * 60 - used;
  const pct = Math.min(100, Math.round((used / (budget.hours * 60)) * 100));
  const overBudget = remaining < 0;

  const routeD = selected.length
    ? selected.map((s, i) => `${i === 0 ? "M" : "L"} ${s.x} ${s.y}`).join(" ")
    : "";

  const canAdd = (d: Destination) => {
    const projected = itineraryMinutes([...selected, d]);
    return projected <= budget.hours * 60;
  };

  const add = (d: Destination) => {
    if (itinerary.includes(d.id)) return;
    if (!canAdd(d)) {
      toast(
        `${d.name} would overrun your ${budget.label.toLowerCase()} budget — switch to ${length === "half" ? "Full day" : "remove a stop"} first.`,
        "warn"
      );
      return;
    }
    setItinerary([...itinerary, d.id]);
    toast(`${d.name} added to your route.`, "ok");
  };

  const remove = (id: string) => setItinerary(itinerary.filter((x) => x !== id));
  const move = (index: number, dir: -1 | 1) => {
    const next = [...itinerary];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItinerary(next);
  };

  const sendToBooking = () => {
    update({
      service: "Custom island itinerary",
      date,
      time: "08:00",
      passengers: travelers,
      pickup,
      dropoff: pickup,
      stops: itinerary,
      length,
      notes: `Custom itinerary: ${selected.map((s) => s.name).join(" → ")}`,
    });
    toast("Your itinerary is attached to the booking form.", "info");
    navigate("/booking");
  };

  const whatsapp = () => {
    if (!selected.length) {
      toast("Pick at least one stop before requesting a quote.", "warn");
      return;
    }
    window.open(
      waLink(
        MSG.itinerary({
          date: new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
          length: budget.label,
          stops: selected.map((s) => s.name),
          pax: travelers,
          pickup,
        })
      ),
      "_blank",
      "noopener"
    );
  };

  const available = DESTINATIONS.filter((d) => !itinerary.includes(d.id));
  const visibleAvailable = compact ? available.slice(0, 8) : available;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* ---------------------------------------------------------- MAP */}
      <div className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-[28px] border border-cocoa/12 bg-sea/[0.14] p-4">
          <div className="absolute inset-0 opacity-[0.5] [background-image:radial-gradient(circle_at_20%_10%,rgba(64,126,145,0.35),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(169,181,160,0.4),transparent_50%)]" aria-hidden />
          <div className="relative flex items-start justify-between gap-3 px-1 pb-2">
            <div>
              <Eyebrow tone="sea">Illustrative island map</Eyebrow>
              <p className="mt-1 font-display text-lg font-light text-cocoa-2">Grenada · not to scale</p>
            </div>
            <span className="rounded-full bg-cream/80 px-3 py-1 text-[0.6875rem] font-medium text-cocoa-3">
              {selected.length} {selected.length === 1 ? "stop" : "stops"}
            </span>
          </div>

          <svg viewBox="0 0 400 580" className="relative mx-auto block h-[420px] w-full max-w-[330px] sm:h-[520px]" role="img" aria-label="Illustrative map of Grenada showing your selected stops">
            <defs>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#292B25" floodOpacity="0.18" />
              </filter>
              <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F8F4EA" />
                <stop offset="100%" stopColor="#EAE2CF" />
              </linearGradient>
            </defs>

            {/* decorative swell lines */}
            <g stroke="#407E91" strokeWidth="1" opacity="0.28" fill="none">
              <path d="M20 120 q 30 -12 60 0 t 60 0" />
              <path d="M300 90 q 22 -10 44 0 t 44 0" />
              <path d="M18 500 q 30 -12 60 0 t 60 0" />
              <path d="M300 520 q 22 -10 44 0 t 44 0" />
            </g>

            <path d={ISLAND_PATH} fill="url(#land)" stroke="#292B25" strokeWidth="1.4" filter="url(#soft)" />

            {/* route */}
            {selected.length > 1 && (
              <motion.path
                key={routeD}
                d={routeD}
                fill="none"
                stroke="#BB6C4C"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="2 12"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease }}
              />
            )}

            {/* pins */}
            {DESTINATIONS.map((d) => {
              const idx = itinerary.indexOf(d.id);
              const isOn = idx >= 0;
              const isHover = hover === d.id;
              return (
                <g
                  key={d.id}
                  transform={`translate(${d.x} ${d.y})`}
                  onMouseEnter={() => setHover(d.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => (isOn ? remove(d.id) : add(d))}
                  className="cursor-pointer"
                  tabIndex={0}
                  role="button"
                  aria-label={`${isOn ? "Remove" : "Add"} ${d.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      isOn ? remove(d.id) : add(d);
                    }
                  }}
                >
                  <circle r={isOn ? 15 : isHover ? 12 : 7} fill={isOn ? "#BB6C4C" : isHover ? "#E9BE6A" : "#A9B5A0"} stroke="#F8F4EA" strokeWidth="2.5" className="transition-all duration-300" />
                  {isOn && (
                    <text y="5" textAnchor="middle" fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="700" fill="#F8F4EA">
                      {idx + 1}
                    </text>
                  )}
                  {(isOn || isHover) && (
                    <text
                      x={d.x > 210 ? -22 : 22}
                      y="4"
                      textAnchor={d.x > 210 ? "end" : "start"}
                      fontSize="15"
                      fontFamily="DM Sans, sans-serif"
                      fill="#292B25"
                      className="pointer-events-none"
                    >
                      {d.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <p className="relative mt-1 px-1 text-[0.6875rem] leading-relaxed text-cocoa-3">
            Map is illustrative only. No distances or drive times are shown, because none are published by the business.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------ CONTROLS */}
      <div className="lg:col-span-7">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Travel date">
            <input type="date" value={date} min={todayPlus(0)} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none" />
          </Field>
          <Field label="Experience length">
            <div className="flex gap-2">
              {(Object.keys(BUDGETS) as BudgetId[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setLength(k)}
                  className={`flex-1 rounded-xl border px-3 py-3 text-[0.8125rem] font-medium transition ${
                    length === k ? "border-cocoa bg-cocoa text-cream" : "border-cocoa/15 bg-white/70 hover:border-cocoa/40"
                  }`}
                >
                  {BUDGETS[k].label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Travellers">
            <Select value={travelers} onChange={(e) => setTravelers(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="mt-3">
          <Field label="Pickup location">
            <Select value={pickup} onChange={(e) => setPickup(e.target.value)}>
              {PICKUP_OPTIONS.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </Select>
          </Field>
        </div>

        {/* budget meter */}
        <div className="mt-5 rounded-2xl border border-cocoa/12 bg-white/60 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="eyebrow flex items-center gap-2 text-cocoa-3">
              <Clock size={13} /> Time budget
            </span>
            <span className={`text-sm font-medium tabular-nums ${overBudget ? "text-terracotta-2" : "text-cocoa-2"}`}>
              {Math.floor(used / 60)}h {used % 60}m of {budget.hours}h
            </span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-cocoa/10">
            <motion.div
              className={`h-full rounded-full ${overBudget ? "bg-terracotta" : pct > 80 ? "bg-sun" : "bg-sea"}`}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease }}
            />
          </div>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-cocoa-3">
            Illustrative budget: {STOP_BASE_MINUTES} min pickup buffer + {transferMinutesLabel()} min between stops + your chosen
            dwell times. Overrunning stops are blocked until you switch to a longer day.
          </p>
        </div>

        {/* selected route */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <Eyebrow>Your route</Eyebrow>
            {selected.length > 0 && (
              <button type="button" onClick={() => setItinerary([])} className="text-[0.75rem] text-cocoa-3 underline underline-offset-4 hover:text-terracotta">
                Clear all
              </button>
            )}
          </div>

          <ol className="mt-3 space-y-2">
            <AnimatePresence initial={false}>
              {selected.map((s, i) => (
                <motion.li
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex items-center gap-3 rounded-2xl border border-cocoa/12 bg-cream px-3 py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-[0.8125rem] font-bold text-cream tabular-nums">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] font-medium">{s.name}</span>
                    <span className="block truncate text-[0.75rem] text-cocoa-3">
                      {s.area} · ≈{s.minutes} min {s.featuredTour ? "· named tour" : "· custom stop"}
                    </span>
                  </span>
                  <span className="flex shrink-0 gap-1">
                    <button type="button" aria-label={`Move ${s.name} earlier`} onClick={() => move(i, -1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-cocoa/15 transition hover:bg-cocoa hover:text-cream disabled:opacity-30" disabled={i === 0}>
                      <ArrowUp size={14} />
                    </button>
                    <button type="button" aria-label={`Move ${s.name} later`} onClick={() => move(i, 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-cocoa/15 transition hover:bg-cocoa hover:text-cream disabled:opacity-30" disabled={i === selected.length - 1}>
                      <ArrowDown size={14} />
                    </button>
                    <button type="button" aria-label={`Remove ${s.name}`} onClick={() => remove(s.id)} className="flex h-8 w-8 items-center justify-center rounded-full border border-cocoa/15 transition hover:bg-terracotta hover:text-cream">
                      <X size={14} />
                    </button>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>

          {selected.length === 0 && (
            <div className="mt-3 rounded-2xl border border-dashed border-cocoa/25 bg-white/50 px-4 py-7 text-center">
              <MapPin size={20} className="mx-auto text-terracotta" />
              <p className="mt-2 font-display text-lg font-light">No stops yet</p>
              <p className="mx-auto mt-1 max-w-xs text-[0.8125rem] text-cocoa-3">
                Tap a pin on the map or add a destination below — we will keep the day inside your time budget.
              </p>
            </div>
          )}
        </div>

        {/* add destinations */}
        <div className="mt-5">
          <Eyebrow>Add a destination</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleAvailable.map((d) => {
              const allowed = canAdd(d);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => add(d)}
                  title={allowed ? d.note : "Would exceed your current time budget"}
                  className={`group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.8125rem] transition ${
                    allowed
                      ? "border-cocoa/15 bg-white/70 hover:border-cocoa hover:bg-cocoa hover:text-cream"
                      : "cursor-not-allowed border-cocoa/10 bg-cocoa/[0.04] text-cocoa-3/60"
                  }`}
                >
                  <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[d.kind] }} />
                  {d.name}
                  <Plus size={13} className={allowed ? "opacity-50 group-hover:opacity-100" : "opacity-30"} />
                </button>
              );
            })}
            {compact && available.length > visibleAvailable.length && (
              <Btn to="/build-your-tour" variant="outline" size="sm">
                <Sparkles size={14} /> All {DESTINATIONS.length} destinations
              </Btn>
            )}
          </div>
        </div>

        {/* live summary + actions */}
        <div className="mt-6 overflow-hidden rounded-[24px] bg-cocoa text-cream">
          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
            <div>
              <span className="eyebrow text-sun">Live itinerary summary</span>
              <p className="mt-3 font-display text-2xl font-light leading-snug">
                {selected.length ? selected.map((s) => s.name).join(" · ") : "Your journey, in your words."}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.8125rem] text-cream/75">
                <div className="flex items-center gap-2"><Clock size={13} className="text-sun" /> {BUDGETS[length].label}</div>
                <div className="flex items-center gap-2"><Users size={13} className="text-sun" /> {travelers} guests</div>
                <div className="flex items-center gap-2 col-span-2 truncate"><MapPin size={13} className="text-sun" /> Pickup: {pickup}</div>
                <div className="flex items-center gap-2 col-span-2"><span className="h-1.5 w-1.5 rotate-45 bg-terracotta" /> {new Date(date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
              </dl>
            </div>
            <div className="flex flex-col justify-end gap-2.5">
              <button
                type="button"
                onClick={sendToBooking}
                disabled={!selected.length}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-medium text-cocoa transition hover:bg-white disabled:opacity-40"
              >
                Request this itinerary
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={whatsapp}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/35 px-6 py-3.5 text-sm font-medium text-cream transition hover:bg-cream hover:text-cocoa"
              >
                <MessageCircle size={15} /> Quote on WhatsApp
              </button>
            </div>
          </div>
          <p className="border-t border-cream/12 px-5 py-3 text-[0.6875rem] leading-relaxed text-cream/50 sm:px-6">
            Demo itinerary builder — no quote is sent automatically. Your stops are prefilled into a WhatsApp message for you to
            review and send to Annie.
          </p>
        </div>
      </div>
    </div>
  );
}

function transferMinutesLabel() {
  return TRANSFER_MINUTES;
}
