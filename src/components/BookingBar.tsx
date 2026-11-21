import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, Car, Compass, Ship, ArrowRight } from "lucide-react";
import { PLACES, SLOT_TIMES, SERVICES, type ServiceKey } from "@/lib/data";
import { useBooking } from "@/lib/store";
import { Field, Select, inputCls, ease, DemoNote } from "./ui";

const TABS: { key: ServiceKey; label: string; icon: typeof Plane }[] = [
  { key: "airport-transfer", label: "Airport Transfer", icon: Plane },
  { key: "private-taxi", label: "Private Taxi", icon: Car },
  { key: "island-tour", label: "Island Tour", icon: Compass },
  { key: "cruise-excursion", label: "Cruise Excursion", icon: Ship },
];

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const placeOptions = (filter?: (p: (typeof PLACES)[number]) => boolean) =>
  PLACES.filter(filter ?? (() => true)).map((p) => (
    <option key={p.id} value={p.name}>
      {p.name}
    </option>
  ));

export default function BookingBar() {
  const [tab, setTab] = useState<ServiceKey>("airport-transfer");
  const [form, setForm] = useState<Record<string, string>>({
    pickup: "Maurice Bishop International Airport",
    dropoff: "Grand Anse hotel strip",
    date: todayPlus(7),
    time: "13:00",
    pax: "2",
    flight: "",
    guests: "2",
    interest: "Waterfalls & rainforest",
    ship: "",
    arrive: "08:00",
    depart: "17:00",
    cruiseTour: "St. George's + Grand Anse",
  });
  const [error, setError] = useState("");
  const { update, toast } = useBooking();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) return setError("Please choose a date.");
    if (!form.pickup) return setError("Please choose a pickup location.");
    setError("");

    const service = SERVICES.find((s) => s.key === tab)!;
    update({
      service: service.label,
      date: form.date,
      time: form.time,
      passengers: Number(form.pax || form.guests) || 1,
      luggage: 2,
      pickup: form.pickup,
      dropoff: tab === "cruise-excursion" ? "St. George's Cruise Terminal" : form.dropoff,
      flight: tab === "airport-transfer" ? form.flight : "",
      cruise: tab === "cruise-excursion" ? form.ship : "",
      notes:
        tab === "island-tour"
          ? `Tour interest: ${form.interest}`
          : tab === "cruise-excursion"
          ? `Ship: ${form.ship || "not stated"}, in ${form.arrive}, all aboard ${form.depart}. Preferred: ${form.cruiseTour}`
          : "",
    });
    toast(`${service.label} details saved — choose your date and time next.`, "info");
    navigate("/booking");
  };

  return (
    <section aria-label="Quick booking" className="relative z-20 mx-auto -mt-12 max-w-[1400px] px-5 sm:-mt-16 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease }}
        className="rounded-[28px] border border-cocoa/12 bg-cream shadow-[0_40px_80px_-50px_rgba(41,43,37,0.55)]"
      >
        {/* tabs */}
        <div className="hide-scroll flex overflow-x-auto border-b border-cocoa/12" role="tablist" aria-label="Service type">
          {TABS.map((t) => {
            const active = tab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={`relative flex min-w-[9.5rem] flex-1 items-center justify-center gap-2 px-4 py-4 text-[0.8125rem] font-medium tracking-[0.03em] transition-colors sm:text-sm ${
                  active ? "text-cocoa" : "text-cocoa-3 hover:text-cocoa-2"
                }`}
              >
                <Icon size={16} className={active ? "text-terracotta" : ""} />
                <span className="whitespace-nowrap">{t.label}</span>
                {active && (
                  <motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-terracotta" transition={{ duration: 0.4, ease }} />
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="grid gap-4 p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-12">
          {tab === "airport-transfer" && (
            <>
              <Field label="Pickup location" className="lg:col-span-3">
                <Select value={form.pickup} onChange={set("pickup")}>
                  {placeOptions((p) => p.kind === "hub" || p.kind === "hotel")}
                </Select>
              </Field>
              <Field label="Destination" className="lg:col-span-3">
                <Select value={form.dropoff} onChange={set("dropoff")}>
                  {placeOptions((p) => p.id !== "mbia")}
                </Select>
              </Field>
              <Field label="Arrival date" className="lg:col-span-2">
                <input type="date" value={form.date} min={todayPlus(0)} onChange={set("date")} className={inputCls} />
              </Field>
              <Field label="Arrival time" className="lg:col-span-1">
                <Select value={form.time} onChange={set("time")}>
                  {SLOT_TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Passengers" className="lg:col-span-1">
                <Select value={form.pax} onChange={set("pax")}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Flight no." hint="optional" className="lg:col-span-2">
                <input value={form.flight} onChange={set("flight")} placeholder="e.g. B6 1234" className={inputCls} />
              </Field>
            </>
          )}

          {tab === "private-taxi" && (
            <>
              <Field label="Pickup location" className="lg:col-span-4">
                <Select value={form.pickup} onChange={set("pickup")}>{placeOptions()}</Select>
              </Field>
              <Field label="Drop-off location" className="lg:col-span-4">
                <Select value={form.dropoff} onChange={set("dropoff")}>{placeOptions((p) => p.id !== "mbia")}</Select>
              </Field>
              <Field label="Date" className="lg:col-span-2">
                <input type="date" value={form.date} min={todayPlus(0)} onChange={set("date")} className={inputCls} />
              </Field>
              <Field label="Time" className="lg:col-span-1">
                <Select value={form.time} onChange={set("time")}>
                  {SLOT_TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Passengers" className="lg:col-span-1">
                <Select value={form.pax} onChange={set("pax")}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </Select>
              </Field>
            </>
          )}

          {tab === "island-tour" && (
            <>
              <Field label="Preferred date" className="lg:col-span-3">
                <input type="date" value={form.date} min={todayPlus(0)} onChange={set("date")} className={inputCls} />
              </Field>
              <Field label="Number of guests" className="lg:col-span-2">
                <Select value={form.guests} onChange={set("pax")}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Tour interest" className="lg:col-span-3">
                <Select value={form.interest} onChange={set("interest")}>
                  {["Waterfalls & rainforest", "Beaches & snorkelling", "Forts & history", "Spice plantations & culture", "A bit of everything"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Pickup location" className="lg:col-span-4">
                <Select value={form.pickup} onChange={set("pickup")}>{placeOptions((p) => p.kind !== "landmark")}</Select>
              </Field>
            </>
          )}

          {tab === "cruise-excursion" && (
            <>
              <Field label="Cruise ship name" className="lg:col-span-3">
                <input value={form.ship} onChange={set("ship")} placeholder="e.g. Vision of the Seas" className={inputCls} />
              </Field>
              <Field label="Date in port" className="lg:col-span-2">
                <input type="date" value={form.date} min={todayPlus(0)} onChange={set("date")} className={inputCls} />
              </Field>
              <Field label="Arrival" className="lg:col-span-1">
                <Select value={form.arrive} onChange={set("arrive")}>
                  {SLOT_TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="All aboard" className="lg:col-span-2">
                <Select value={form.depart} onChange={set("depart")}>
                  {SLOT_TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Group size" className="lg:col-span-1">
                <Select value={form.pax} onChange={set("pax")}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Preferred tour" className="lg:col-span-3">
                <Select value={form.cruiseTour} onChange={set("cruiseTour")}>
                  {["St. George's + Grand Anse", "Waterfall morning", "Full island highlights", "Beach afternoon", "Custom — I'll describe below"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </Field>
            </>
          )}

          <div className="flex flex-col gap-3 border-t border-cocoa/10 pt-4 md:flex-row md:items-center md:justify-between lg:col-span-12">
            <div className="max-w-md">
              <DemoNote>Front-end demo — availability and pricing are confirmed personally by Annie on WhatsApp.</DemoNote>
              {error && <p className="mt-1.5 text-[0.8125rem] text-terracotta-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-cocoa px-8 py-4 text-sm font-medium text-cream transition-all duration-300 hover:bg-terracotta"
            >
              Check availability
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
