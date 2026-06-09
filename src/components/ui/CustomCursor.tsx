"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Only on pointer-fine devices
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    if (!isPointerFine) {
      cursor.style.display = "none";
      dot.style.display = "none";
      return;
    }

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let dx = cx, dy = cy;
    let tx = cx, ty = cy;

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Smooth follow via GSAP ticker
    const ticker = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      dx += (tx - dx) * 0.55;
      dy += (ty - dy) * 0.55;
      cursor.style.transform = `translate(${cx}px,${cy}px)`;
      dot.style.transform = `translate(${dx}px,${dy}px)`;
    };
    gsap.ticker.add(ticker);

    // Link hover state
    const addLink = (el: Element) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-link"));
    };

    const initLinks = () => {
      document.querySelectorAll('a, button, [data-cursor="link"]').forEach(addLink);
    };
    initLinks();

    // Re-init on DOM mutations (for dynamic content)
    const observer = new MutationObserver(initLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(ticker);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="ds-cursor"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          width: 46,
          height: 46,
          marginTop: -23,
          marginLeft: -23,
          borderRadius: "50%",
          border: "1.5px solid var(--ds-ink)",
          background: "var(--ds-paper)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.04em",
          color: "var(--ds-ink)",
          transition:
            "width 0.3s cubic-bezier(.22,1,.36,1), height 0.3s cubic-bezier(.22,1,.36,1), margin 0.3s cubic-bezier(.22,1,.36,1), font-size 0.25s ease, background-color 0.28s ease, color 0.28s ease, border-color 0.28s ease",
          willChange: "transform",
        }}
      >
        DS
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          width: 5,
          height: 5,
          marginTop: -2.5,
          marginLeft: -2.5,
          borderRadius: "50%",
          background: "var(--ds-ink)",
          willChange: "transform",
          transition: "opacity 0.2s ease",
        }}
      />
      <style>{`
        .ds-cursor.is-link {
          width: 20px !important;
          height: 20px !important;
          margin-top: -10px !important;
          margin-left: -10px !important;
          background: transparent !important;
          border-color: var(--ds-cobalto) !important;
          border-width: 1.5px !important;
          color: transparent !important;
          font-size: 0 !important;
        }
      `}</style>
    </>
  );
}
