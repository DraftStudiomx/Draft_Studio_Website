"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useLocale, useTranslations } from "next-intl";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { groq } from "next-sanity";

interface Project {
  _id: string;
  title: string;
  slug: string;
  tags: string;
  year: string;
  sizeHome: "lg" | "sm";
  coverImage?: { asset: { _ref: string } };
}

const homeProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc) [0...3] {
    _id, title, "slug": slug.current, tags, year, sizeHome, coverImage
  }
`;

const FALLBACK: Record<string, Project[]> = {
  en: [
    { _id: "1", slug: "estudios-nacionales", title: "Estudios Nacionales", tags: "Web Design · Development", year: "2025", sizeHome: "lg" },
    { _id: "2", slug: "contavlic",           title: "Contavlic",           tags: "Web Design · Development", year: "2025", sizeHome: "sm" },
    { _id: "3", slug: "next-project",        title: "Next project",        tags: "Brand · Web",              year: "2025", sizeHome: "sm" },
  ],
  es: [
    { _id: "1", slug: "estudios-nacionales", title: "Estudios Nacionales", tags: "Diseño Web · Desarrollo", year: "2025", sizeHome: "lg" },
    { _id: "2", slug: "contavlic",           title: "Contavlic",           tags: "Diseño Web · Desarrollo", year: "2025", sizeHome: "sm" },
    { _id: "3", slug: "next-project",        title: "Siguiente proyecto",  tags: "Marca · Web",             year: "2025", sizeHome: "sm" },
  ],
};

function WorkCard({
  project,
  cardRef,
  placeholderTitle,
  placeholderSub,
}: {
  project: Project;
  cardRef: (el: HTMLAnchorElement | null) => void;
  placeholderTitle: string;
  placeholderSub: string;
}) {
  const isLg = project.sizeHome === "lg";
  const isPlaceholder = project.slug === "next-project";

  return (
    <Link
      href={isPlaceholder ? "/work" : `/work/${project.slug}`}
      ref={cardRef}
      className="work-card"
      style={{
        display: "flex", flexDirection: "column",
        textDecoration: "none", color: "inherit",
        gridRow: isLg ? "span 2" : undefined,
      }}
    >
      {/* Media */}
      <div
        className="work-card__media"
        style={{
          position: "relative", overflow: "hidden",
          background: "radial-gradient(120% 120% at 70% 20%, #1b1b22 0%, #0E0E12 60%)",
          aspectRatio: isLg ? "4/4.6" : "16/9.6",
        }}
      >
        {project.coverImage?.asset ? (
          <Image
            src={urlFor(project.coverImage).width(1600).quality(95).url()}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            className="work-card__img"
            sizes="(max-width:768px) 100vw, 40vw"
          />
        ) : (
          <div
            className="work-card__img"
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(120% 120% at 70% 20%, #1b1b22 0%, #0E0E12 60%)",
              transition: "transform .7s cubic-bezier(.16,1,.3,1)",
            }}
          />
        )}

        {isPlaceholder ? (
          <div style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center", padding: "24px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(22px,2.4vw,32px)", letterSpacing: "-0.02em", color: "var(--ds-paper)" }}>
                {placeholderTitle}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ds-graphite)" }}>
                {placeholderSub}
              </span>
            </div>
          </div>
        ) : (
          <span
            className="work-card__arrow"
            style={{
              position: "absolute", right: "18px", bottom: "18px", zIndex: 2,
              width: "46px", height: "46px", borderRadius: "50%",
              display: "grid", placeItems: "center",
              background: "var(--ds-cobalto)", color: "var(--ds-paper)", fontSize: "16px",
              opacity: 0, transform: "translateY(10px) scale(.85)",
              transition: "opacity .4s cubic-bezier(.16,1,.3,1), transform .4s cubic-bezier(.16,1,.3,1)",
            }}
          >→</span>
        )}
      </div>

      {/* Body */}
      {!isPlaceholder && (
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: "16px", padding: "18px 2px 0", overflow: "hidden",
        }}>
          <h3
            className="work-card__title"
            style={{
              fontFamily: "var(--font-display)", fontWeight: 500,
              letterSpacing: "-0.025em", color: "var(--ds-ink)",
              fontSize: isLg ? "clamp(28px,3vw,40px)" : "clamp(22px,2vw,28px)",
              transition: "transform .4s cubic-bezier(.16,1,.3,1), color .3s ease",
            }}
          >
            {project.title}
          </h3>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end",
            gap: "4px", flexShrink: 0, paddingTop: "6px",
            fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".06em",
            textTransform: "uppercase", color: "var(--ds-graphite)",
            textAlign: "right", whiteSpace: "nowrap",
          }}>
            <span>{project.tags}</span>
            <span style={{ color: "var(--ds-graph-300)" }}>{project.year}</span>
          </div>
        </div>
      )}
    </Link>
  );
}

export default function WorkPreview() {
  const t        = useTranslations("work");
  const locale   = useLocale();
  const fallback = FALLBACK[locale] ?? FALLBACK.en;
  const cardRefs = useRef<HTMLAnchorElement[]>([]);
  const [projects, setProjects] = useState<Project[]>(fallback);

  useEffect(() => {
    setProjects(fallback);
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    client.fetch<Project[]>(homeProjectsQuery)
      .then((data) => { if (data?.length) setProjects(data); })
      .catch(() => {/* keep fallback */});
  }, []);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reducedMotion) {
      gsap.set(cards, { opacity: 0, y: 34 });

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLAnchorElement);
          if (!visible.length) return;
          visible.forEach((el) => observer.unobserve(el));
          gsap.to(visible, { opacity: 1, y: 0, duration: 0.85, ease: "expo.out", stagger: 0.12, overwrite: true });
        },
        { threshold: 0.05 }
      );

      cards.forEach((el) => observer.observe(el));

      const hoverCleanups: (() => void)[] = [];
      cards.forEach((card) => {
        const img   = card.querySelector<HTMLElement>(".work-card__img");
        const arrow = card.querySelector<HTMLElement>(".work-card__arrow");
        const title = card.querySelector<HTMLElement>(".work-card__title");

        const enter = () => {
          if (img)   gsap.to(img,   { scale: 1.03, duration: 0.7, ease: "power3.out" });
          if (arrow) gsap.to(arrow, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" });
          if (title) gsap.to(title, { y: -4, color: "var(--ds-cobalto)", duration: 0.4, ease: "power3.out" });
        };
        const leave = () => {
          if (img)   gsap.to(img,   { scale: 1, duration: 0.7, ease: "power3.out" });
          if (arrow) gsap.to(arrow, { opacity: 0, y: 10, scale: 0.85, duration: 0.4, ease: "power3.out" });
          if (title) gsap.to(title, { y: 0, color: "var(--ds-ink)", duration: 0.3, ease: "power3.out" });
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        hoverCleanups.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      });

      return () => {
        observer.disconnect();
        gsap.set(cards, { clearProps: "opacity,transform" });
        hoverCleanups.forEach((fn) => fn());
      };
    }

    // Hover only (reduced motion)
    const hoverCleanups: (() => void)[] = [];
    cards.forEach((card) => {
      const img   = card.querySelector<HTMLElement>(".work-card__img");
      const arrow = card.querySelector<HTMLElement>(".work-card__arrow");
      const title = card.querySelector<HTMLElement>(".work-card__title");

      const enter = () => {
        if (img)   gsap.to(img,   { scale: 1.03, duration: 0.7, ease: "power3.out" });
        if (arrow) gsap.to(arrow, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" });
        if (title) gsap.to(title, { y: -4, color: "var(--ds-cobalto)", duration: 0.4, ease: "power3.out" });
      };
      const leave = () => {
        if (img)   gsap.to(img,   { scale: 1, duration: 0.7, ease: "power3.out" });
        if (arrow) gsap.to(arrow, { opacity: 0, y: 10, scale: 0.85, duration: 0.4, ease: "power3.out" });
        if (title) gsap.to(title, { y: 0, color: "var(--ds-ink)", duration: 0.3, ease: "power3.out" });
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      hoverCleanups.push(() => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
      });
    });

    return () => hoverCleanups.forEach((fn) => fn());
  }, [projects]);

  return (
    <section
      aria-label="Selected work"
      className="work-section"
      style={{
        background: "var(--ds-paper)",
        padding: "clamp(90px,12vh,150px) var(--gutter) clamp(80px,11vh,130px)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        gap: "20px", marginBottom: "clamp(34px,5vh,56px)",
      }}>
        <span style={{
          display: "flex", alignItems: "center", gap: "10px",
          fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: ".14em",
          textTransform: "uppercase", color: "var(--ds-graphite)",
        }}>
          <span style={{ width: "26px", height: "1px", background: "var(--ds-graphite)", display: "inline-block" }} />
          {t("sectionLabel")}
        </span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "12px",
          letterSpacing: ".1em", color: "var(--ds-graph-300)",
        }}>
          [ {String(projects.length).padStart(2, "0")} {t("projectsCount")} ]
        </span>
      </div>

      {/* Grid */}
      <div className="work-grid" style={{
        display: "grid", gridTemplateColumns: "1.25fr 1fr",
        gap: "clamp(16px,1.8vw,26px)",
      }}>
        {projects.map((project, i) => (
          <WorkCard
            key={project._id}
            project={project}
            cardRef={(el) => { if (el) cardRefs.current[i] = el; }}
            placeholderTitle={t("nextPlaceholderTitle")}
            placeholderSub={t("nextPlaceholderSub")}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .work-grid { grid-template-columns: 1fr !important; gap: 26px !important; }
          .work-section { padding-bottom: clamp(48px,6vh,80px) !important; }
          /* No aspect-ratio override — let each card keep its natural ratio */
        }
        @media (max-width: 480px) {
          .work-grid { gap: 22px !important; }
          /* Cap very tall cards so they don't consume the whole screen */
          .work-card__media { max-height: 75vh; }
        }
      `}</style>

      {/* Footer link */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(48px,7vh,80px)" }}>
        <Link
          href="/work"
          className="work__all"
          style={{
            fontFamily: "var(--font-mono)", fontSize: "13px", letterSpacing: ".06em",
            textTransform: "uppercase", color: "var(--ds-ink)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "10px",
            position: "relative", padding: "6px 2px",
          }}
        >
          {t("viewAllWork")} <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
