import { MessageCircle, ArrowRight, Check } from "lucide-react";
import { BUSINESS, IMG, OFFICIAL, MSG, waLink, SERVICES } from "@/lib/data";
import { Btn, Eyebrow, Reveal, SmartImage, DemoNote, usePageMeta } from "@/components/ui";
import { Link } from "react-router-dom";

export default function About() {
  usePageMeta(
    "About Annie | Island Vacation Taxi & Tours — Grenada",
    "Island Vacation Taxi & Tours is owned and operated by Annie, providing safe, comfortable transportation and unforgettable travel experiences across Grenada.",
    "about Island Vacation Taxi and Tours Grenada, Annie Grenada taxi driver, Grenada local tour operator"
  );

  return (
    <>
      <header className="relative overflow-hidden pt-32 pb-12 sm:pt-36">
        <div aria-hidden className="absolute -right-24 top-8 h-80 w-80 rounded-full bg-terracotta/15" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow>About the business</Eyebrow>
          <h1 className="display-xl mt-6 max-w-4xl">
            Owned &amp; operated by <em className="font-normal italic text-terracotta">Annie.</em>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <figure className="overflow-hidden rounded-[32px_32px_140px_32px]">
                <SmartImage
                  src={OFFICIAL.why}
                  fallback={IMG.islandRoad}
                  alt="Island Vacation Taxi & Tours in Grenada — island transport and sightseeing"
                  className="aspect-[16/10] w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </figure>
            </Reveal>

            <Reveal delay={0.08} className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-cocoa-2">
              <p className="font-display text-[1.5rem] font-light leading-snug text-cocoa sm:text-[1.75rem]">
                Welcome to Island Vacation Taxi &amp; Tours, your trusted transportation and tour service in beautiful Grenada.
                Owned and operated by Annie, our business is dedicated to providing visitors with safe, comfortable, and
                unforgettable travel experiences across the island.
              </p>
              <p>
                At Island Vacation Taxi &amp; Tours we take pride in offering reliable taxi services, airport transfers, private
                island tours, beach excursions, sightseeing trips, and customized transportation for individuals, couples,
                families, and groups. Whether you are arriving by cruise ship or staying for a relaxing vacation, we are here to
                help you explore the true beauty and culture of Grenada.
              </p>
              <p>
                Every journey is arranged personally. There is no call centre and no shared shuttle — just a local who knows the
                roads, the timings and the places worth stopping for.
              </p>
            </Reveal>

            <Reveal delay={0.12} className="mt-10">
              <h2 className="display-md">Our services include</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <li key={s.key} className="flex gap-3 rounded-2xl border border-cocoa/12 bg-white/60 p-4">
                    <Check size={16} className="mt-1 shrink-0 text-terracotta" />
                    <span>
                      <Link to={s.path} className="block font-display text-xl font-light hover:text-terracotta">
                        {s.label}
                      </Link>
                      <span className="mt-1 block text-[0.875rem] leading-snug text-cocoa-3">{s.blurb}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14} className="mt-10 border-l-2 border-terracotta pl-6">
              <p className="font-display text-2xl font-light italic leading-snug sm:text-[1.75rem]">
                “Customer satisfaction is our top priority. We are passionate about sharing the beauty, history, and warm
                hospitality of Grenada with every visitor.”
              </p>
              <p className="eyebrow mt-3 text-cocoa-3">Island Vacation Taxi &amp; Tours</p>
            </Reveal>

            <Reveal delay={0.16} className="mt-8">
              <DemoNote>
                This concept deliberately does not invent a founding date, fleet size, certifications, awards, prices or customer
                reviews — none of that information is published by the business. Add it here once it is supplied.
              </DemoNote>
            </Reveal>
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <Reveal className="rounded-[28px] bg-cocoa p-6 text-cream">
                <Eyebrow tone="cream">Talk to Annie</Eyebrow>
                <p className="mt-4 font-display text-3xl font-light leading-snug text-cream">
                  Questions about pickups, timing or a custom day?
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-cream/70">
                  Send the dates and the group size and you will get a personal reply — bookings, transport questions, cruise port
                  pickups, sightseeing tours and special requests.
                </p>
                <div className="mt-6 grid gap-2.5">
                  <Btn href={waLink(MSG.general("booking a transfer or tour"))} variant="cream">
                    <MessageCircle size={16} /> WhatsApp {BUSINESS.phoneDisplay}
                  </Btn>
                  <Btn to="/contact" variant="outline" className="border-cream/30 text-cream hover:bg-cream hover:text-cocoa">
                    Send a message <ArrowRight size={15} />
                  </Btn>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="mt-6 overflow-hidden rounded-[28px] border border-cocoa/12 bg-white/60">
                <SmartImage
                  src={IMG.spice}
                  fallback={IMG.spice}
                  alt="Nutmeg and spices drying at a Grenadian estate"
                  className="aspect-[4/3] w-full"
                  imgClassName="h-full w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="font-display text-2xl font-light">Island-wide coverage</h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-cocoa-2">
                    Airport, cruise port, hotels, villas, beaches, waterfalls, forts, estates and viewpoints — anywhere in
                    Grenada, one-way or for the whole day.
                  </p>
                  <Btn to="/build-your-tour" variant="outline" size="sm" className="mt-4">
                    Plan a day <ArrowRight size={14} />
                  </Btn>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
