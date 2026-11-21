import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { BUSINESS, waLink, MSG } from "@/lib/data";
import { useBooking } from "@/lib/store";
import { Btn, ease } from "./ui";

const NAV = [
  { to: "/experiences", label: "Experiences" },
  { to: "/transfers", label: "Transfers" },
  { to: "/cruise-excursions", label: "Cruise" },
  { to: "/build-your-tour", label: "Build your tour" },
  { to: "/about", label: "About Annie" },
  { to: "/contact", label: "Contact" },
];

/* ------------------------------------------------------------------ */
/* Concept wordmark (design concept — not the official brand logo)     */
/* ------------------------------------------------------------------ */

export function Wordmark({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  const color = tone === "dark" ? "text-cocoa" : "text-cream";
  const sub = tone === "dark" ? "text-cocoa-3" : "text-cream/60";
  return (
    <span className={`flex items-center gap-2.5 ${color}`}>
      <svg viewBox="0 0 40 40" aria-hidden className="h-8 w-8 shrink-0">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M20 4.5 L23.4 16.6 L35.5 20 L23.4 23.4 L20 35.5 L16.6 23.4 L4.5 20 L16.6 16.6 Z" fill="#BB6C4C" />
        <circle cx="20" cy="20" r="3.1" fill="#E9BE6A" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-display ${compact ? "text-[1.05rem]" : "text-[1.25rem]"} font-medium tracking-tight`}>
          Island Vacation
        </span>
        <span className={`eyebrow mt-1 ${compact ? "text-[0.5625rem]" : "text-[0.625rem]"} ${sub}`}>Taxi &amp; Tours · Grenada</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Fixed editorial side rail (desktop)                                  */
/* ------------------------------------------------------------------ */

function SideRail() {
  const { pathname } = useLocation();
  useEffect(() => {
    // rail index label follows route
  }, [pathname]);
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-[72px] z-40 hidden h-[calc(100vh-72px)] w-14 flex-col items-center justify-between border-r border-cocoa/10 bg-cream/60 py-5 backdrop-blur-[2px] lg:flex"
    >
      <span className="h-2 w-2 rotate-45 bg-terracotta" />
      <span className="eyebrow whitespace-nowrap text-cocoa-3 [writing-mode:vertical-rl]">
        The Spice Isle — Grenada · Your Island. Your Journey.
      </span>
      <span className="flex flex-col items-center gap-2">
        <span className="h-8 w-px bg-cocoa/20" />
        <span className="font-display text-sm italic text-cocoa-3">est. on island</span>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header + mobile drawer                                              */
/* ------------------------------------------------------------------ */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open || pathname !== "/";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 lg:pl-14 ${
          solid ? "border-b border-cocoa/10 bg-cream/92 backdrop-blur-md" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link to="/" aria-label="Island Vacation Taxi & Tours — home">
            <Wordmark compact />
          </Link>

          <nav className="hidden items-center gap-7 xl:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative text-[0.8125rem] font-medium tracking-[0.03em] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full ${
                    isActive ? "text-terracotta after:w-full" : "text-cocoa-2"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="hidden text-[0.8125rem] font-medium tabular-nums text-cocoa-2 transition-colors hover:text-terracotta md:block"
            >
              {BUSINESS.phoneDisplay}
            </a>
            <Btn to="/booking" variant="terracotta" size="sm" className="hidden sm:inline-flex">
              Plan my journey
            </Btn>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/15 text-cocoa transition hover:bg-cocoa hover:text-cream xl:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-cream pt-[72px] xl:hidden"
          >
            <div className="flex h-full flex-col overflow-y-auto px-5 pb-10 pt-6 sm:px-8">
              <nav aria-label="Mobile" className="flex flex-col">
                {[{ to: "/", label: "Home" }, ...NAV, { to: "/my-booking", label: "My booking" }].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.5, ease }}
                  >
                    <NavLink
                      to={item.to}
                      className="flex items-baseline justify-between border-b border-cocoa/10 py-4 font-display text-3xl font-light text-cocoa"
                    >
                      {item.label}
                      <ArrowUpRight size={18} className="text-terracotta" />
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto grid gap-3 pt-8">
                <Btn href={waLink(MSG.general("your services"))} variant="terracotta" size="lg" className="w-full">
                  <MessageCircle size={17} /> Chat on WhatsApp
                </Btn>
                <div className="grid grid-cols-1 gap-2 text-sm text-cocoa-2 sm:grid-cols-2">
                  <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-center gap-2 hover:text-terracotta">
                    <Phone size={15} /> {BUSINESS.phoneDisplay}
                  </a>
                  <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:text-terracotta">
                    <Mail size={15} /> {BUSINESS.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky mobile action bar                                             */
/* ------------------------------------------------------------------ */

function MobileBar() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/booking")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cocoa/12 bg-cream/95 px-3 py-2.5 backdrop-blur-md sm:hidden">
      <div className="flex items-center gap-2">
        <Btn to="/build-your-tour" variant="solid" size="sm" className="flex-1 py-3">
          Build my journey
        </Btn>
        <Btn href={waLink(MSG.general("a Grenada transfer or tour"))} variant="terracotta" size="sm" className="flex-1 py-3">
          <MessageCircle size={15} /> WhatsApp
        </Btn>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-cocoa text-cream lg:ml-14">
      <div className="grain absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-5 pb-28 pt-16 sm:px-8 sm:pb-12 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Wordmark tone="light" />
            <p className="mt-6 max-w-sm font-display text-2xl font-light leading-snug text-cream/90">
              Personalized island transportation and sightseeing, all across the Spice Isle.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn href={waLink(MSG.general("booking a transfer or tour"))} variant="terracotta" size="sm">
                <MessageCircle size={15} /> WhatsApp Annie
              </Btn>
              <Btn to="/my-booking" variant="outline" size="sm" className="border-cream/30 text-cream hover:bg-cream hover:text-cocoa">
                Find my booking
              </Btn>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h3 className="eyebrow mb-4 text-sun">Explore</h3>
              <ul className="space-y-2.5 text-sm text-cream/75">
                {NAV.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="transition-colors hover:text-sun">
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/" className="transition-colors hover:text-sun">
                    Home
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow mb-4 text-sun">Featured tours</h3>
              <ul className="space-y-2.5 text-sm text-cream/75">
                <li><Link to="/experiences/grand-anse-beach-tour" className="transition-colors hover:text-sun">Grand Anse Beach Tour</Link></li>
                <li><Link to="/experiences/st-georges-city-tour" className="transition-colors hover:text-sun">St. George's City Tour</Link></li>
                <li><Link to="/experiences/mt-carmel-waterfall-tour" className="transition-colors hover:text-sun">Mt. Carmel Waterfall Tour</Link></li>
                <li><Link to="/transfers" className="transition-colors hover:text-sun">Fare estimate & transfers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow mb-4 text-sun">Contact</h3>
              <ul className="space-y-2.5 text-sm text-cream/75">
                <li>
                  <a href={`tel:${BUSINESS.phoneRaw}`} className="tabular-nums transition-colors hover:text-sun">
                    {BUSINESS.phoneDisplay}
                  </a>
                </li>
                <li className="break-words">
                  <a href={`mailto:${BUSINESS.email}`} className="transition-colors hover:text-sun">
                    {BUSINESS.email}
                  </a>
                </li>
                <li>
                  <a href={BUSINESS.site} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-sun">
                    islandvacationgrenada.com
                  </a>
                </li>
                <li className="pt-1 text-cream/55">St. George's, Grenada, West Indies</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-cream/15 pt-6">
          <p className="max-w-4xl text-[0.8125rem] leading-relaxed text-cream/55">
            Grenada airport transfers · Private taxi Grenada · Grenada island tours · St. George's cruise excursions · Grand Anse
            beach tours · Grenada private sightseeing.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-[0.8125rem] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Island Vacation Taxi &amp; Tours · Owned &amp; operated by Annie.</p>
            <p>Design concept demo — availability, fares and bookings shown here are illustrative, not official business data.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

function Toaster() {
  const { toasts, dismiss } = useBooking();
  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.4, ease }}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3 text-left text-sm shadow-[0_18px_40px_-18px_rgba(41,43,37,0.5)] ${
              t.tone === "warn" ? "bg-terracotta text-cream" : t.tone === "info" ? "bg-sea text-cream" : "bg-cocoa text-cream"
            }`}
          >
            <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-sun" />
            <span className="leading-snug">{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper relative min-h-screen">
      <SideRail />
      <Header />
      <main className="lg:pl-14">{children}</main>
      <Footer />
      <MobileBar />
      <Toaster />
    </div>
  );
}
