import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MessageCircle,
  Plane,
  Car,
  Compass,
  Ship,
  Luggage,
  MapPin,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { SERVICES, PLACES, DESTINATIONS } from "@/lib/data";
import { useBooking, makeRef, type BookingRecord } from "@/lib/store";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Btn, Eyebrow, Field, inputCls, Select, DemoNote, usePageMeta, ease } from "@/components/ui";

const todayPlus = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const detailsSchema = z.object({
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time slot"),
  passengers: z.coerce.number().min(1, "At least one passenger").max(12, "Message Annie for groups over 12"),
  luggage: z.coerce.number().min(0).max(12),
  pickup: z.string().min(2, "Choose a pickup point"),
  dropoff: z.string().min(2, "Choose a destination"),
});

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z
    .string()
    .min(1, "Enter your email")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"),
  phone: z.string().min(7, "Include a phone number Annie can reach"),
  country: z.string().min(2, "Which country are you travelling from?"),
});

type Values = z.infer<typeof detailsSchema> & z.infer<typeof contactSchema> & { flight: string; cruise: string; notes: string };

const fullSchema = detailsSchema.and(contactSchema);

const STEPS = ["Service", "Date & time", "Guests & pickup", "Contact", "Review"];

const SERVICE_ICONS: Record<string, typeof Plane> = {
  "Airport Transfer": Plane,
  "Private Taxi": Car,
  "Island Tour": Compass,
  "Cruise Excursion": Ship,
};

export default function Booking() {
  usePageMeta(
    "Book a Grenada Transfer or Tour | Island Vacation Taxi & Tours",
    "Request a demo booking for Grenada airport transfers, private taxi rides, island tours and cruise excursions — choose your service, date, time and pickup.",
    "book Grenada airport transfer, Grenada taxi booking, Grenada island tour reservation"
  );

  const navigate = useNavigate();
  const { draft, update, saveBooking, toast, itinerary } = useBooking();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"booking" | "quote">("booking");

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Values>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(fullSchema) as any,
    defaultValues: {
      date: draft.date ?? todayPlus(7),
      time: draft.time ?? "09:30",
      passengers: draft.passengers ?? 2,
      luggage: draft.luggage ?? 2,
      pickup: draft.pickup ?? PLACES[0].name,
      dropoff: draft.dropoff ?? "Grand Anse hotel strip",
      name: "",
      email: "",
      phone: "",
      country: "",
      flight: draft.flight ?? "",
      cruise: draft.cruise ?? "",
      notes: draft.notes ?? "",
    },
  });

  const [chosenService, setChosenService] = useState<string>(draft.service ?? "");
  const [time, setTime] = useState<string>(draft.time ?? "09:30");
  const [date, setDate] = useState<string>(draft.date ?? todayPlus(7));
  const [passengers, setPassengers] = useState<number>(draft.passengers ?? 2);

  useEffect(() => {
    setValue("date", date);
    setValue("time", time);
    setValue("passengers", passengers as never);
  }, [date, time, passengers, setValue]);

  useEffect(() => {
    if (draft.service && !chosenService) setChosenService(draft.service);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customStops = useMemo(
    () => (itinerary ?? []).map((id) => DESTINATIONS.find((d) => d.id === id)).filter(Boolean),
    [itinerary]
  );

  const serviceOptions = [
    ...SERVICES.map((s) => ({ label: s.label, path: s.path, icon: SERVICE_ICONS[s.label] ?? Car })),
    ...(customStops.length
      ? [{ label: "Custom island itinerary", path: "/build-your-tour", icon: Sparkles as typeof Plane }]
      : []),
  ];

  const goNext = () => {
    if (step === 1) {
      if (!chosenService) return toast("Choose a service to continue.", "warn");
      return setStep(2);
    }
    if (step === 2) {
      const parsed = detailsSchema.safeParse(getValues());
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return toast(first.message, "warn");
      }
      if (!time) return toast("Pick an available time slot.", "warn");
      return setStep(3);
    }
    if (step === 3) {
      const parsed = detailsSchema.safeParse(getValues());
      if (!parsed.success) return toast(parsed.error.issues[0].message, "warn");
      return setStep(4);
    }
    if (step === 4) {
      const parsed = contactSchema.safeParse(getValues());
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return toast(`${first.path.join(".")}: ${first.message}`, "warn");
      }
      return setStep(5);
    }
  };

  const submit = handleSubmit((values) => {
    const ref = makeRef();
    const record: BookingRecord = {
      ...values,
      ref,
      createdAt: new Date().toISOString(),
      kind: mode,
      service: chosenService,
      date,
      time,
      passengers,
      luggage: Number(values.luggage),
      pickup: values.pickup,
      dropoff: values.dropoff,
      notes: customStops.length ? `${values.notes} · Stops: ${customStops.map((s) => s?.name).join(" → ")}` : values.notes,
    };
    saveBooking(record);
    update({ ref, service: chosenService, date, time, passengers });
    toast(mode === "booking" ? "Demo booking created — opening your confirmation." : "Quote request saved — opening your summary.", "ok");
    navigate("/booking/confirmation", { state: { ref } });
  });

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      {/* header + progress */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Booking request · demo</Eyebrow>
          <h1 className="display-lg mt-4">Plan your journey.</h1>
        </div>
        <button
          type="button"
          onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}
          className="inline-flex items-center gap-2 text-[0.875rem] text-cocoa-2 hover:text-terracotta"
        >
          <ArrowLeft size={15} /> {step === 1 ? "Back to home" : `Back to ${STEPS[step - 2].toLowerCase()}`}
        </button>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={s} className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold tabular-nums transition ${
                    done ? "bg-sea text-cream" : active ? "bg-cocoa text-cream" : "border border-cocoa/20 text-cocoa-3"
                  }`}
                >
                  {done ? <Check size={13} /> : n}
                </span>
                <span className={`hidden truncate text-[0.75rem] sm:block ${active ? "font-medium text-cocoa" : "text-cocoa-3"}`}>{s}</span>
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-cocoa/15" aria-hidden />}
              </div>
            );
          })}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-cocoa/10">
          <motion.div className="h-full rounded-full bg-terracotta" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease }} />
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        {/* steps */}
        <div className="lg:col-span-7 xl:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4, ease }}
            >
              {step === 1 && (
                <section aria-label="Select service">
                  <h2 className="font-display text-3xl font-light">What can we help with?</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {serviceOptions.map((s) => {
                      const Icon = s.icon;
                      const active = chosenService === s.label;
                      return (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => {
                            setChosenService(s.label);
                            update({ service: s.label });
                          }}
                          className={`rounded-[22px] border p-5 text-left transition-all duration-300 ${
                            active ? "border-terracotta bg-terracotta/10 shadow-[0_24px_50px_-35px_rgba(187,108,76,0.9)]" : "border-cocoa/12 bg-white/60 hover:border-cocoa/35"
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            <Icon size={20} className={active ? "text-terracotta" : "text-cocoa-3"} />
                            {active && <Check size={16} className="text-terracotta" />}
                          </span>
                          <span className="mt-4 block font-display text-2xl font-light">{s.label}</span>
                          <span className="mt-1 block text-[0.8125rem] text-cocoa-3">
                            {SERVICES.find((x) => x.label === s.label)?.short ?? `${customStops.length} stops selected`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {customStops.length > 0 && (
                    <p className="mt-4 text-[0.875rem] text-cocoa-2">
                      Your builder stops: <strong className="font-medium">{customStops.map((s) => s?.name).join(" → ")}</strong>
                    </p>
                  )}
                </section>
              )}

              {step === 2 && (
                <section aria-label="Date and time">
                  <h2 className="font-display text-3xl font-light">When would you like to travel?</h2>
                  <div className="mt-6">
                    <AvailabilityCalendar
                      selectedDate={date}
                      selectedTime={time}
                      passengers={passengers}
                      onSelectDate={(k) => {
                        setDate(k);
                        setTime("");
                      }}
                      onSelectTime={setTime}
                    />
                  </div>
                </section>
              )}

              {step === 3 && (
                <section aria-label="Guests and pickup">
                  <h2 className="font-display text-3xl font-light">Guests &amp; pickup details</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Passengers" error={errors.passengers?.message}>
                      <Select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Luggage" hint="large bags">
                      <Select {...register("luggage")}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Pickup location" error={errors.pickup?.message}>
                      <Select {...register("pickup")}>
                        {PLACES.map((p) => (
                          <option key={p.id}>{p.name}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Drop-off / destination" error={errors.dropoff?.message}>
                      <Select {...register("dropoff")}>
                        {PLACES.map((p) => (
                          <option key={p.id}>{p.name}</option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Flight number" hint="airport transfers">
                      <input {...register("flight")} placeholder="e.g. B6 1234" className={inputCls} />
                    </Field>
                    <Field label="Cruise ship" hint="port pickups">
                      <input {...register("cruise")} placeholder="e.g. Vision of the Seas" className={inputCls} />
                    </Field>
                    <Field label="Special requests" hint="child seats, extra stops…" className="sm:col-span-2">
                      <textarea {...register("notes")} className={`${inputCls} min-h-28 resize-y`} placeholder="Anything Annie should know…" />
                    </Field>
                  </div>
                </section>
              )}

              {step === 4 && (
                <section aria-label="Contact details">
                  <h2 className="font-display text-3xl font-light">How do we reach you?</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.name?.message}>
                      <input {...register("name")} className={inputCls} placeholder="Your name" />
                    </Field>
                    <Field label="Email" error={errors.email?.message}>
                      <input {...register("email")} type="email" className={inputCls} placeholder="you@example.com" />
                    </Field>
                    <Field label="Phone / WhatsApp" error={errors.phone?.message}>
                      <input {...register("phone")} className={inputCls} placeholder="+1 …" />
                    </Field>
                    <Field label="Country" error={errors.country?.message}>
                      <input {...register("country")} className={inputCls} placeholder="Travelling from" />
                    </Field>
                  </div>
                  <DemoNote className="mt-5">
                    Your details stay in this browser for the demo. No payment is taken and nothing is transmitted to a server.
                  </DemoNote>
                </section>
              )}

              {step === 5 && (
                <section aria-label="Review reservation">
                  <h2 className="font-display text-3xl font-light">Review your request</h2>
                  <dl className="mt-6 divide-y divide-cocoa/10 overflow-hidden rounded-[22px] border border-cocoa/12 bg-white/60">
                    {[
                      ["Service", chosenService],
                      ["Date", date ? new Date(date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"],
                      ["Time", time || "—"],
                      ["Passengers", String(passengers)],
                      ["Luggage", String(getValues("luggage"))],
                      ["Pickup", getValues("pickup")],
                      ["Drop-off", getValues("dropoff")],
                      ["Flight / ship", [getValues("flight"), getValues("cruise")].filter(Boolean).join(" · ") || "—"],
                      ["Name", getValues("name")],
                      ["Email", getValues("email")],
                      ["Phone", getValues("phone")],
                      ["Country", getValues("country")],
                      ["Notes", getValues("notes") || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-4 px-5 py-3">
                        <dt className="w-32 shrink-0 text-[0.75rem] tracking-[0.14em] text-cocoa-3 uppercase">{k}</dt>
                        <dd className="min-w-0 flex-1 break-words text-[0.9375rem]">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {([
                      ["booking", "Submit demo booking", "Save a reservation you can look up under My booking."],
                      ["quote", "Request a quote only", "No reservation — just ask Annie for availability and pricing."],
                    ] as const).map(([m, title, copy]) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`rounded-[20px] border p-5 text-left transition ${
                          mode === m ? "border-terracotta bg-terracotta/10" : "border-cocoa/12 bg-white/60 hover:border-cocoa/35"
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          <span className="font-display text-xl font-light">{title}</span>
                          {mode === m && <Check size={16} className="text-terracotta" />}
                        </span>
                        <span className="mt-1.5 block text-[0.8125rem] text-cocoa-3">{copy}</span>
                      </button>
                    ))}
                  </div>

                  <DemoNote className="mt-5">
                    Demo bookings are not real reservations. No payment is processed, and Annie confirms every trip personally.
                  </DemoNote>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Btn onClick={submit} variant="terracotta" size="lg">
                      {mode === "booking" ? "Confirm demo booking" : "Send quote request"} <ArrowRight size={16} />
                    </Btn>
                    <Btn href={`https://wa.me/14735377386?text=${encodeURIComponent(`Hello Annie! I'd like to enquire about ${chosenService} in Grenada on ${date} at ${time} for ${passengers} passengers.`)}`} variant="outline" size="lg">
                      <MessageCircle size={16} /> Ask on WhatsApp instead
                    </Btn>
                  </div>
                </section>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-cocoa/12 pt-6">
                <button
                  type="button"
                  onClick={() => (step === 1 ? navigate("/") : setStep(step - 1))}
                  className="text-[0.875rem] text-cocoa-3 hover:text-cocoa"
                >
                  ← {step === 1 ? "Home" : "Previous step"}
                </button>
                {step < 5 && (
                  <Btn onClick={goNext} variant="solid" size="lg">
                    Continue <ArrowRight size={16} />
                  </Btn>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* live summary */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-[26px] bg-cocoa p-6 text-cream">
              <span className="eyebrow text-sun">Live booking summary</span>
              <p className="mt-4 font-display text-2xl font-light leading-snug">{chosenService || "Choose a service"}</p>
              <dl className="mt-5 space-y-3 text-[0.875rem]">
                {[
                  [CalendarDays, date ? new Date(date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Date not set"],
                  [MapPin, `${getValues("pickup") || "—"} → ${getValues("dropoff") || "—"}`],
                  [Luggage, `${passengers} passengers · ${getValues("luggage")} bags`],
                ].map(([Icon, text], i) => {
                  const I = Icon as typeof MapPin;
                  return (
                    <div key={i} className="flex gap-3 text-cream/75">
                      <I size={15} className="mt-0.5 shrink-0 text-sun" />
                      <span className="min-w-0 break-words">{text as string}</span>
                    </div>
                  );
                })}
                <div className="flex gap-3 text-cream/75">
                  <CalendarDays size={15} className="mt-0.5 shrink-0 text-sun" />
                  <span>{time || "Time not set"}</span>
                </div>
              </dl>

              {customStops.length > 0 && (
                <div className="mt-5 border-t border-cream/15 pt-4">
                  <span className="eyebrow text-cream/50">Your stops</span>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-cream/70">{customStops.map((s) => s?.name).join(" → ")}</p>
                </div>
              )}

              <div className="mt-6 border-t border-cream/15 pt-4">
                <p className="text-[0.75rem] leading-relaxed text-cream/50">
                  Step {step} of {STEPS.length} · {STEPS[step - 1]}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Btn to="/my-booking" variant="cream" size="sm">Find my booking</Btn>
                  <Btn to="/build-your-tour" variant="outline" size="sm" className="border-cream/30 text-cream hover:bg-cream hover:text-cocoa">
                    Edit itinerary
                  </Btn>
                </div>
              </div>
            </div>

            <DemoNote className="mt-4">
              Mock availability, demo reservations, no payment. Real bookings happen on WhatsApp or by phone with Annie.
            </DemoNote>
          </div>
        </aside>
      </div>
    </div>
  );
}
