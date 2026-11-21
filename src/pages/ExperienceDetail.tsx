import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock, MapPin, MessageCircle, Users, CalendarDays } from "lucide-react";
import { TOURS, tourBySlug, DESTINATIONS, MSG, waLink, BUSINESS } from "@/lib/data";
import { useBooking } from "@/lib/store";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Btn, Eyebrow, Reveal, SmartImage, DemoNote, usePageMeta, ease } from "@/components/ui";

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function ExperienceDetail() {
  const { slug = "" } = useParams();
  const tour = tourBySlug(slug);
  const navigate = useNavigate();
  const { update, toast } = useBooking();

  const [date, setDate] = useState(todayPlus(7));
  const [time, setTime] = useState<string | undefined>("09:30");
  const [guests, setGuests] = useState(2);

  usePageMeta(
    tour ? `${tour.name} | Island Vacation Taxi & Tours, Grenada` : "Experience not found | Island Vacation Taxi & Tours",
    tour ? tour.summary : "The requested Grenada experience could not be found.",
    tour?.keywords
  );

  const relatedTours = useMemo(() => TOURS.filter((t) => t.slug !== slug).slice(0, 2), [slug]);
  const relatedStops = useMemo(() => DESTINATIONS.filter((d) => d.featuredTour !== slug).slice(0, 4), [slug]);

  if (!tour) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-40 text-center">
        <Eyebrow className="justify-center">404</Eyebrow>
        <h1 className="display-lg mt-5">That experience has sailed.</h1>
        <p className="mt-4 text-cocoa-2">The tour you are looking for is not in our list.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Btn to="/experiences" variant="solid">All experiences</Btn>
          <Btn to="/" variant="outline">Back home</Btn>
        </div>
      </div>
    );
  }

  const book = () => {
    if (!date) return toast("Choose a date for this experience.", "warn");
    if (!time) return toast("Choose an available time slot.", "warn");
    update({
      service: tour.name,
      date,
      time,
      passengers: guests,
      pickup: tour.pickups[0],
      dropoff: tour.pickups[0],
      notes: `${tour.name} · ${guests} guests`,
    });
    toast(`${tour.name} added — complete your details next.`, "info");
    navigate("/booking");
  };

  const waTour = () =>
    window.open(
      waLink(
        MSG.tour({
          date: new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
          guests,
          interests: [tour.name],
          pickup: tour.pickups[0],
        })
      ),
      "_blank",
      "noopener"
    );

  return (
    <>
      {/* cinematic header */}
      <header className="relative">
        <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
          <SmartImage
            src={tour.image}
            fallback={tour.fallback}
            alt={tour.alt}
            eager
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/35 to-cocoa/25" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-5 pb-10 sm:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
              <Link to="/experiences" className="eyebrow inline-flex items-center gap-2 text-cream/75 hover:text-cream">
                <ArrowLeft size={14} /> All experiences
              </Link>
              <h1 className="display-xl mt-4 max-w-4xl text-cream">{tour.name}</h1>
              <p className="mt-4 max-w-xl font-display text-xl font-light italic text-cream/85 sm:text-2xl">{tour.tagline}</p>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:gap-14">
          {/* main column */}
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{tour.eyebrow}</Eyebrow>
              <p className="mt-6 font-display text-[1.5rem] font-light leading-snug text-cocoa sm:text-[1.75rem]">{tour.summary}</p>
              <div className="mt-6 space-y-4 text-[1rem] leading-relaxed text-cocoa-2">
                {tour.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08} className="mt-10">
              <h2 className="display-md">Highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 rounded-2xl border border-cocoa/12 bg-white/60 px-4 py-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/40">
                      <Check size={13} className="text-cocoa" />
                    </span>
                    <span className="text-[0.9375rem] leading-snug text-cocoa-2">{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="mt-12">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="display-md">Suggested itinerary</h2>
                <span className="eyebrow text-terracotta">Illustrative</span>
              </div>
              <ol className="relative mt-6 border-l border-dashed border-cocoa/25 pl-6">
                {tour.itinerary.map((s) => (
                  <li key={s.time} className="relative pb-7 last:pb-0">
                    <span className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full border-2 border-cream bg-terracotta" aria-hidden />
                    <span className="eyebrow block text-cocoa-3 tabular-nums">{s.time}</span>
                    <h3 className="mt-1 font-display text-xl font-light">{s.label}</h3>
                    <p className="mt-1 max-w-lg text-[0.9375rem] leading-relaxed text-cocoa-3">{s.detail}</p>
                  </li>
                ))}
              </ol>
              <DemoNote>
                Times are illustrative and show the shape of the day only — they are not published durations. Your final schedule is
                agreed with Annie when you book.
              </DemoNote>
            </Reveal>

            <Reveal delay={0.08} className="mt-12">
              <h2 className="display-md">Pickup options</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {tour.pickups.map((p) => (
                  <span key={p} className="inline-flex items-center gap-2 rounded-full border border-cocoa/15 bg-white/60 px-4 py-2 text-[0.875rem]">
                    <MapPin size={14} className="text-sea" /> {p}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-cocoa-3">
                Villa, guesthouse and private-address pickups are fine too — just tell us the address when you enquire on{" "}
                <a href={`tel:${BUSINESS.phoneRaw}`} className="text-terracotta underline underline-offset-4">
                  {BUSINESS.phoneDisplay}
                </a>
                .
              </p>
            </Reveal>
          </div>

          {/* booking rail */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-[26px] border border-cocoa/12 bg-cream-2/80 p-5 shadow-[0_40px_80px_-60px_rgba(41,43,37,0.7)] sm:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-2xl font-light">Check availability</h2>
                  <span className="eyebrow text-cocoa-3">Demo</span>
                </div>

                <div className="mt-4">
                  <AvailabilityCalendar
                    selectedDate={date}
                    selectedTime={time}
                    passengers={guests}
                    onSelectDate={(k) => {
                      setDate(k);
                      setTime(undefined);
                    }}
                    onSelectTime={setTime}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="eyebrow mb-2 flex items-center gap-1.5 text-cocoa-3"><Users size={12} /> Guests</span>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="eyebrow mb-2 flex items-center gap-1.5 text-cocoa-3"><CalendarDays size={12} /> Date</span>
                    <input
                      type="date"
                      value={date}
                      min={todayPlus(0)}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] focus:border-terracotta focus:outline-none"
                    />
                  </label>
                </div>

                <p className="mt-4 flex items-center gap-2 text-[0.875rem] text-cocoa-2">
                  <Clock size={14} className="text-terracotta" />
                  {time ? `Selected: ${time} on ${date}` : "Select an available time above"}
                </p>

                <div className="mt-5 grid gap-2.5">
                  <Btn onClick={book} variant="terracotta" size="lg">
                    Book this experience <ArrowRight size={16} />
                  </Btn>
                  <Btn onClick={waTour} variant="outline">
                    <MessageCircle size={16} /> Ask Annie on WhatsApp
                  </Btn>
                </div>

                <DemoNote className="mt-4">
                  No payment is taken. This creates a demo reservation you can look up under “My booking”.
                </DemoNote>
              </div>

              {/* related */}
              <div className="mt-6 rounded-[26px] border border-cocoa/12 bg-white/60 p-5">
                <Eyebrow>Related experiences</Eyebrow>
                <ul className="mt-4 space-y-3">
                  {relatedTours.map((t) => (
                    <li key={t.slug}>
                      <Link to={`/experiences/${t.slug}`} className="group flex items-center justify-between gap-3 border-b border-cocoa/10 pb-3">
                        <span className="font-display text-lg font-light group-hover:text-terracotta">{t.name}</span>
                        <ArrowRight size={15} className="text-cocoa-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedStops.map((d) => (
                    <Link
                      key={d.id}
                      to="/build-your-tour"
                      className="rounded-full border border-cocoa/15 px-3 py-1.5 text-[0.75rem] transition hover:bg-cocoa hover:text-cream"
                    >
                      + {d.name}
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-cocoa-3">
                  These are destinations for a customized day — not separately packaged tours.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
