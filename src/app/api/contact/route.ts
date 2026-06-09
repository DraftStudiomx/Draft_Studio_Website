import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Prevent static analysis from trying to call this at build time
export const dynamic = "force-dynamic";

// Destination email — where Draft Studio receives leads
const TO_EMAIL   = "hola@draftstudio.mx";
// From address — must match a verified domain in Resend
const FROM_EMAIL = "noreply@draftstudio.mx";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { name, email, company, need, project } = body as {
      name:     string;
      email:    string;
      company?: string;
      need?:    string;
      project:  string;
    };

    // Basic validation
    if (!name?.trim() || !email?.trim() || !project?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Send notification to Draft Studio
    await resend.emails.send({
      from:    `Draft Studio Contact <${FROM_EMAIL}>`,
      to:      TO_EMAIL,
      replyTo: email,
      subject: `New lead: ${name}${company ? ` · ${company}` : ""}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0E0E12;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#6B6B72;border-bottom:1px solid #DAD6CB;padding-bottom:12px;margin-bottom:24px;">
            Draft Studio — New Contact
          </p>

          <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6;">
            <tr><td style="padding:6px 0;color:#6B6B72;width:110px;">Name</td>     <td style="padding:6px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B72;">Email</td>    <td style="padding:6px 0;"><a href="mailto:${email}" style="color:#2B41E5;">${email}</a></td></tr>
            ${company ? `<tr><td style="padding:6px 0;color:#6B6B72;">Company</td>  <td style="padding:6px 0;">${company}</td></tr>` : ""}
            ${need    ? `<tr><td style="padding:6px 0;color:#6B6B72;">Service</td>  <td style="padding:6px 0;">${need}</td></tr>` : ""}
          </table>

          <div style="margin-top:24px;padding:20px;background:#F1EEE5;border-radius:4px;">
            <p style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6B6B72;margin:0 0 10px;">Project</p>
            <p style="font-size:15px;line-height:1.6;margin:0;white-space:pre-wrap;">${project}</p>
          </div>

          <p style="margin-top:24px;font-size:13px;color:#6B6B72;">
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    // Send confirmation to the lead
    await resend.emails.send({
      from:    `Draft Studio <${FROM_EMAIL}>`,
      to:      email,
      subject: "We received your message — Draft Studio",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#0E0E12;">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#6B6B72;border-bottom:1px solid #DAD6CB;padding-bottom:12px;margin-bottom:28px;">
            Draft Studio
          </p>

          <h1 style="font-size:28px;font-weight:700;letter-spacing:-0.04em;line-height:1.1;margin:0 0 20px;">
            Got it, ${name.split(" ")[0]}.
          </h1>

          <p style="font-size:16px;line-height:1.65;color:#3A3A40;margin:0 0 16px;">
            We've received your message and will get back to you within <strong>24 hours</strong>.
          </p>

          <p style="font-size:16px;line-height:1.65;color:#3A3A40;margin:0 0 32px;">
            In the meantime, feel free to browse our work at
            <a href="https://draftstudio.mx/work" style="color:#2B41E5;text-decoration:none;">draftstudio.mx/work</a>.
          </p>

          <p style="font-size:13px;color:#6B6B72;border-top:1px solid #DAD6CB;padding-top:20px;margin-top:32px;">
            Draft Studio · León, Guanajuato, México ·
            <a href="https://draftstudio.mx" style="color:#2B41E5;text-decoration:none;">draftstudio.mx</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact/route] Resend error:", err);
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
