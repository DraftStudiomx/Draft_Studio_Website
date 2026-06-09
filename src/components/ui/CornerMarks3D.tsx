"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const RINGS = [0, 1, 2]; // 3 rings, staggered
const DURATION = 3.2;    // seconds per full cycle
const STAGGER  = DURATION / RINGS.length; // offset between rings
const MIN_SCALE = 0.06;
const MAX_SCALE = 1;
const MARK = 26;         // corner mark arm length (px)
const VIEWBOX = 300;
const CX = VIEWBOX / 2;
const CY = VIEWBOX / 2;
const MAX_R = VIEWBOX * 0.46; // max half-size of the largest square

export default function CornerMarks3D() {
  const ringRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const tls: gsap.core.Timeline[] = [];

    RINGS.forEach((i) => {
      const g = ringRefs.current[i];
      if (!g) return;

      // Each ring starts at a different point in the cycle
      const delay = -STAGGER * i;

      const tl = gsap.timeline({ repeat: -1, delay });

      tl.fromTo(
        g,
        { scale: MIN_SCALE, opacity: 0,   transformOrigin: "50% 50%" },
        {
          scale: MAX_SCALE,
          opacity: 0,
          duration: DURATION,
          ease: "none",  // linear so we control opacity separately
        }
      );

      // Opacity: fade in then fade out within the same tween
      // We use a separate tl for opacity on the same target
      const opTl = gsap.timeline({ repeat: -1, delay });
      opTl
        .fromTo(g, { opacity: 0 }, { opacity: 1, duration: DURATION * 0.18, ease: "power3.out" })
        .to(g, { opacity: 0, duration: DURATION * 0.82, ease: "power2.in" });

      tls.push(tl, opTl);
    });

    return () => tls.forEach(tl => tl.kill());
  }, []);

  // Build corner mark path for a square of half-size r centered at CX,CY
  function cornerMarks(r: number) {
    const x1 = CX - r, y1 = CY - r; // top-left
    const x2 = CX + r, y2 = CY + r; // bottom-right
    const m = MARK;

    return [
      // top-left
      `M${x1 + m},${y1} L${x1},${y1} L${x1},${y1 + m}`,
      // top-right
      `M${x2 - m},${y1} L${x2},${y1} L${x2},${y1 + m}`,
      // bottom-left
      `M${x1 + m},${y2} L${x1},${y2} L${x1},${y2 - m}`,
      // bottom-right
      `M${x2 - m},${y2} L${x2},${y2} L${x2},${y2 - m}`,
    ].join(" ");
  }

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width="100%"
      style={{ aspectRatio: "1", display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      {RINGS.map((i) => (
        <g
          key={i}
          ref={el => { ringRefs.current[i] = el; }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {/* Square outline */}
          <rect
            x={CX - MAX_R}
            y={CY - MAX_R}
            width={MAX_R * 2}
            height={MAX_R * 2}
            fill="none"
            stroke="#0E0E12"
            strokeWidth="1"
            strokeOpacity="0.25"
          />

          {/* Corner marks — cobalto accent */}
          <path
            d={cornerMarks(MAX_R)}
            fill="none"
            stroke="#2B41E5"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </g>
      ))}

      {/* Static center dot */}
      <circle cx={CX} cy={CY} r="3" fill="#2B41E5" opacity="0.7" />
    </svg>
  );
}
