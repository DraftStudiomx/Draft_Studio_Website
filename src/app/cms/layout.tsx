/**
 * Layout exclusivo para /cms — sin nav, footer ni page transition.
 * El Sanity Studio necesita ocupar el 100% del viewport limpio.
 */
export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="cms-root" style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#101010" }}>
      <style>{`
        #cms-root, #cms-root * { cursor: auto !important; }
        #cms-root a, #cms-root button, #cms-root [role="button"] { cursor: pointer !important; }
      `}</style>
      {children}
    </div>
  );
}
