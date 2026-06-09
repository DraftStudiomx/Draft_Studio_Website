import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "Draft Studio — Precision Web Studio";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:          "1200px",
          height:         "630px",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "space-between",
          background:     "#0E0E12",
          padding:        "72px 80px",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "10px", height: "34px", background: "#2B41E5", borderRadius: "2px" }} />
            <div style={{ width: "10px", height: "34px", background: "#F1EEE5", borderRadius: "2px" }} />
          </div>
          <span style={{ fontSize: "22px", fontWeight: "bold", color: "#F1EEE5" }}>
            Draft Studio
          </span>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "80px", fontWeight: "bold", color: "#F1EEE5", lineHeight: 1 }}>
            Precision
          </span>
          <span style={{ fontSize: "80px", fontWeight: "bold", color: "#2B41E5", lineHeight: 1 }}>
            Web Studio.
          </span>
          <span style={{ fontSize: "24px", color: "#6B6B72", marginTop: "24px" }}>
            Design &amp; Development · México
          </span>
        </div>

        {/* Bottom: URL */}
        <span style={{ fontSize: "16px", color: "#B9B5A8", letterSpacing: "0.08em" }}>
          DRAFTSTUDIO.MX
        </span>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
