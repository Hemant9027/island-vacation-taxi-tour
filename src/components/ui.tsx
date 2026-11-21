import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

export const ease = [0.22, 1, 0.36, 1] as const;

export const riseVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease },
  }),
};

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/** Words rise from behind a mask, line by line. */
export function SplitLines({
  text,
  className = "",
  delay = 0,
  stagger = 0.09,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const lines = text.split("\n");
  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.16em]">
          <motion.span
            className="block"
            initial={{ y: "120%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1, delay: delay + i * stagger, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Typography furniture                                                 */
/* ------------------------------------------------------------------ */

export function Eyebrow({ children, tone = "terracotta", className = "" }: { children: React.ReactNode; tone?: "terracotta" | "sea" | "cream" | "sage"; className?: string }) {
  const colors = {
    terracotta: "text-terracotta",
    sea: "text-sea",
    cream: "text-cream/70",
    sage: "text-sage",
  };
  return (
    <span className={`eyebrow inline-flex items-center gap-3 ${colors[tone]} ${className}`}>
      <span aria-hidden className="inline-block h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t hairline ${className}`} />;
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnProps = {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "terracotta" | "outline" | "cream" | "sea";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
};

const btnBase =
  "group relative inline-flex items-center justify-center gap-2 font-sans font-medium tracking-[0.02em] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none select-none";

const variants: Record<string, string> = {
  solid: "bg-cocoa text-cream hover:bg-cocoa-2 rounded-full",
  terracotta: "bg-terracotta text-cream hover:bg-terracotta-2 rounded-full",
  sea: "bg-sea text-cream hover:bg-sea-2 rounded-full",
  outline: "border hairline text-cocoa hover:border-cocoa hover:bg-cocoa hover:text-cream rounded-full",
  cream: "bg-cream text-cocoa hover:bg-white rounded-full",
};

const sizes: Record<string, string> = {
  sm: "text-[0.8125rem] px-5 py-2.5",
  md: "text-sm px-7 py-3.5",
  lg: "text-[0.9375rem] px-9 py-4",
};

export function Btn({ children, to, href, onClick, variant = "solid", size = "md", className = "", disabled, type = "button", ariaLabel }: BtnProps) {
  const cls = `${btnBase} ${variants[variant]} ${sizes[size]} ${className}`;
  if (to && !disabled)
    return (
      <Link to={to} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  if (href && !disabled)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Form controls                                                       */
/* ------------------------------------------------------------------ */

const controlCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-[0.9375rem] text-cocoa placeholder:text-cocoa-3/70 transition focus:border-terracotta focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/20";

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="eyebrow mb-2 flex items-baseline justify-between gap-2 text-cocoa-3">
        <span>{label}</span>
        {hint && <span className="normal-case tracking-normal text-[0.6875rem] italic opacity-70">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[0.8125rem] text-terracotta-2">{error}</span>}
    </label>
  );
}

export const inputCls = controlCls;

export function Select({ children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={`${controlCls} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236b6d62' stroke-width='1.5'/%3E%3C/svg%3E")] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat pr-10`}>
      {children}
    </select>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${controlCls} min-h-28 resize-y`} />;
}

/* ------------------------------------------------------------------ */
/* Image with graceful fallback                                        */
/* ------------------------------------------------------------------ */

export function SmartImage({
  src,
  fallback,
  alt,
  className = "",
  imgClassName = "h-full w-full object-cover",
  eager = false,
}: {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [current, setCurrent] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    setCurrent(src);
    setLoaded(false);
    setDead(false);
  }, [src]);

  return (
    <span className={`relative block overflow-hidden bg-cream-3 ${className}`}>
      {!loaded && !dead && (
        <span aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-cream-3 to-sage/40" />
      )}
      {dead ? (
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_20%_0%,#A9B5A0_0%,#407E91_55%,#2F6273_100%)]"
        />
      ) : (
        <img
          src={current}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (current !== fallback) setCurrent(fallback);
            else setDead(true);
          }}
          className={`${imgClassName} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page metadata (SPA)                                                 */
/* ------------------------------------------------------------------ */

export function usePageMeta(title: string, description: string, keywords?: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, value: string) => {
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const key = sel.includes("property") ? "property" : "name";
        const val = sel.match(/=(.+?)\]/)?.[1] ?? "description";
        el.setAttribute(key, val);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    set('meta[name="description"]', "content", description);
    if (keywords) set('meta[name="keywords"]', "content", keywords);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", description);
  }, [title, description, keywords]);
}

/* ------------------------------------------------------------------ */
/* Small parts                                                         */
/* ------------------------------------------------------------------ */

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl font-light leading-none">{value}</div>
      <div className="eyebrow mt-2 text-cocoa-3">{label}</div>
    </div>
  );
}

export function DemoNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[0.8125rem] leading-relaxed text-cocoa-3 ${className}`}>
      <span aria-hidden className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-sun" />
      <span>{children}</span>
    </p>
  );
}
