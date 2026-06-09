"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import CornerMarks3D from "@/components/ui/CornerMarks3D";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const t = useTranslations("hero");

  useEffect(() => {
    const eyebrow = document.getElementById("hero-eyebrow");
    const inners = Array.from(document.querySelectorAll<HTMLElement>(".line__inner"));
    const row = document.getElementById("hero-row");
    const aside = document.getElementById("hero-aside");
    const base = document.getElementById("hero-base");

    if (!eyebrow || !inners.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set([eyebrow, ...inners, row, aside, base], { opacity: 1, y: 0 });
      return;
    }

    gsap.set([eyebrow, ...inners, row, aside, base], { opacity: 0, y: 30 });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
      .to(inners, { opacity: 1, y: 0, duration: 1.0, ease: "expo.out", stagger: 0.12 }, "-=0.4")
      .to(row, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .to(aside, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.7")
      .to(base, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.5");

    return () => { tl.kill(); };
  }, []);

  return (
    <>
      <section className="hero" ref={heroRef}>
        {/* Crosshair texture */}
        <div className="hero__marks" aria-hidden="true" />

        <div className="hero__grid">
          {/* Left — content */}
          <div className="hero__lead">
            <div className="eyebrow" id="hero-eyebrow">
              <span className="idx">01</span>
              <span className="rule" />
              <span className="eyebrow__text">{t("eyebrow")}</span>
            </div>

            <h1 className="headline">
              <span className="line"><span className="line__inner">{t("line1")}</span></span>
              <span className="line"><span className="line__inner">{t("line2")}</span></span>
              <span className="line"><span className="line__inner"><span className="accent">{t("line3accent")}</span>{t("line3end")}</span></span>
            </h1>

            <div className="hero__row" id="hero-row">
              <p className="hero__sub">{t("sub")}</p>
              <div className="hero__actions">
                <Link href="/work" className="btn-link">
                  {t("viewWork")} <span className="arrow">→</span>
                </Link>
                <Link href="/contact" className="btn-fill">
                  <span className="btn-fill__label">{t("startProject")}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right — Corner Marks */}
          <div className="hero__aside" id="hero-aside">
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "clamp(280px,40vh,520px)" }}>
              <CornerMarks3D />
            </div>
          </div>
        </div>

        {/* Base meta row */}
        <div className="hero__base" id="hero-base">
          <span>Est. 2026</span>
          <span className="mid">{t("baseMid")}</span>
          <span className="end">
            {t("baseScroll")}
            <span className="scroll-bar" />
          </span>
        </div>
      </section>

      <style>{`
        .hero {
          position: relative; min-height: 100vh; width: 100%;
          padding: clamp(120px,15vh,180px) var(--gutter) 0;
          display: flex; flex-direction: column; overflow-x: clip;
        }
        .hero__marks {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: .6;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='118' height='118'%3E%3Cg stroke='%23B9B5A8' stroke-width='1'%3E%3Cpath d='M59 53v12M53 59h12'/%3E%3C/g%3E%3C/svg%3E");
          background-position: center;
          -webkit-mask-image: linear-gradient(180deg,transparent 0,#000 18%,#000 76%,transparent 100%);
          mask-image: linear-gradient(180deg,transparent 0,#000 18%,#000 76%,transparent 100%);
        }
        .hero__grid {
          position: relative; z-index: 2; flex: 1;
          display: grid;
          grid-template-columns: minmax(0,1fr) clamp(280px,30vw,420px);
          column-gap: clamp(28px,5vw,80px);
          align-items: center;
        }
        .hero__lead { max-width: 980px; }
        .eyebrow {
          display: flex; align-items: center; gap: 16px;
          margin-bottom: clamp(24px,3.4vh,40px);
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: .08em; text-transform: uppercase; color: var(--ds-graphite);
        }
        .eyebrow .idx { color: var(--ds-ink); }
        .eyebrow .rule { flex: none; width: 34px; height: 1px; background: var(--ds-graph-300); }
        .headline {
          font-weight: 600;
          font-size: clamp(46px,8.4vw,122px);
          line-height: .96; letter-spacing: -0.05em;
        }
        .line { display: block; overflow: visible; }
        .line__inner { display: block; overflow: visible; will-change: transform, opacity; }
        .accent { color: var(--ds-cobalto); font-style: italic; letter-spacing: -0.055em; padding-right: .06em; }
        .hero__row {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 40px; flex-wrap: wrap;
          margin-top: clamp(34px,5vh,58px);
          border-top: 1px solid var(--ds-rule); padding-top: 26px;
          max-width: 920px;
        }
        .hero__sub {
          max-width: 380px;
          font-size: clamp(15px,1.15vw,17px); line-height: 1.55;
          color: var(--ds-graphite); font-weight: 400;
        }
        .hero__actions { display: flex; align-items: center; gap: 16px; }
        .btn-link {
          font-family: var(--font-mono); font-size: 12px; letter-spacing: .05em; text-transform: uppercase;
          color: var(--ds-ink); text-decoration: none;
          display: inline-flex; align-items: center; gap: 9px;
          padding: 16px 2px; position: relative;
        }
        .btn-link .arrow { transition: transform .3s cubic-bezier(.22,1,.36,1); }
        .btn-link:hover .arrow { transform: translateX(5px); }
        .btn-link::after {
          content: ""; position: absolute; left: 2px; right: 2px; bottom: 8px;
          height: 1px; background: var(--ds-ink);
          transform: scaleX(1); transform-origin: left;
          transition: transform .35s cubic-bezier(.22,1,.36,1);
        }
        .btn-link:hover::after { transform: scaleX(0); transform-origin: right; }
        .magnetic { display: inline-block; }
        .btn-fill {
          font-family: var(--font-mono); font-size: 12px; letter-spacing: .05em; text-transform: uppercase;
          background: var(--ds-cobalto); color: var(--ds-paper);
          text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
          padding: 17px 26px; border-radius: 3px; position: relative; overflow: hidden;
        }
        .btn-fill__label { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 10px; }
        .btn-fill::before {
          content: ""; position: absolute; inset: 0;
          background: var(--ds-ink); transform: translateY(101%);
          transition: transform .45s cubic-bezier(.22,1,.36,1); z-index: 1;
        }
        .btn-fill:hover::before { transform: translateY(0); }
        .hero__aside {
          position: relative; align-self: stretch;
          display: flex; flex-direction: column; justify-content: center;
        }
        .aside__cap {
          position: absolute; top: clamp(80px,16vh,150px); left: 0;
          font-family: var(--font-mono); font-size: 11px; letter-spacing: .14em;
          text-transform: uppercase; color: var(--ds-graphite);
          display: flex; align-items: center; gap: 10px;
        }
        .aside__cap .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ds-cobalto); flex: none; }
        .hero__base {
          position: relative; z-index: 2;
          display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center;
          border-top: 1px solid var(--ds-rule);
          padding: 18px 0 26px; margin-top: auto;
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .1em; text-transform: uppercase; color: var(--ds-graphite);
        }
        .hero__base .mid { text-align: center; color: var(--ds-graph-300); }
        .hero__base .end { justify-self: end; display: flex; align-items: center; gap: 12px; }
        .scroll-bar {
          position: relative; width: 1px; height: 30px;
          background: var(--ds-rule); overflow: hidden;
          display: inline-block; vertical-align: middle;
        }
        .scroll-bar::after {
          content: ""; position: absolute; top: -50%; left: 0;
          width: 100%; height: 50%; background: var(--ds-ink);
          animation: scrolldrop 1.9s cubic-bezier(.7,0,.3,1) infinite;
        }
        @keyframes scrolldrop { 0%{top:-50%} 60%,100%{top:100%} }
        @media (max-width: 960px) {
          .hero__grid { grid-template-columns: 1fr; }
          .hero__aside { display: none; }
          .hero__base { grid-template-columns: 1fr auto; }
          .hero__base .mid { display: none; }
        }
        .eyebrow__break { display: inline; }
        .eyebrow__text { display: inline; }
        @media (max-width: 768px) {
          .hero { min-height: auto; padding: 150px var(--gutter) 60px; }
          .headline { font-size: 70px; }
          .hero__row { max-width: none; }
          .hero__sub { max-width: 46ch; }
          .hero__base { grid-template-columns: 1fr auto; }
          .hero__base .mid { display: none; }
        }
        @media (max-width: 480px) {
          .hero { padding: 140px var(--gutter) 48px; }
          .headline { font-size: 38px; line-height: .94; }
          .hero__row { max-width: none; margin-top: 34px; }
          .hero__sub { max-width: none; }
          .hero__actions { flex-wrap: wrap; gap: 12px; }
          .hero__base { grid-template-columns: 1fr; gap: 10px; }
          .hero__base .end { justify-self: start; }
          .hero__marks { display: none; }
          .eyebrow { flex-wrap: wrap; gap: 8px; }
          .eyebrow__text { display: block; flex-basis: 100%; padding-left: 0; }
          .eyebrow__break { display: inline; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-bar::after { animation: none; }
        }
      `}</style>
    </>
  );
}
