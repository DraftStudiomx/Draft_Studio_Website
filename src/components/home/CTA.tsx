"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PAPER   = "rgba(241,238,229,1)";
const DIM     = "rgba(241,238,229,0.16)";
const COBALTO = "#2B41E5";

type Word = { text: string; hl?: boolean };

const WORDS: Record<string, Word[]> = {
  en: [
    { text: "Ready" }, { text: "to" }, { text: "build" },
    { text: "something" }, { text: "remarkable?", hl: true },
  ],
  es: [
    { text: "¿Listos" }, { text: "para" }, { text: "construir" },
    { text: "algo" }, { text: "extraordinario?", hl: true },
  ],
};

export default function CTA() {
  const locale     = useLocale() as "es" | "en";
  const t          = useTranslations("cta");
  const words      = WORDS[locale] ?? WORDS.en;
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs   = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const els = wordRefs.current.filter(Boolean).slice(0, words.length);
    if (!els.length || !sectionRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(els, { color: PAPER });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(els, { color: DIM });

      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 80%" : "top 72%",
          end: isMobile ? `+=${window.innerHeight * 1.5}` : "bottom 80%",
          scrub: 0.6,
        },
      });

      words.forEach((word, i) => {
        const el = els[i];
        if (!el) return;
        const pos = i * 0.5;
        if (word.hl) {
          tl.to(el, { color: COBALTO, duration: 0.4, ease: "none" }, pos)
            .to(el, { color: PAPER,   duration: 0.45, ease: "none" }, pos + 0.4);
        } else {
          tl.to(el, { color: PAPER, duration: 0.55, ease: "none" }, pos);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [locale, words]);

  return (
    <section
      ref={sectionRef}
      aria-label="Start a project"
      className="cta-section"
      style={{
        background: "var(--ds-ink)",
        color: "var(--ds-paper)",
        padding: "clamp(120px,18vh,200px) var(--gutter) clamp(38px,6vh,64px)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(40px,7vh,72px)", fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
          {t("label")}
        </div>

        {/* Headline */}
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(40px,7vw,96px)", lineHeight: 1.0, letterSpacing: "-0.04em", maxWidth: "15ch", textWrap: "balance" as never }}>
          {words.map((word, i) => (
            <span key={i}>
              <span
                ref={(el) => { if (el) wordRefs.current[i] = el; }}
                style={{ display: "inline-block", color: DIM, willChange: "color" }}
              >
                {word.text}
              </span>
              {" "}
            </span>
          ))}
        </h2>

        {/* Subline */}
        <p style={{ marginTop: "clamp(26px,4vh,40px)", fontSize: "clamp(16px,1.25vw,19px)", lineHeight: 1.5, color: "var(--ds-graphite)", maxWidth: "42ch" }}>
          {t("sub")}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "22px", marginTop: "clamp(34px,5vh,52px)", flexWrap: "wrap" }}>
          <Link
            href="/contact"
            className="btn-fill"
            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".05em", textTransform: "uppercase", background: "var(--ds-cobalto)", color: "var(--ds-paper)", textDecoration: "none", display: "inline-flex", alignItems: "center", padding: "17px 26px", borderRadius: "3px", position: "relative", overflow: "hidden" }}
          >
            <span className="btn-fill__label" style={{ position: "relative", zIndex: 2 }}>
              {t("btn")}
            </span>
          </Link>

          <a
            href="mailto:hey@draftstudio.mx"
            className="cta__mail"
            style={{ fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".03em", color: "var(--ds-paper)", textDecoration: "none", position: "relative", padding: "6px 2px" }}
          >
            hey@draftstudio.mx
          </a>
        </div>

      </div>
      <style>{`
        .cta-section .btn-fill::before { background: var(--ds-paper) !important; }
        .cta-section .btn-fill:hover,
        .cta-section .btn-fill:active  { color: var(--ds-ink) !important; }
        .cta__mail::after { content: ""; position: absolute; left: 2px; right: 2px; bottom: 0; height: 1px; background: var(--ds-paper); transform: scaleX(0); transform-origin: left; transition: transform .4s cubic-bezier(.22,1,.36,1); }
        .cta__mail:hover::after { transform: scaleX(1); }
      `}</style>
    </section>
  );
}
