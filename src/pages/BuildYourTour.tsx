import ItineraryBuilder from "@/components/ItineraryBuilder";
import { DESTINATIONS } from "@/lib/data";
import { Btn, Eyebrow, Reveal, DemoNote, usePageMeta } from "@/components/ui";
import { MessageCircle } from "lucide-react";
import { MSG, waLink } from "@/lib/data";

const FAQ = [
  {
    q: "How long should I give each stop?",
    a: "The builder uses illustrative dwell times so a day never overruns on paper. The real rhythm is yours — Annie will confirm what is achievable when she sees your list.",
  },
  {
    q: "Can I combine a featured tour with my own stops?",
    a: "Yes. Grand Anse, St. George's and Mt. Carmel can appear in a customized day as well as being booked on their own pages.",
  },
  {
    q: "Do you publish drive times or distances?",
    a: "No — and this site does not invent them. The route on the map is illustrative, and the budget meter exists purely to keep a plan realistic.",
  },
  {
    q: "What happens after I request the itinerary?",
    a: "Your stops are prefilled into a WhatsApp message for Annie. Nothing sends automatically, and no payment is taken anywhere on this site.",
  },
];

export default function BuildYourTour() {
  usePageMeta(
    "Build Your Own Grenada Tour | Interactive Itinerary Builder — Island Vacation Taxi & Tours",
    "Design a private Grenada itinerary: choose your date, half or full day, pick destinations on the island map, reorder your stops and request a personalized quote from Annie.",
    "Grenada private sightseeing, custom Grenada tour builder, Grenada island tour planner"
  );

  return (
    <>
      <header className="relative overflow-hidden pt-32 pb-10 sm:pt-36">
        <div aria-hidden className="absolute -right-16 top-4 h-72 w-72 rounded-full bg-sun/25" />
        <div aria-hidden className="absolute -left-20 top-40 h-56 w-56 rounded-full bg-sage/25" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow>Interactive itinerary builder</Eyebrow>
          <h1 className="display-xl mt-6 max-w-4xl">
            One Island. <em className="font-normal italic text-sea">Endless Possibilities.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-cocoa-2">
            Pick a date, choose a half or full day, then drop your stops onto the island. The budget meter keeps the plan honest,
            and your finished route travels with you into the booking form or straight to Annie's WhatsApp.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8" aria-label="Itinerary builder">
        <ItineraryBuilder />
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8" aria-labelledby="faq-heading">
        <div className="grid gap-10 border-t border-cocoa/12 pt-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>Good to know</Eyebrow>
            <h2 id="faq-heading" className="display-lg mt-5">Before you build.</h2>
            <div className="mt-6">
              <Btn href={waLink(MSG.itinerary({ date: "a date to be confirmed", length: "a full day", stops: DESTINATIONS.slice(0, 3).map((d) => d.name), pax: 2, pickup: "my hotel" }))} variant="terracotta">
                <MessageCircle size={16} /> Ask Annie a question
              </Btn>
            </div>
            <DemoNote className="mt-5">
              Mock availability and illustrative time budgets only. Every route is confirmed personally before anything is booked.
            </DemoNote>
          </div>

          <dl className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06} className="rounded-2xl border border-cocoa/12 bg-white/60 p-5">
                <dt className="font-display text-xl font-light leading-snug">{f.q}</dt>
                <dd className="mt-2.5 text-[0.875rem] leading-relaxed text-cocoa-2">{f.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal delay={0.1} className="mt-12">
          <Eyebrow>All destinations in the builder</Eyebrow>
          <div className="mt-4 flex flex-wrap gap-2">
            {DESTINATIONS.map((d) => (
              <span key={d.id} className="rounded-full border border-cocoa/15 bg-white/60 px-4 py-2 text-[0.8125rem]">
                {d.name} <span className="text-cocoa-3">· ≈{d.minutes}m</span>
              </span>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
