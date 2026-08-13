import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";

const TO_EMAIL = "karlmchazlettjr@powerdillo.com";

export async function POST(req: NextRequest) {
  try {
    const { name, email, service, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { error: dbError } = await admin.from("quote_requests").insert({
      name,
      email: email.toLowerCase(),
      service: service || null,
      message,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: "PowerDillo Quotes <quotes@powerdillo.com>",
        to: TO_EMAIL,
        replyTo: email,
        subject: `New quote request from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nService: ${service || "—"}\n\n${message}`,
      });

      if (emailError) {
        console.error("Resend send error:", emailError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error — check Vercel logs" }, { status: 500 });
  }
}
