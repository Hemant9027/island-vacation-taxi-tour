import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, MapPin, CheckCircle2, Send, ArrowRight } from "lucide-react";
import { BUSINESS, MSG, waLink } from "@/lib/data";
import { Btn, Eyebrow, Reveal, DemoNote, usePageMeta, Field, inputCls, ease } from "@/components/ui";
import { useBooking } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2, "Please tell us your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Include a phone number Annie can reply to"),
  country: z.string().min(2, "Which country are you travelling from?"),
  subject: z.string().min(1, "Choose a subject"),
  message: z.string().min(15, "A little more detail, please — at least 15 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  usePageMeta(
    "Contact Island Vacation Taxi & Tours | Grenada",
    `Contact Annie at Island Vacation Taxi & Tours in Grenada — WhatsApp ${BUSINESS.phoneDisplay}, email ${BUSINESS.email}. Bookings, transfers, cruise port pickups and custom tours.`,
    "contact Island Vacation Taxi and Tours, Grenada taxi WhatsApp, Grenada tour enquiry"
  );

  const { toast } = useBooking();
  const [sent, setSent] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { subject: "Island tour", country: "" } });

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 700));
    setSent(values);
    toast("Message captured in demo mode — nothing was actually sent.", "info");
    reset({ ...values, message: "" });
  };

  const waPrefill = () =>
    waLink(
      sent
        ? `Hello Annie! My name is ${sent.name} (${sent.country}). Enquiry about: ${sent.subject}. ${sent.message} You can reach me at ${sent.email} / ${sent.phone}.`
        : MSG.general("your services in Grenada")
    );

  return (
    <>
      <header className="relative overflow-hidden pt-32 pb-10 sm:pt-36">
        <div aria-hidden className="absolute -left-16 top-6 h-64 w-64 rounded-full bg-sea/20" />
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="display-xl mt-6 max-w-3xl">
            Say hello to <em className="font-normal italic text-terracotta">the island.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cocoa-2">
            Bookings, transportation questions, cruise port pickups, sightseeing tours and special travel requests — Annie is
            happy to assist.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* form */}
          <section aria-labelledby="contact-form-heading" className="lg:col-span-7">
            <div className="rounded-[28px] border border-cocoa/12 bg-white/60 p-5 sm:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="contact-form-heading" className="font-display text-3xl font-light">Send a message</h2>
                <span className="rounded-full bg-sun/30 px-3 py-1 text-[0.625rem] font-bold tracking-[0.16em] uppercase">Demo mode</span>
              </div>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="mt-6 rounded-[22px] border border-sea/40 bg-sea/10 p-6"
                >
                  <CheckCircle2 size={26} className="text-sea" />
                  <h3 className="mt-4 font-display text-2xl font-light">Thanks, {sent.name.split(" ")[0]} — your message is ready.</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-cocoa-2">
                    This is a front-end demonstration, so nothing was transmitted. To actually reach Annie, send the same details
                    on WhatsApp or email — she replies personally.
                  </p>
                  <dl className="mt-5 space-y-2 text-[0.875rem]">
                    <div className="flex gap-3"><dt className="w-24 text-cocoa-3">Subject</dt><dd className="font-medium">{sent.subject}</dd></div>
                    <div className="flex gap-3"><dt className="w-24 text-cocoa-3">From</dt><dd className="font-medium">{sent.email} · {sent.phone}</dd></div>
                    <div className="flex gap-3"><dt className="w-24 text-cocoa-3">Country</dt><dd className="font-medium">{sent.country}</dd></div>
                  </dl>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Btn href={waPrefill()} variant="terracotta">
                      <MessageCircle size={16} /> Continue on WhatsApp
                    </Btn>
                    <Btn onClick={() => setSent(null)} variant="outline">
                      Write another
                    </Btn>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name?.message}>
                    <input {...register("name")} placeholder="Your name" className={inputCls} aria-invalid={!!errors.name} />
                  </Field>
                  <Field label="Email" error={errors.email?.message}>
                    <input {...register("email")} type="email" placeholder="you@example.com" className={inputCls} aria-invalid={!!errors.email} />
                  </Field>
                  <Field label="Phone / WhatsApp" error={errors.phone?.message}>
                    <input {...register("phone")} placeholder="+1 …" className={inputCls} aria-invalid={!!errors.phone} />
                  </Field>
                  <Field label="Country" error={errors.country?.message}>
                    <input {...register("country")} placeholder="Where you're travelling from" className={inputCls} aria-invalid={!!errors.country} />
                  </Field>
                  <Field label="Subject" error={errors.subject?.message} className="sm:col-span-2">
                    <select {...register("subject")} className={inputCls} aria-invalid={!!errors.subject}>
                      {["Airport transfer", "Private taxi", "Island tour", "Cruise excursion", "Something else"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Message" hint="dates, group size, questions" error={errors.message?.message} className="sm:col-span-2">
                    <textarea {...register("message")} placeholder="We arrive on 14 March with two children and would love a waterfalls day…" className={`${inputCls} min-h-36 resize-y`} aria-invalid={!!errors.message} />
                  </Field>

                  <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                    <Btn type="submit" variant="solid" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Sending…" : <>Send message <Send size={15} /></>}
                    </Btn>
                    <Btn href={waLink(MSG.general("your services"))} variant="outline" size="lg">
                      <MessageCircle size={16} /> Or WhatsApp Annie
                    </Btn>
                  </div>
                  <div className="sm:col-span-2">
                    <DemoNote>Front-end demo: the form validates and confirms, but no data leaves your browser.</DemoNote>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* details */}
          <aside className="lg:col-span-5">
            <Reveal className="rounded-[28px] bg-cocoa p-6 text-cream">
              <Eyebrow tone="cream">Direct lines</Eyebrow>
              <ul className="mt-5 space-y-4">
                <li>
                  <a href={`tel:${BUSINESS.phoneRaw}`} className="group flex items-start gap-3">
                    <Phone size={17} className="mt-1 text-sun" />
                    <span>
                      <span className="block eyebrow text-cream/50">Phone / WhatsApp</span>
                      <span className="block font-display text-2xl font-light tabular-nums group-hover:text-sun">{BUSINESS.phoneDisplay}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${BUSINESS.email}`} className="group flex items-start gap-3">
                    <Mail size={17} className="mt-1 text-sun" />
                    <span>
                      <span className="block eyebrow text-cream/50">Email</span>
                      <span className="block break-all font-display text-xl font-light group-hover:text-sun">{BUSINESS.email}</span>
                    </span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={17} className="mt-1 text-sun" />
                  <span>
                    <span className="block eyebrow text-cream/50">Based in</span>
                    <span className="block font-display text-xl font-light">Grenada, West Indies</span>
                  </span>
                </li>
              </ul>
              <Btn href={waLink(MSG.general("my Grenada trip"))} variant="cream" className="mt-6 w-full">
                <MessageCircle size={16} /> Start a WhatsApp chat
              </Btn>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 rounded-[28px] border border-cocoa/12 bg-white/60 p-6">
              <h2 className="font-display text-2xl font-light">What to include</h2>
              <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-cocoa-2">
                {[
                  "Arrival date and time — or your ship's port schedule",
                  "Number of passengers and large bags",
                  "Pickup point: airport, cruise terminal, hotel or villa",
                  "Places you would most like to see",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-terracotta" />
                    {t}
                  </li>
                ))}
              </ul>
              <Btn to="/build-your-tour" variant="outline" className="mt-5 w-full">
                Or build an itinerary first <ArrowRight size={15} />
              </Btn>
            </Reveal>
          </aside>
        </div>
      </div>
    </>
  );
}
