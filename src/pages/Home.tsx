import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  PlaneLanding,
  UserCheck,
  CarFront,
  MapPin,
  Ship,
  MessageCircle,
  Search,
  Trees,
  Sparkles,
} from "lucide-react";
import { IMG, OFFICIAL, BUSINESS, MSG, waLink, SERVICES, type ServiceKey } from "@/lib/data";
import { useBooking } from "@/lib/store";
import BookingBar from "@/components/BookingBar";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import { Btn, Eyebrow, Reveal, SplitLines, SmartImage, DemoNote, usePageMeta, ease } from "@/components/ui";

/* ------------------------------------------------------------------ */
/* A — Editorial hero                                                  */
/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bigY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const smallY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-24 pt-28 sm:pb-28 sm:pt-32 lg:pt-36" aria-label="Introduction">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-4 h-[34rem] w-[34rem] rounded-full bg-sun/25 blur-[2px] sm:h-[42rem] sm:w-[42rem]"
        style={{ clipPath: "circle(50% at 50% 50%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-sage/25" />

      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* left */}
        <div className="lg:col-span-5 lg:pt-10 xl:col-span-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Eyebrow>The Spice Isle — Grenada</Eyebrow>
          </motion.div>

          <h1 className="display-xl mt-6 text-cocoa">
            <SplitLines text={"See Grenada.\nFeel Everything."} delay={0.15} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="mt-7 max-w-md text-[1.0625rem] leading-relaxed text-cocoa-2"
          >
            From your first airport pickup to your last island sunset, discover Grenada with a local who knows every turn.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Btn to="/build-your-tour" variant="terracotta" size="lg">
              Plan My Island Journey <ArrowRight size={16} />
            </Btn>
            <Btn to="/transfers" variant="outline" size="lg">
              Book a Transfer
            </Btn>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-cocoa/12 pt-6"
          >
            {[
              ["Private", "Airport pickups"],
              ["Island-wide", "Point-to-point taxi"],
              ["Back to port", "Cruise excursions"],
            ].map(([a, b]) => (
              <div key={a}>
                <div className="font-display text-xl font-medium leading-tight text-cocoa">{a}</div>
                <div className="mt-1 text-[0.75rem] leading-snug text-cocoa-3">{b}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right — overlapping photography */}
        <div className="relative lg:col-span-7">
          <motion.figure
            style={{ y: bigY }}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease }}
            className="relative overflow-hidden rounded-[32px_32px_140px_32px] shadow-[0_50px_90px_-60px_rgba(41,43,37,0.7)]"
          >
            <SmartImage
              src={OFFICIAL.grandAnse}
              fallback={IMG.grandAnse}
              eager
              alt="Grand Anse Beach in Grenada — white sand curving around a turquoise bay"
              className="h-[62vh] min-h-[380px] w-full sm:h-[70vh] lg:h-[76vh]"
              imgClassName="h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-5 left-5 rounded-full bg-cream/92 px-4 py-2 text-[0.6875rem] font-medium tracking-[0.2em] text-cocoa uppercase">
              The Spice Isle — Grenada
            </figcaption>
          </motion.figure>

          <motion.figure
            style={{ y: smallY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
            className="absolute -bottom-6 left-2 w-40 overflow-hidden rounded-[24px_24px_24px_90px] border-[6px] border-cream shadow-[0_30px_60px_-35px_rgba(41,43,37,0.8)] sm:-bottom-8 sm:w-52 lg:-left-10 lg:w-60"
          >
            <SmartImage
              src={IMG.waterfall}
              fallback={IMG.waterfall}
              alt="A waterfall in Grenada's rainforest interior"
              className="aspect-[3/4] w-full"
            />
            <span className="absolute bottom-2 left-3 text-[0.625rem] tracking-[0.18em] text-cream uppercase drop-shadow">
              Mt. Carmel falls
            </span>
          </motion.figure>

          <div className="absolute -right-1 top-6 hidden rotate-90 origin-right text-[0.625rem] tracking-[0.35em] text-cocoa-3 uppercase xl:block">
            12°07′N · 61°45′W
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* C — Meet Annie                                                      */
/* ------------------------------------------------------------------ */

function MeetAnnie() {
  return (
    <section className="relative mx-auto mt-28 max-w-[1400px] px-5 sm:px-8 lg:mt-40" aria-labelledby="annie-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <figure className="relative">
            <SmartImage
              src={IMG.islandRoad}
              fallback={IMG.islandRoad}
              alt="A winding coastal road on the west coast of Grenada above the Caribbean sea"
              className="aspect-[4/5] w-full rounded-[180px_32px_32px_32px] shadow-[0_40px_80px_-55px_rgba(41,43,37,0.8)]"
            />
            <figcaption className="absolute -bottom-5 right-4 max-w-[16rem] rounded-2xl border border-cocoa/12 bg-cream px-4 py-3 text-[0.75rem] leading-relaxed text-cocoa-2 shadow-lg">
              <span className="eyebrow block text-terracotta">Owner &amp; operator</span>
              <span className="mt-1 block">Annie — the first voice you hear on WhatsApp, and the person waiting at arrivals.</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="lg:col-span-7 lg:pt-6">
          <Reveal>
            <Eyebrow>Meet your local</Eyebrow>
            <h2 id="annie-heading" className="display-lg mt-5 max-w-2xl">
              Your Grenada Experience <em className="font-normal italic text-terracotta">Starts with a Local.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-7 grid max-w-3xl gap-5 text-[1.0625rem] leading-relaxed text-cocoa-2 sm:grid-cols-2">
            <p>
              Island Vacation Taxi &amp; Tours is owned and operated by Annie — a Grenada-based service built around safe,
              comfortable and unforgettable travel across the island.
            </p>
            <p>
              Private taxi rides, airport transfers, beach excursions, sightseeing and customized days for individuals, couples,
              families and groups: every trip is arranged personally, not queued into a system.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-8 max-w-2xl border-l-2 border-terracotta pl-5">
            <p className="font-display text-2xl font-light italic leading-snug text-cocoa sm:text-[1.75rem]">
              “Whether you are arriving by cruise ship or staying for a relaxing vacation, we are here to help you explore the true
              beauty and culture of Grenada.”
            </p>
            <p className="eyebrow mt-3 text-cocoa-3">Island Vacation Taxi &amp; Tours</p>
          </Reveal>

          <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center gap-3">
            <Btn to="/about" variant="solid">
              More about the business
            </Btn>
            <Btn href={waLink(MSG.general("your stay in Grenada"))} variant="outline">
              <MessageCircle size={16} /> Message Annie
            </Btn>
          </Reveal>

          <Reveal delay={0.3} className="mt-6">
            <DemoNote>
              Annie's own photograph is not published in this concept — drop the official portrait into this slot when it is
              supplied. Copy above is taken from the business's own website.
            </DemoNote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* D — Four ways to explore                                            */
/* ------------------------------------------------------------------ */

const SERVICE_META: Record<ServiceKey, { n: string; tint: string; text: string; icon: typeof PlaneLanding }> = {
  "airport-transfer": { n: "01", tint: "bg-sea", text: "text-sea", icon: PlaneLanding },
  "private-taxi": { n: "02", tint: "bg-terracotta", text: "text-terracotta", icon: CarFront },
  "island-tour": { n: "03", tint: "bg-sage", text: "text-cocoa-2", icon: Trees },
  "cruise-excursion": { n: "04", tint: "bg-sun", text: "text-cocoa-2", icon: Ship },
};

function FourWays() {
  const { update, toast } = useBooking();
  const navigate = useNavigate();

  const start = (key: ServiceKey) => {
    const service = SERVICES.find((s) => s.key === key)!;
    update({ service: service.label });
    toast(`${service.label} selected — let's set the details.`, "info");
    navigate(key === "island-tour" ? "/build-your-tour" : key === "cruise-excursion" ? "/cruise-excursions" : "/transfers");
  };

  return (
    <section className="mx-auto mt-28 max-w-[1400px] px-5 sm:px-8 lg:mt-40" aria-labelledby="services-heading">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>What we do</Eyebrow>
          <h2 id="services-heading" className="display-lg mt-5 max-w-xl">
            Four ways to <em className="font-normal italic text-sea">explore</em> the island.
          </h2>
        </div>
        <p className="max-w-sm text-[0.9375rem] leading-relaxed text-cocoa-3">
          Every service is private to your party, air-conditioned, and scheduled around your arrival — not a shared timetable.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SERVICES.map((s, i) => {
          const meta = SERVICE_META[s.key];
          const Icon = meta.icon;
          return (
            <Reveal
              key={s.key}
              delay={i * 0.08}
              className={`${i % 2 === 1 ? "xl:mt-10" : ""} group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-cocoa/12 bg-white/55 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-cocoa/30 hover:bg-white`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className={`eyebrow ${meta.text}`}>{meta.n}</span>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full ${meta.tint} text-cream transition-transform duration-500 group-hover:rotate-12`}>
                    <Icon size={19} />
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[1.75rem] font-light leading-tight">{s.label}</h3>
                <p className="mt-1 text-[0.75rem] tracking-[0.14em] text-cocoa-3 uppercase">{s.short}</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-cocoa-2">{s.blurb}</p>
              </div>
              <button
                type="button"
                onClick={() => start(s.key)}
                className="mt-7 flex items-center justify-between border-t border-cocoa/12 pt-4 text-[0.8125rem] font-medium text-cocoa transition-colors hover:text-terracotta"
              >
                Book this service
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* E — Signature experiences (search + filter + animated gallery)      */
/* ------------------------------------------------------------------ */

type GalleryItem = {
  id: string;
  name: string;
  area: string;
  note: string;
  cat: string;
  tour?: string;
  image?: string;
  fallback?: string;
  alt?: string;
  tint?: string;
};

const GALLERY: GalleryItem[] = [
  { id: "g1", name: "Grand Anse Beach", area: "South-west coast", note: "Two miles of sheltered white sand.", cat: "Beaches", tour: "grand-anse-beach-tour", image: OFFICIAL.grandAnse, fallback: IMG.grandAnse, alt: "Grand Anse Beach, Grenada" },
  { id: "g2", name: "St. George's", area: "Capital waterfront", note: "Harbour, forts and market streets.", cat: "Culture", tour: "st-georges-city-tour", image: OFFICIAL.stGeorges, fallback: IMG.stGeorges, alt: "The Carenage waterfront in St. George's, Grenada" },
  { id: "g3", name: "Mt. Carmel Waterfall", area: "Interior, St. David", note: "A tall drop in deep forest.", cat: "Waterfalls", tour: "mt-carmel-waterfall-tour", image: OFFICIAL.mtCarmel, fallback: IMG.mtCarmel, alt: "Mt. Carmel Waterfall in Grenada" },
  { id: "g4", name: "Annandale Falls", area: "Central interior", note: "Easy walk, green woodland.", cat: "Waterfalls", image: IMG.waterfall, fallback: IMG.waterfall, alt: "A tropical waterfall in Grenada's rainforest" },
  { id: "g5", name: "Grand Etang Lake", area: "Rainforest highlands", note: "Crater lake, mist, giant bamboo.", cat: "Culture", image: IMG.grandEtang, fallback: IMG.grandEtang, alt: "Grand Etang crater lake in Grenada's rainforest" },
  { id: "g6", name: "Belmont Estate", area: "Northern parish", note: "Working spice and chocolate estate.", cat: "Culture", tint: "bg-terracotta" },
  { id: "g7", name: "Scenic island drives", area: "West coast road", note: "Hairpins, sea views, spice groves.", cat: "Culture", image: IMG.islandRoad, fallback: IMG.islandRoad, alt: "A winding coastal road in Grenada above the Caribbean sea" },
  { id: "g8", name: "Fort George", area: "St. George's hill", note: "18th-century ramparts over the bay.", cat: "Forts", tint: "bg-sea" },
  { id: "g9", name: "Fort Frederick", area: "St. George's ridge", note: "Hilltop fort, wide island views.", cat: "Forts", tint: "bg-cocoa" },
  { id: "g10", name: "Concord Falls", area: "North-west", note: "Three tiers reached by forest path.", cat: "Waterfalls", tint: "bg-terracotta" },
  { id: "g11", name: "Underwater Sculpture Park", area: "Molinare Bay", note: "Snorkel the sculptures offshore.", cat: "Beaches", tint: "bg-cocoa" },
  { id: "g12", name: "Spice plantations", area: "Island interior", note: "Nutmeg, mace, cocoa, cinnamon.", cat: "Culture", image: IMG.spice, fallback: IMG.spice, alt: "Drying nutmeg and mace at a Grenadian spice estate" },
];

const CATS = ["All", "Featured tours", "Beaches", "Waterfalls", "Forts", "Culture"];

function ExperiencesGallery() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const items = useMemo(
    () =>
      GALLERY.filter((g) => {
        const catOk = cat === "All" || (cat === "Featured tours" ? !!g.tour : g.cat === cat);
        const qOk =
          !q.trim() ||
          (g.name + " " + g.area + " " + g.note).toLowerCase().includes(q.trim().toLowerCase());
        return catOk && qOk;
      }),
    [cat, q]
  );

  return (
    <section className="mt-28 lg:mt-40" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Signature Grenada</Eyebrow>
            <h2 id="gallery-heading" className="display-lg mt-5 max-w-2xl">
              Places worth <em className="font-normal italic text-terracotta">building a day around.</em>
            </h2>
          </div>
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-cocoa-3">
            Three of these are named tours on the official site. The rest can be added to a customized itinerary — we do not claim
            fixed tour packages for them.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 flex flex-col gap-4 border-y border-cocoa/12 py-4 md:flex-row md:items-center md:justify-between">
          <div className="hide-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[0.8125rem] font-medium transition ${
                  cat === c ? "bg-cocoa text-cream" : "border border-cocoa/15 text-cocoa-2 hover:border-cocoa"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-3" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search destinations…"
              aria-label="Search destinations"
              className="w-full rounded-full border border-cocoa/15 bg-white/70 py-2.5 pl-11 pr-4 text-sm focus:border-terracotta focus:outline-none"
            />
          </div>
        </Reveal>

        {items.length === 0 ? (
          <div className="mt-10 rounded-[24px] border border-dashed border-cocoa/25 px-6 py-16 text-center">
            <Sparkles size={22} className="mx-auto text-terracotta" />
            <p className="mt-3 font-display text-2xl font-light">Nothing matches “{q}”</p>
            <p className="mt-2 text-[0.9375rem] text-cocoa-3">Try “waterfall”, “fort”, or clear the filters.</p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCat("All");
              }}
              className="mt-5 rounded-full border border-cocoa px-6 py-2.5 text-sm font-medium transition hover:bg-cocoa hover:text-cream"
            >
              Reset search
            </button>
          </div>
        ) : (
          <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g, i) => {
              const tall = i % 5 === 0;
              return (
                <motion.article
                  layout
                  key={g.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease }}
                  className={`group relative overflow-hidden rounded-[24px] border border-cocoa/12 ${
                    tall ? "lg:row-span-2" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigate(g.tour ? `/experiences/${g.tour}` : "/build-your-tour")}
                    className="block w-full text-left"
                    aria-label={g.tour ? `Open ${g.name} tour` : `Add ${g.name} to a custom itinerary`}
                  >
                    {g.image ? (
                      <div className={`relative overflow-hidden ${tall ? "aspect-[4/5]" : "aspect-[16/11]"}`}>
                        <SmartImage
                          src={g.image}
                          fallback={g.fallback ?? g.image}
                          alt={g.alt ?? g.name}
                          className="h-full w-full"
                          imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cocoa/75 via-cocoa/10 to-transparent" />
                      </div>
                    ) : (
                      <div className={`relative flex items-end ${tall ? "aspect-[4/5]" : "aspect-[16/11]"} ${g.tint} p-6`}>
                        <div aria-hidden className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-cream/30" />
                        <div aria-hidden className="absolute right-6 top-6 h-16 w-16 rounded-full border border-cream/25" />
                        <span className="font-display text-6xl font-light text-cream/85">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    )}

                    <div className={`p-5 ${g.image ? "bg-cream-2/70" : "bg-cream"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="eyebrow text-cocoa-3">{g.area}</span>
                        {g.tour && <span className="rounded-full bg-terracotta px-2.5 py-0.5 text-[0.625rem] font-bold tracking-wider text-cream uppercase">Tour</span>}
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-light leading-tight">{g.name}</h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-cocoa-3">{g.note}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-cocoa transition-colors group-hover:text-terracotta">
                        {g.tour ? "View experience" : "Add to itinerary"}
                        <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </button>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* F — Itinerary builder                                               */
/* ------------------------------------------------------------------ */

function BuilderSection() {
  return (
    <section className="mt-28 lg:mt-40" aria-labelledby="builder-heading">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <Eyebrow>Interactive itinerary builder</Eyebrow>
          <h2 id="builder-heading" className="display-lg mt-5">
            One Island. <em className="font-normal italic text-sea">Endless Possibilities.</em>
          </h2>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa-2">
            Choose your date, pick a half or full day, then drop your stops onto the island map. We keep the route inside a
            sensible time budget and hand you a quote request you can send to Annie in one tap.
          </p>
        </Reveal>

        <div className="mt-10">
          <ItineraryBuilder compact />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* G — Airport arrival experience                                      */
/* ------------------------------------------------------------------ */

const ARRIVAL_STEPS = [
  { icon: PlaneLanding, title: "Arrival", detail: "Touch down at Maurice Bishop International Airport." },
  { icon: UserCheck, title: "Driver pickup", detail: "Your name at arrivals, luggage handled for you." },
  { icon: CarFront, title: "Comfortable transfer", detail: "Air-conditioned, private, straight to your stay." },
  { icon: MapPin, title: "Destination", detail: "Hotel, villa, guesthouse or the cruise port." },
];

function ArrivalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative mt-28 overflow-hidden bg-cocoa py-16 text-cream lg:mt-40 lg:py-24" aria-labelledby="arrival-heading">
      <div className="grain absolute inset-0 opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow tone="cream">Airport arrivals</Eyebrow>
            <h2 id="arrival-heading" className="display-lg mt-5 max-w-2xl text-cream">
              Land. Relax. <em className="font-normal italic text-sun">We'll Take It From Here.</em>
            </h2>
          </div>
          <Btn to="/transfers" variant="cream">
            Book an airport transfer <ArrowRight size={16} />
          </Btn>
        </div>

        <div ref={ref} className="relative mt-14">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-cream/20 md:block" aria-hidden>
            <motion.div
              className="h-px origin-left bg-sun"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.6, ease }}
            />
          </div>

          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {ARRIVAL_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.22, ease }}
                  className="relative"
                >
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-cream/25 bg-cocoa text-sun">
                    <Icon size={20} />
                  </span>
                  <span className="eyebrow mt-5 block text-cream/45">Step {i + 1}</span>
                  <h3 className="mt-1.5 font-display text-2xl font-light text-cream">{s.title}</h3>
                  <p className="mt-2 max-w-[16rem] text-[0.875rem] leading-relaxed text-cream/65">{s.detail}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <p className="mt-12 max-w-2xl border-t border-cream/15 pt-6 text-[0.875rem] leading-relaxed text-cream/55">
          Tell us your flight number and arrival time and the pickup is tracked against it. Departures are planned the same way,
          with a pickup that works backwards from your check-in.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* H — Cruise visitors                                                 */
/* ------------------------------------------------------------------ */

function CruiseSection() {
  const [ship, setShip] = useState("");
  const [date, setDate] = useState("");
  const [arrive, setArrive] = useState("08:00");
  const [depart, setDepart] = useState("17:00");
  const [pax, setPax] = useState(4);
  const [interest, setInterest] = useState("St. George's + Grand Anse");
  const [ack, setAck] = useState(true);
  const { toast } = useBooking();

  const send = () => {
    if (!date) return toast("Choose your date in port first.", "warn");
    if (!ack) return toast("Please confirm you need to return to the ship.", "warn");
    window.open(
      waLink(
        MSG.cruise({
          ship: ship || "our cruise ship",
          date: new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" }),
          arrive,
          depart,
          pax,
          interest,
        })
      ),
      "_blank",
      "noopener"
    );
    toast("WhatsApp opened with your port schedule prefilled — press send when ready.", "info");
  };

  return (
    <section className="mx-auto mt-28 max-w-[1400px] px-5 sm:px-8 lg:mt-40" aria-labelledby="cruise-heading">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-6">
          <figure className="relative overflow-hidden rounded-[32px_140px_32px_32px]">
            <SmartImage
              src={IMG.cruisePort}
              fallback={IMG.cruisePort}
              alt="A cruise ship berthed at the cruise terminal in St. George's, Grenada"
              className="aspect-[5/4] w-full"
              imgClassName="h-full w-full object-cover"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-cream/92 px-4 py-1.5 text-[0.625rem] font-medium tracking-[0.2em] uppercase">
              Port of St. George's
            </figcaption>
          </figure>
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Cruise visitors</Eyebrow>
            <h2 id="cruise-heading" className="display-lg mt-5">
              Make Every Hour <em className="font-normal italic text-terracotta">Ashore Count.</em>
            </h2>
            <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-cocoa-2">
              Your ship waits for nobody — so the plan is built backwards from all-aboard. Tell us when you arrive, when you must
              be back, and how many of you there are.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-7 rounded-[24px] border border-cocoa/12 bg-white/60 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="eyebrow mb-2 block text-cocoa-3">Cruise ship name</span>
                <input value={ship} onChange={(e) => setShip(e.target.value)} placeholder="e.g. Vision of the Seas" className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none" />
              </label>
              <label className="block">
                <span className="eyebrow mb-2 block text-cocoa-3">Date in port</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none" />
              </label>
              <label className="block">
                <span className="eyebrow mb-2 block text-cocoa-3">Group size</span>
                <select value={pax} onChange={(e) => setPax(Number(e.target.value))} className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n} value={n}>{n} passengers</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="eyebrow mb-2 block text-cocoa-3">Arrival time</span>
                <select value={arrive} onChange={(e) => setArrive(e.target.value)} className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none">
                  {["06:30", "07:00", "08:00", "09:00", "10:00", "11:00"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="eyebrow mb-2 block text-cocoa-3">All aboard</span>
                <select value={depart} onChange={(e) => setDepart(e.target.value)} className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none">
                  {["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="eyebrow mb-2 block text-cocoa-3">Preferred tour</span>
                <select value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none">
                  {["St. George's + Grand Anse", "Waterfall morning", "Full island highlights", "Beach afternoon", "Custom — I'll describe on WhatsApp"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-sun/20 px-4 py-3">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1 h-4 w-4 accent-[#BB6C4C]" />
              <span className="text-[0.875rem] leading-snug text-cocoa-2">
                We must return to the cruise terminal before all-aboard — plan the day backwards from it.
              </span>
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <Btn onClick={send} variant="terracotta">
                <MessageCircle size={16} /> Request port itinerary
              </Btn>
              <Btn to="/cruise-excursions" variant="outline">
                Cruise excursion details
              </Btn>
            </div>
            <DemoNote className="mt-4">Opens WhatsApp with your details prefilled. Nothing is sent until you press send.</DemoNote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* I — Destination story                                               */
/* ------------------------------------------------------------------ */

const STORY = [
  { word: "Waterfalls", img: IMG.waterfall, alt: "A waterfall in Grenada's rainforest", copy: "Mt. Carmel, Annandale and Concord — three different ways to meet the island's water." },
  { word: "Spice plantations", img: IMG.spice, alt: "Nutmeg and mace drying at a Grenadian spice estate", copy: "Nutmeg cracked by hand, mace drying in the sun, cocoa fermenting under corrugated tin." },
  { word: "Beaches", img: IMG.grandAnse, alt: "Grand Anse Beach in Grenada", copy: "Sheltered bays on the west coast, and quiet sand at the end of a dirt track." },
  { word: "Rainforests", img: IMG.grandEtang, alt: "Grand Etang crater lake in the rainforest", copy: "Crater lake, giant bamboo, mist sitting on the ridge by mid-morning." },
  { word: "Local culture", img: IMG.stGeorges, alt: "The Carenage waterfront in St. George's, Grenada", copy: "Market stalls, waterfront conversations, and a capital that still runs at island pace." },
  { word: "Scenic drives", img: IMG.islandRoad, alt: "A winding coastal road in Grenada", copy: "Hairpin bends above the Caribbean, with a view at every second corner." },
];

function StorySection() {
  return (
    <section className="mt-28 overflow-hidden lg:mt-40" aria-labelledby="story-heading">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow>The island, in six chapters</Eyebrow>
          <h2 id="story-heading" className="display-lg mt-5">
            Grenada is not one thing. <em className="font-normal italic text-sea">It is six.</em>
          </h2>
        </Reveal>
      </div>

      <div className="mt-12 space-y-6 sm:space-y-8">
        {STORY.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={s.word} delay={0.05} className={`mx-auto flex max-w-[1400px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center ${flip ? "lg:flex-row-reverse" : ""}`}>
              <figure className={`relative overflow-hidden rounded-[28px] lg:w-[58%] ${flip ? "lg:rounded-[140px_28px_28px_28px]" : "lg:rounded-[28px_28px_140px_28px]"}`}>
                <SmartImage
                  src={s.img}
                  fallback={s.img}
                  alt={s.alt}
                  className="aspect-[16/10] w-full"
                  imgClassName="h-full w-full object-cover"
                />
                <span className="absolute left-5 top-5 rounded-full bg-cream/90 px-3 py-1 text-[0.625rem] font-bold tracking-[0.2em] uppercase">
                  {String(i + 1).padStart(2, "0")} — {s.word}
                </span>
              </figure>
              <div className={`lg:w-[42%] ${flip ? "lg:pr-4" : "lg:pl-4"}`}>
                <h3 className="display-md">
                  <span className="italic text-terracotta">{s.word}</span>
                </h3>
                <p className="mt-3 max-w-md text-[1rem] leading-relaxed text-cocoa-2">{s.copy}</p>
                <div className="mt-5">
                  <Btn to="/build-your-tour" variant="outline" size="sm">
                    Build a day around this <ArrowUpRight size={14} />
                  </Btn>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* J — Final CTA                                                       */
/* ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="relative mx-auto mt-28 max-w-[1400px] px-5 sm:px-8 lg:mt-40" aria-labelledby="cta-heading">
      <Reveal className="relative overflow-hidden rounded-[36px] border border-cocoa/12 bg-cream-2 px-6 py-16 text-center sm:px-12 lg:py-24">
        <div aria-hidden className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sun/35" />
        <div aria-hidden className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-sage/35" />
        <div className="relative mx-auto max-w-3xl">
          <Eyebrow className="justify-center">Your island. Your journey.</Eyebrow>
          <h2 id="cta-heading" className="display-xl mt-6">
            Your Grenada Story <em className="font-normal italic text-terracotta">Is Waiting.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[1.0625rem] leading-relaxed text-cocoa-2">
            Tell Annie the dates, the group and the places you want to see — you'll get a personal answer, not an automated
            confirmation.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Btn to="/build-your-tour" variant="solid" size="lg">
              Build My Journey <ArrowRight size={16} />
            </Btn>
            <Btn href={waLink(MSG.general("planning my Grenada trip"))} variant="terracotta" size="lg">
              <MessageCircle size={17} /> Chat on WhatsApp
            </Btn>
          </div>
          <p className="eyebrow mt-8 text-cocoa-3">{BUSINESS.phoneDisplay} · {BUSINESS.email}</p>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function Home() {
  usePageMeta(
    "Island Vacation Taxi & Tours | Grenada Airport Transfers, Private Taxi & Island Tours",
    "Private airport transfers, taxi rides, island sightseeing and St. George's cruise excursions in Grenada. Owned and operated by Annie. Plan your Spice Isle journey.",
    "Grenada airport transfers, private taxi Grenada, Grenada island tours, St. George's cruise excursions, Grand Anse beach tours, Grenada private sightseeing"
  );

  return (
    <>
      <Hero />
      <BookingBar />
      <MeetAnnie />
      <FourWays />
      <ExperiencesGallery />
      <BuilderSection />
      <ArrivalSection />
      <CruiseSection />
      <StorySection />
      <FinalCTA />
      <div className="h-16 sm:h-0" />
    </>
  );
}
