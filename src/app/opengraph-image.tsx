import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt     = "Draft Studio — Precision Web Studio";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const logoB64 = readFileSync(join(process.cwd(), "src/app/_logo-b64.txt"), "utf8").trim();
  const logoSrc = `data:image/png;base64,${logoB64}`;

  return new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0E0E12", padding: "72px 80px" }}>
        <img src={logoSrc} width={280} height={70} style={{ objectFit: "contain", objectPosition: "left" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "80px", fontWeight: "bold", color: "#F1EEE5", lineHeight: "1" }}>Precision</span>
          <span style={{ fontSize: "80px", fontWeight: "bold", color: "#2B41E5", lineHeight: "1" }}>Web Studio.</span>
          <span style={{ fontSize: "24px", color: "#6B6B72", marginTop: "24px" }}>Design &amp; Development · México</span>
        </div>
        <span style={{ fontSize: "14px", color: "#B9B5A8", letterSpacing: "0.1em" }}>DRAFTSTUDIO.MX</span>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
