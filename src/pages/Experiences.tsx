import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus, Check, MapPin, Clock } from "lucide-react";
import { TOURS, DESTINATIONS } from "@/lib/data";
import { useBooking } from "@/lib/store";
import { Btn, Eyebrow, Reveal, SmartImage, usePageMeta, ease, DemoNote } from "@/components/ui";

const FILTERS = ["All", "Beach", "Culture", "Nature", "Custom stops"];

export default function Experiences() {
  usePageMeta(
    "Grenada Island Tours & Private Sightseeing | Island Vacation Taxi & Tours",
    "Grand Anse Beach Tour, St. George's City Tour and Mt. Carmel Waterfall Tour in Grenada — plus destinations you can add to a customized private itinerary.",
    "Grenada island tours, Grand Anse beach tours, St. George's city tour, Mt. Carmel waterfall tour, Grenada private sightseeing"
  );

  const [filter, setFilter] = useState("All");
  const { itinerary, setItinerary, toast } = useBooking();
  const navigate = useNavigate();

  const cats: Record<string, string> = {
    "Grand Anse Beach Tour": "Beach",
    "St. George's City Tour": "Culture",
    "Mt. Carmel Waterfall Tour": "Nature",
  };

  const tours = useMemo(() => TOURS.filter((t) => filter === "All" || cats[t.name] === filter || filter === "Custom stops"), [filter]);
  const custom = useMemo(() => DESTINATIONS.filter((d) => !d.featuredTour), []);

  const addStop = (id: string, name: string) => {
    if (itinerary.includes(id)) {
      setItinerary(itinerary.filter((x) => x !== id));
      toast(`${name} removed from your route.`, "info");
      return;
    }
    setItinerary([...itinerary, id]);
    toast(`${name} added — see it in the itinerary builder.`, "ok");
  };

  return (
    <>
      {/* header */}
      <header className="relative overflow-hidden pt-32 pb-14 sm:pt-36 lg:pb-20">
        <div aria-hidden className="absolute -right-20 -top-10 h-80 w-80 rounded-full bg-sage/25" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow>Experiences</Eyebrow>
          <h1 className="display-xl mt-6 max-w-4xl">
            Island tours, <em className="font-normal italic text-terracotta">made private.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa-2">
            Three tours are featured on the official site. Everything else on this page is a destination you can drop into a
            customized day — we will never claim a fixed package that does not exist.
          </p>

          <div className="mt-9 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-4.5 py-2.5 text-[0.8125rem] font-medium transition ${
                  filter === f ? "bg-cocoa text-cream" : "border border-cocoa/15 bg-white/60 text-cocoa-2 hover:border-cocoa"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* featured tours */}
        {filter !== "Custom stops" && (
          <section aria-label="Featured tours" className="space-y-6">
            {tours.map((t, i) => (
              <motion.article
                key={t.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, ease }}
                className={`group grid gap-6 overflow-hidden rounded-[30px] border border-cocoa/12 bg-white/55 p-5 sm:p-6 lg:grid-cols-12 lg:gap-10 ${
                  i % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                <figure className={`relative overflow-hidden rounded-[22px] lg:col-span-6 ${i % 2 === 1 ? "lg:rounded-[22px_110px_22px_22px]" : "lg:rounded-[22px_22px_110px_22px]"}`}>
                  <SmartImage
                    src={t.image}
                    fallback={t.fallback}
                    alt={t.alt}
                    className="aspect-[16/11] w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-cream/92 px-3 py-1 text-[0.625rem] font-bold tracking-[0.18em] uppercase">
                    Featured tour
                  </span>
                </figure>

                <div className="flex flex-col justify-center lg:col-span-6">
                  <Eyebrow>{t.eyebrow.replace("Featured tour · ", "")}</Eyebrow>
                  <h2 className="mt-4 font-display text-[2.25rem] font-light leading-[1.05] sm:text-[2.75rem]">{t.name}</h2>
                  <p className="mt-4 font-display text-xl font-light italic text-cocoa-2">{t.tagline}</p>
                  <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-cocoa-3">{t.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Btn to={`/experiences/${t.slug}`} variant="solid">
                      View experience <ArrowUpRight size={15} />
                    </Btn>
                    <Btn to="/booking" variant="outline">
                      Check availability
                    </Btn>
                  </div>
                </div>
              </motion.article>
            ))}
          </section>
        )}

        {/* custom destinations */}
        <section aria-labelledby="custom-heading" className="mt-20 pb-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 border-t border-cocoa/12 pt-10">
            <div>
              <Eyebrow tone="sea">Customized itineraries</Eyebrow>
              <h2 id="custom-heading" className="display-lg mt-5 max-w-2xl">
                Destinations we can <em className="font-normal italic text-sea">build around.</em>
              </h2>
            </div>
            <Btn to="/build-your-tour" variant="terracotta">
              Open the itinerary builder
            </Btn>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {custom.map((d) => {
              const on = itinerary.includes(d.id);
              return (
                <Reveal key={d.id} className="flex items-start gap-4 rounded-2xl border border-cocoa/12 bg-cream-2/60 p-4">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cocoa/15 bg-white">
                    <MapPin size={15} className="text-terracotta" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl font-light leading-tight">{d.name}</h3>
                    <p className="mt-0.5 text-[0.75rem] text-cocoa-3">{d.area}</p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-cocoa-2">{d.note}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => addStop(d.id, d.name)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.75rem] font-medium transition ${
                          on ? "bg-sea text-cream" : "border border-cocoa/20 hover:bg-cocoa hover:text-cream"
                        }`}
                      >
                        {on ? <Check size={13} /> : <Plus size={13} />}
                        {on ? "Added" : "Add to day"}
                      </button>
                      <span className="flex items-center gap-1.5 text-[0.75rem] text-cocoa-3">
                        <Clock size={12} /> ≈{d.minutes} min
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-4 rounded-[24px] border border-cocoa/12 bg-white/60 p-5">
            <div className="min-w-[15rem] flex-1">
              <p className="font-display text-2xl font-light">
                {itinerary.length} {itinerary.length === 1 ? "stop" : "stops"} selected
              </p>
              <DemoNote className="mt-1.5">Dwell times are illustrative; no distances or drive times are published.</DemoNote>
            </div>
            <Btn to="/build-your-tour" variant="solid">
              Review my route <ArrowUpRight size={15} />
            </Btn>
            <Btn onClick={() => navigate("/booking")} variant="outline">
              Request a booking
            </Btn>
          </Reveal>

          <p className="mt-10 max-w-3xl text-[0.875rem] leading-relaxed text-cocoa-3">
            Official imagery and tour descriptions are drawn from{" "}
            <a href="https://islandvacationgrenada.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-terracotta">
              islandvacationgrenada.com
            </a>
            ; supporting photography is licensed editorial imagery of Grenada.
          </p>
        </section>
      </div>
    </>
  );
}
