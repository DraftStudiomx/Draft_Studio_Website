"use client";

import { useTranslations } from "next-intl";

const clients = [
  { type: "word", text: "Estudios Nacionales" },
  { type: "word", text: "Contavlic" },
];

function MarqueeGroup({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(20px, 4vw, 62px)",
        paddingLeft: "clamp(20px, 4vw, 62px)",
        paddingRight: "clamp(20px, 4vw, 62px)",
        flexShrink: 0,
      }}
    >
      {clients.map((client, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "clamp(20px, 4vw, 62px)" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "clamp(26px, 3.2vw, 44px)",
              letterSpacing: "-0.025em",
              color: "var(--ds-ink)",
              whiteSpace: "nowrap",
            }}
          >
            {client.text}
          </span>
          <span
            style={{
              width: "8px",
              height: "8px",
              flexShrink: 0,
              transform: "rotate(45deg)",
              background: "var(--ds-graph-300)",
              display: "inline-block",
            }}
          />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const t = useTranslations("marquee");

  return (
    <section
      aria-label="Trusted by"
      className="marquee-sec"
      style={{
        background: "var(--ds-paper-200)",
        borderTop: "1px solid var(--ds-rule)",
        borderBottom: "1px solid var(--ds-rule)",
        padding: "34px 0 38px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          padding: "0 var(--gutter)",
          marginBottom: "30px",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--ds-graphite)",
          }}
        >
          <span
            style={{
              width: "26px",
              height: "1px",
              background: "var(--ds-graphite)",
              display: "inline-block",
            }}
          />
          {t("label")}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: ".1em",
            color: "var(--ds-graph-300)",
          }}
        >
          [ 01 — 02 ]
        </span>
      </div>

      {/* Scrolling track */}
      <div className="marquee-track">
        <MarqueeGroup hidden={false} />
        <MarqueeGroup hidden={true} />
        <MarqueeGroup hidden={true} />
        <MarqueeGroup hidden={true} />
      </div>
    </section>
  );
}
