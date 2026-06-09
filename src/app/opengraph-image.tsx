import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "Draft Studio — Precision Web Studio";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  // Fetch Inter font from Google Fonts for edge runtime
  const interBold = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width:           "100%",
          height:          "100%",
          display:         "flex",
          flexDirection:   "column",
          justifyContent:  "space-between",
          background:      "#0E0E12",
          padding:         "72px 80px",
          fontFamily:      "Inter, sans-serif",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* DS logomark — two rectangles */}
          <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "10px", height: "34px", background: "#2B41E5", borderRadius: "2px" }} />
            <div style={{ width: "10px", height: "34px", background: "#F1EEE5", borderRadius: "2px", opacity: 0.6 }} />
          </div>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#F1EEE5", letterSpacing: "-0.03em" }}>
            Draft Studio
          </span>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{
            fontSize:      "72px",
            fontWeight:    700,
            color:         "#F1EEE5",
            lineHeight:    "0.92",
            letterSpacing: "-0.045em",
          }}>
            Precision
            <br />
            <span style={{ color: "#2B41E5" }}>Web Studio.</span>
          </div>
          <p style={{
            fontSize:      "22px",
            color:         "#6B6B72",
            letterSpacing: "-0.01em",
            marginTop:     "8px",
          }}>
            Design &amp; Development · México
          </p>
        </div>

        {/* Bottom: URL */}
        <div style={{
          display:       "flex",
          alignItems:    "center",
          gap:           "12px",
          fontSize:      "16px",
          color:         "#B9B5A8",
          letterSpacing: ".06em",
          textTransform: "uppercase",
        }}>
          <div style={{ width: "28px", height: "1px", background: "#3A3A40" }} />
          draftstudio.mx
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
