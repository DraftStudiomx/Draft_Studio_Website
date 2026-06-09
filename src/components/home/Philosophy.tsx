"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PAPER   = "rgba(241,238,229,1)";
const DIM     = "rgba(241,238,229,0.16)";
const COBALTO = "#2B41E5";

type Word = { text: string; hl?: boolean };

const WORDS: Record<string, Word[][]> = {
  en: [
    [
      { text: "We" }, { text: "believe" }, { text: "the" },
      { text: "internet" }, { text: "deserves" },
      { text: "better", hl: true }, { text: "design." },
    ],
    [
      { text: "Not" }, { text: "louder." }, { text: "Not" }, { text: "more." },
      { text: "Just" }, { text: "precise,", hl: true },
      { text: "intentional,", hl: true }, { text: "and" },
      { text: "built" }, { text: "to" }, { text: "last.", hl: true },
    ],
  ],
  es: [
    [
      { text: "Creemos" }, { text: "que" }, { text: "internet" },
      { text: "merece" }, { text: "mejor", hl: true }, { text: "diseño." },
    ],
    [
      { text: "No" }, { text: "más" }, { text: "ruido." },
      { text: "No" }, { text: "más" }, { text: "relleno." },
      { text: "Solo" }, { text: "preciso,", hl: true },
      { text: "intencional,", hl: true }, { text: "y" },
      { text: "construido" }, { text: "para" }, { text: "durar.", hl: true },
    ],
  ],
};

export default function Philosophy() {
  const locale    = useLocale() as "es" | "en";
  const t         = useTranslations("philosophy");
  const words     = WORDS[locale] ?? WORDS.en;
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs   = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const allWords = wordRefs.current.slice(0, words.flat().length);
    if (!allWords.length || !sectionRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(allWords, { color: PAPER });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(allWords, { color: DIM });

      const flat = words.flat();
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          end: "bottom 80%",
          scrub: 0.6,
        },
      });

      flat.forEach((word, i) => {
        const el = allWords[i];
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

  let idx = 0;

  return (
    <section
      ref={sectionRef}
      aria-label="Philosophy"
      style={{
        position: "relative",
        background: "var(--ds-ink)",
        color: "var(--ds-paper)",
        padding: "clamp(120px,18vh,200px) var(--gutter)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "clamp(48px,8vh,90px)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--ds-graphite)",
          }}
        >
          {t("label")}
        </div>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(34px,5vw,80px)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            textWrap: "balance" as never,
          }}
        >
          {words.map((line, li) => (
            <span key={li}>
              {line.map((word) => {
                const i = idx++;
                return (
                  <span key={i}>
                    <span
                      ref={(el) => { if (el) wordRefs.current[i] = el; }}
                      style={{ display: "inline-block", color: DIM, willChange: "color" }}
                    >
                      {word.text}
                    </span>
                    {" "}
                  </span>
                );
              })}
              {li < words.length - 1 && <span style={{ display: "block", height: 0 }} />}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
