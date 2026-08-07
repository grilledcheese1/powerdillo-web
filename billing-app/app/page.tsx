"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "./icon.png";
import BlueprintAnimation from "@/app/components/BlueprintAnimation";
import { NavAuthButton } from "@/app/components/NavAuthButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const NAV_HEIGHT = 64;

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: id, offsetY: NAV_HEIGHT },
    ease: "power3.inOut",
  });
}

// ── Letter-by-letter fade-in ─────────────────────────────────────────────────
function AnimatedLine({
  text,
  startDelay,
  className = "",
}: {
  text: string;
  startDelay: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            opacity: 0,
            animationName: "fadeInLetter",
            animationDuration: "0.12s",
            animationFillMode: "forwards",
            animationDelay: `${(startDelay + i * 0.025).toFixed(3)}s`,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// ── Line 1: "One Company."     starts at 0.70s  (12 chars × 0.025s = last at 0.975s)
// ── Line 2: "Three Divisions." starts at 1.20s  (16 chars × 0.025s = last at 1.575s)
// ── Line 3: "No Limits."       starts at 1.80s  (10 chars × 0.025s = last at 2.025s)
// ── Para fades at 2.25s, Veteran at 2.55s, Button at 2.80s

// ── Data ────────────────────────────────────────────────────────────────────
const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-13.5 0v-1.5m13.5 1.5v-1.5m0 0a3 3 0 00-3-3H8.25a3 3 0 00-3 3m13.5 0V9a3 3 0 00-3-3H8.25a3 3 0 00-3 3v5.25" />
      </svg>
    ),
    title: "IT Construction",
    description:
      "Design and build technology infrastructure for commercial and industrial clients. From network installations to full-scale tech buildouts, we deliver the backbone your operations depend on.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    title: "Subcontracting",
    description:
      "Reliable, licensed subcontracting for general contractors and project owners. We integrate seamlessly into your workflow and bring specialized trade expertise to every scope of work.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: "Equipment Rental",
    description:
      "Access professional-grade equipment without the overhead. Flexible short and long-term rental terms for construction, infrastructure, and field operations.",
  },
];

const serviceOptions = ["IT Construction", "Subcontracting", "Equipment Rental", "General Inquiry"];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [formData, setFormData] = useState({ name: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".service-card");
    gsap.set(cards, { y: 60, opacity: 0 });
    gsap.to(cards, {
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 80%",
        once: true,
      },
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out",
    });
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src={logo} alt="PowerDillo logo" width={54} height={54} className="rounded-md" />
            <span className="text-2xl font-bold tracking-tight">
              Power<span className="text-orange-500">Dillo</span>
            </span>
          </Link>

          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden sm:flex items-center gap-8 text-sm text-gray-600">
              <a
                href="#services"
                onClick={(e) => scrollToSection(e, "#services")}
                className="font-extrabold hover:text-orange-500 transition-colors"
              >
                Services
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="font-extrabold hover:text-orange-500 transition-colors"
              >
                Contact
              </a>
              <Link href="/dashboard" className="font-extrabold hover:text-orange-500 transition-colors">
                Rentals &amp; Solutions
              </Link>
            </div>
          </div>
          <div className="pl-20">
            <NavAuthButton fallbackLabel="Log In" fallbackHref="/login" />
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/construction1.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gray-950/70 pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-center">

          {/* ── Text ──────────────────────────────────────────────────────────── */}
          <div style={{ marginLeft: "1.5px" }}>
            <h1
              className="text-8xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <AnimatedLine text="One Company." startDelay={0.7} />
              <br />
              <AnimatedLine text="Three Divisions." startDelay={1.2} className="text-orange-400" />
              <br />
              <AnimatedLine text="No Limits." startDelay={1.8} />
            </h1>

            <p
              className="text-gray-400 text-xl max-w-md mb-4 leading-relaxed"
              style={{ opacity: 0, animationName: "fadeInLetter", animationDuration: "0.3s", animationFillMode: "forwards", animationDelay: "2.25s" }}
            >
              PowerDillo delivers integrated solutions across IT construction, subcontracting, and
              equipment rental — all under one standard of excellence.
            </p>

            <p
              className="text-gray-500 text-lg mb-10 flex items-center gap-2"
              style={{ opacity: 0, animationName: "fadeInLetter", animationDuration: "0.3s", animationFillMode: "forwards", animationDelay: "2.55s", marginLeft: "-8px" }}
            >
              <span aria-hidden>️</span>
              Veteran Owned &amp; Operated — Built on service, driven by results.
            </p>

            <a
              href="#services"
              onClick={(e) => scrollToSection(e, "#services")}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-semibold px-8 py-4 rounded-xl text-sm transition-colors"
              style={{ opacity: 0, animationName: "fadeInLetter", animationDuration: "0.3s", animationFillMode: "forwards", animationDelay: "2.8s" }}
            >
              Explore Our Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* ── Blueprint 3D ───────────────────────────────────────────────────── */}
          <div
            className="hidden md:block rounded-2xl overflow-hidden border border-blue-900/40 shadow-2xl shadow-blue-950/60"
            style={{ height: "520px", marginLeft: "-0.5px" }}
          >
            <BlueprintAnimation />
          </div>

        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-3">What We Do</p>
            <h2
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Our Divisions
            </h2>
            <p className="text-gray-500 mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Specialized expertise across three industries, delivered by a single accountable team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 services-grid">
            {services.map((s) => (
              <div
                key={s.title}
                className="service-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all group flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            <div className="flex flex-col justify-start">
              <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-3">
                Get In Touch
              </p>
              <h2
                className="text-4xl font-bold tracking-tight mb-5"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Request a Quote
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-10">
                Tell us about your project and we&apos;ll get back to you within one business day.
              </p>

              <div className="space-y-5 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  contact@powerdillo.com
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  (555) 000-0000
                </div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Message Received</h3>
                  <p className="text-gray-500 text-sm">We&apos;ll be in touch within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Jane Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                      <input
                        required
                        type="email"
                        placeholder="jane@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Service Interest</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select a service…</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your project…"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
                  >
                    Send Message →
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-500 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-xs text-center">
          <span className="text-white font-bold text-base tracking-tight">
            Power<span className="text-orange-500">Dillo</span>
          </span>
          <span>IT Construction · Subcontracting · Equipment Rental</span>
          <p className="text-gray-400 flex items-center gap-2">
            <span aria-hidden></span>
            Veteran Owned &amp; Operated — Proudly serving our clients with the same commitment and
            discipline instilled through military service.
          </p>
          <span className="text-gray-600 mt-2">
            © {new Date().getFullYear()} PowerDillo. All rights reserved.
          </span>
        </div>
      </footer>

    </div>
  );
}