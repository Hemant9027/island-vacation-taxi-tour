import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { getAvailability, dateKey, type SlotStatus } from "@/lib/data";
import { ease } from "./ui";

const STATUS_LABEL: Record<string, string> = {
  available: "Open",
  limited: "Limited",
  full: "Fully booked",
  past: "Past",
};

export default function AvailabilityCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  passengers = 1,
  compact = false,
}: {
  selectedDate: string;
  selectedTime?: string;
  onSelectDate: (key: string) => void;
  onSelectTime?: (time: string) => void;
  passengers?: number;
  compact?: boolean;
}) {
  const [month, setMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
    return startOfMonth(d);
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end: end.getMonth() === month.getMonth() ? end : addMonths(startOfMonth(month), 1) });
  }, [month]);

  const selected = selectedDate ? new Date(selectedDate + "T00:00:00") : null;
  const dayInfo = selected ? getAvailability(selected) : null;
  const monthName = format(month, "MMMM yyyy");

  return (
    <div className={compact ? "" : "rounded-[24px] border border-cocoa/12 bg-white/60 p-5 sm:p-6"}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow text-cocoa-3">Availability</span>
          <h3 className="mt-1 font-display text-2xl font-light leading-none sm:text-3xl">{monthName}</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setMonth((m) => addMonths(m, -1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cocoa/15 transition hover:bg-cocoa hover:text-cream"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cocoa/15 transition hover:bg-cocoa hover:text-cream"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 text-center" aria-hidden>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="eyebrow pb-1 text-cocoa-3/70">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const key = dateKey(day);
          const info = getAvailability(day);
          const inMonth = isSameMonth(day, month);
          const isPast = day < today;
          const isToday = isSameDay(day, today);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const status = isPast ? "past" : info.status;

          const base =
            "relative flex h-11 flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 sm:h-12";
          let cls = `${base} `;
          if (isSelected) cls += "bg-cocoa text-cream shadow-[0_10px_24px_-14px_rgba(41,43,37,0.9)]";
          else if (isPast || !inMonth) cls += "text-cocoa-3/35";
          else if (status === "full") cls += "text-cocoa-3/50 line-through decoration-terracotta/60";
          else if (status === "limited") cls += "bg-sun/35 text-cocoa hover:bg-sun/60";
          else cls += "text-cocoa hover:bg-cream-3";

          return (
            <button
              key={key}
              type="button"
              disabled={isPast || !inMonth}
              aria-label={`${format(day, "EEEE d MMMM yyyy")} — ${STATUS_LABEL[status]}`}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(key)}
              className={cls}
            >
              <span className={`tabular-nums ${isToday && !isSelected ? "font-bold text-terracotta" : ""}`}>{format(day, "d")}</span>
              {!isPast && inMonth && (
                <span
                  aria-hidden
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    status === "full" ? "bg-terracotta/70" : status === "limited" ? "bg-cocoa/50" : "bg-sea/70"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.75rem] text-cocoa-3">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sea/70" /> Open</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sun" /> Limited capacity</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-terracotta/70" /> Fully booked</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cocoa/30" /> Past date</span>
      </div>

      {dayInfo && (
        <div className="mt-5 border-t border-cocoa/10 pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="font-display text-xl font-light">
              {format(new Date(dayInfo.dateKey + "T00:00:00"), "EEEE d MMMM")}
            </h4>
            <span className="eyebrow text-cocoa-3">{STATUS_LABEL[dayInfo.status]}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={dayInfo.dateKey + String(onSelectTime)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {dayInfo.slots.map((slot) => {
                const tooSmall = slot.seats < passengers;
                const disabled = slot.status === "full" || tooSmall;
                const active = selectedTime === slot.time && !disabled;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectTime?.(slot.time)}
                    aria-pressed={active}
                    title={tooSmall && slot.status !== "full" ? `Only ${slot.seats} seats left for this slot` : undefined}
                    className={`rounded-xl border px-2 py-2.5 text-center transition-all duration-200 ${
                      active
                        ? "border-terracotta bg-terracotta text-cream"
                        : disabled
                        ? "cursor-not-allowed border-cocoa/10 bg-cocoa/[0.04] text-cocoa-3/50"
                        : "border-cocoa/15 bg-white/70 hover:border-cocoa/40"
                    }`}
                  >
                    <span className="block text-sm font-medium tabular-nums">{slot.time}</span>
                    <span className={`mt-0.5 flex items-center justify-center gap-1 text-[0.6875rem] ${active ? "text-cream/85" : "text-cocoa-3"}`}>
                      {active ? <Check size={11} /> : tooSmall && slot.status !== "full" ? <AlertCircle size={11} /> : null}
                      {disabled ? (slot.status === "full" ? "Full" : `${slot.seats} left`) : tooSmall ? "Too small" : `${slot.seats} seats`}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {passengers > 1 && (
            <p className="mt-3 text-[0.75rem] text-cocoa-3">
              Showing capacity for {passengers} travellers. Slots without enough room are disabled.
            </p>
          )}
        </div>
      )}

      <p className="mt-5 text-[0.75rem] leading-relaxed text-cocoa-3/80">
        Mock availability for demonstration — generated deterministically in the browser. Annie confirms every date and time personally.
      </p>
    </div>
  );
}

export type { SlotStatus };
