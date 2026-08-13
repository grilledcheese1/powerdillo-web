"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../icon.png";
import SmartCityNetwork from "@/app/components/SmartCityNetwork";
import { NavAuthButton } from "@/app/components/NavAuthButton";
import { Footer } from "@/app/components/Footer";
import { useSession } from "next-auth/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// ── Types ─────────────────────────────────────────────────────────────────────
type Availability = "available" | "limited" | "unavailable";
type Category = "Lifting" | "Earthmoving" | "Power" | "Access";

interface Product {
  id: string;
  name: string;
  category: Category;
  availability: Availability;
  summary: string;
  description: string;
  specs: string[];
}

// ── Products ──────────────────────────────────────────────────────────────────
const products: Product[] = [
  {
    id: "scissor-lift",
    name: "Electric Scissor Lift",
    category: "Lifting",
    availability: "available",
    summary: "Compact electric platform for indoor elevated work up to 19 ft.",
    description:
      "The Electric Scissor Lift is engineered for indoor and outdoor use on firm, level surfaces. At 19 ft platform height with a 500 lb capacity, it handles electrical, HVAC, and overhead construction with ease. Zero-emission electric drive keeps enclosed job sites OSHA-compliant and free of exhaust.",
    specs: [
      "Max platform height: 19 ft",
      "Load capacity: 500 lbs",
      "Platform size: 4.5 × 2.5 ft",
      "Drive: Electric — zero emission",
      "Machine weight: 2,680 lbs",
    ],
  },
  {
    id: "skid-steer",
    name: "Skid Steer Loader",
    category: "Earthmoving",
    availability: "available",
    summary: "Versatile compact loader built for tight sites and heavy material handling.",
    description:
      "The Skid Steer Loader punches above its weight in a compact footprint. Zero-turn radius performance makes it ideal for congested work areas. Accepts ISO-standard attachments — buckets, augers, brooms, forks — making it the most versatile machine on any commercial or residential site.",
    specs: [
      "Operating capacity: 1,750 lbs",
      "Engine: 74 HP diesel",
      "Bucket capacity: 0.5 cu yd",
      "Machine width: 5.9 ft",
      "Attachment standard: ISO universal hitch",
    ],
  },
  {
    id: "generator-50kw",
    name: "50kW Diesel Generator",
    category: "Power",
    availability: "limited",
    summary: "Heavy-duty portable generator for continuous power on grid-independent sites.",
    description:
      "This 50kW diesel generator delivers reliable three-phase power wherever the grid doesn't reach. Includes an automatic transfer switch, digital load monitoring, and a sound-attenuated enclosure rated at 67 dBA — compliant with most municipal noise ordinances for daytime operations.",
    specs: [
      "Output: 50kW / 62.5 kVA",
      "Fuel type: Diesel",
      "Tank: 75 gal — 48-hr runtime at 75% load",
      "Voltage: 120/240V & 277/480V",
      "Sound level: 67 dBA @ 23 ft",
    ],
  },
  {
    id: "mini-excavator",
    name: "Mini Excavator (3.5T)",
    category: "Earthmoving",
    availability: "unavailable",
    summary: "Compact 3.5-ton excavator for trenching and demo in space-constrained sites.",
    description:
      "The 3.5-ton Mini Excavator pairs a tight swing radius with serious digging force. Its retractable undercarriage passes through standard doorways and gates, making it the go-to machine for urban excavation, utility trenching, and landscaping where larger equipment won't fit. Currently rented — contact us to join the waitlist.",
    specs: [
      "Operating weight: 7,700 lbs",
      "Engine: 24.4 HP",
      "Max dig depth: 9.7 ft",
      "Bucket breakout force: 6,400 lbf",
      "Undercarriage: Retractable (3.9–5.2 ft)",
    ],
  },
];

// ── Pricing tiers ─────────────────────────────────────────────────────────────
const pricingTiers = [
  {
    id: "monthly",
    label: "Monthly",
    price: "$299",
    unit: "/ mo",
    savings: null as string | null,
    badge: null as string | null,
    description: "Flexible month-to-month. Cancel anytime.",
    features: ["1 piece of equipment", "Standard support (M–F)", "Delivery & pickup included", "Monthly equipment swap", "No long-term commitment"],
    cta: "Select Monthly",
  },
  {
    id: "two-month",
    label: "2-Month",
    price: "$539",
    unit: "total",
    savings: "Save 10%",
    badge: null as string | null,
    description: "Short-term coverage for defined project phases.",
    features: ["1 piece of equipment", "Priority support", "Delivery & pickup included", "One free equipment swap", "Project coordination check-in"],
    cta: "Select 2 Months",
  },
  {
    id: "six-month",
    label: "6-Month",
    price: "$1,439",
    unit: "total",
    savings: "Save 20%",
    badge: "Most Popular",
    description: "Mid-range coverage with expanded equipment access.",
    features: ["Up to 2 pieces of equipment", "Priority support (7 days)", "Delivery & pickup included", "Free mid-term maintenance check", "Dedicated account rep", "Two free swaps"],
    cta: "Select 6 Months",
  },
  {
    id: "annual",
    label: "1-Year",
    price: "$2,519",
    unit: "total",
    savings: "Save 30%",
    badge: "Best Value",
    description: "Full project lifecycle at the lowest rate.",
    features: ["Up to 3 pieces of equipment", "24/7 priority support", "Delivery & pickup included", "Quarterly maintenance included", "Dedicated account manager", "Unlimited swaps", "Fuel assistance on select units"],
    cta: "Select Annual",
  },
];

// ── Config maps ───────────────────────────────────────────────────────────────
const availConfig: Record<Availability, { label: string; dot: string; text: string; pill: string }> = {
  available:   { label: "Available",  dot: "bg-[#788c5d]", text: "text-[#788c5d]", pill: "bg-[#788c5d]/10 text-[#788c5d]" },
  limited:     { label: "Limited",    dot: "bg-[#d97757]", text: "text-[#d97757]", pill: "bg-[#d97757]/10 text-[#d97757]" },
  unavailable: { label: "Rented Out", dot: "bg-gray-400",  text: "text-gray-400",  pill: "bg-gray-100 text-gray-500" },
};

const catConfig: Record<string, { pill: string }> = {
  Lifting:    { pill: "bg-[#6a9bcc]/10 text-[#6a9bcc]" },
  Earthmoving:{ pill: "bg-[#d97757]/10 text-[#d97757]" },
  Power:      { pill: "bg-[#788c5d]/10 text-[#788c5d]" },
  Access:     { pill: "bg-purple-50 text-purple-500" },
};

const categories = Array.from(new Set(products.map((p) => p.category)));

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab]             = useState<"rentals" | "my-rentals">("rentals");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedCard, setExpandedCard]       = useState<string | null>(null);
  const [filterAvail, setFilterAvail]         = useState("all");
  const [filterCat, setFilterCat]             = useState("all");

  const filtered = products.filter(
    (p) => (filterAvail === "all" || p.availability === filterAvail) &&
           (filterCat   === "all" || p.category    === filterCat)
  );

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".product-card");
    cards.forEach((card) => {
      gsap.set(card, { x: -250, opacity: 0 });
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          once: true,
        },
        x: 0,
        opacity: 1,
        duration: 1.0,
        ease: "power3.out",
      });
    });
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div className="min-h-screen text-[#141413] font-sans" style={{ backgroundColor: "#faf9f5" }}>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
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
              <Link href="/" className="font-extrabold hover:text-orange-500 transition-colors">Home</Link>
              <Link href="/#services" className="font-extrabold hover:text-orange-500 transition-colors">Services</Link>
              <Link href="/#contact"  className="font-extrabold hover:text-orange-500 transition-colors">Contact Us</Link>
              <Link href="/portfolio" className="font-extrabold hover:text-orange-500 transition-colors">Portfolio</Link>
              <Link href="/dashboard" className="font-extrabold text-orange-500">Rentals &amp; Solutions</Link>
            </div>
          </div>
          <div className="pl-20">
            <NavAuthButton fallbackLabel="Log In" fallbackHref="/login" />
          </div>
        </div>
      </nav>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#141413] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#d97757]/10 blur-[90px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto flex items-stretch">
          <div className="flex-1 flex flex-col justify-center py-14 px-6 pr-10">
            <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-3">Equipment Rental</p>
            <h1 className="text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Poppins','Arial',sans-serif" }}>
              Rentals &amp; Solutions
            </h1>
            <p className="text-gray-400 text-base max-w-xl leading-relaxed" style={{ fontFamily: "'Lora','Georgia',serif" }}>
              Professional-grade equipment on your timeline. Browse available units, then choose the rental term that fits your project.
            </p>
          </div>
          <div className="hidden lg:block relative overflow-hidden" style={{ width: "550px", flexShrink: 0, pointerEvents: "none" }}>
            <SmartCityNetwork />
          </div>
        </div>
      </section>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6 flex">
          {(["rentals", "my-rentals"] as const).map((t) => (
            <button key={t} onClick={() => { setActiveTab(t); setSelectedProduct(null); }}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === t ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {t === "rentals" ? "Rentals & Products" : "My Rentals"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────────── */}
      {activeTab === "my-rentals" ? (

        /* ── My Rentals placeholder ──────────────────────────────────────────── */
        <section className="py-16 min-h-[60vh] flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-[#d97757]/10 border border-[#d97757]/20 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#141413] mb-3" style={{ fontFamily: "'Poppins','Arial',sans-serif" }}>No Active Rentals</h2>
            <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Lora','Georgia',serif" }}>
              Your rentals will display here once you are logged in and have purchased.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setActiveTab("rentals")} className="px-6 py-3 bg-orange-500 hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors">
                Browse Rentals
              </button>
              {!session && (
                <Link href="/login" className="px-6 py-3 border border-gray-200 hover:border-orange-500 text-gray-700 hover:text-orange-500 text-sm font-semibold rounded-xl transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </section>

      ) : selectedProduct ? (

        /* ── Pricing section (shown after "Rent This") ───────────────────────── */
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">

            {/* Back + product context */}
            <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8 group">
              <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Products
            </button>

            <div className="mb-10">
              <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-2">Select a Term</p>
              <h2 className="text-3xl font-bold tracking-tight text-[#141413] mb-2" style={{ fontFamily: "'Poppins','Arial',sans-serif" }}>
                Renting: {selectedProduct.name}
              </h2>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catConfig[selectedProduct.category].pill}`}>{selectedProduct.category}</span>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${availConfig[selectedProduct.availability].pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${availConfig[selectedProduct.availability].dot}`} />
                  {availConfig[selectedProduct.availability].label}
                </span>
              </div>
            </div>

            {/* Pricing cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {pricingTiers.map((tier) => (
                <div key={tier.id} className={`relative bg-white rounded-2xl p-6 flex flex-col border transition-all hover:shadow-lg ${tier.badge ? "border-[#d97757]/50 shadow-md" : "border-gray-100 shadow-sm hover:border-[#d97757]/30"}`}>
                  {tier.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {tier.badge}
                    </span>
                  )}
                  <div className="mb-4">
                    <p className="text-xs font-mono tracking-widest uppercase text-orange-500 mb-2">{tier.label}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-[#141413]" style={{ fontFamily: "'Poppins','Arial',sans-serif" }}>{tier.price}</span>
                      <span className="text-gray-400 text-xs mb-1">{tier.unit}</span>
                    </div>
                    {tier.savings && <span className="inline-block mt-1.5 text-xs font-semibold text-[#788c5d] bg-[#788c5d]/10 px-2 py-0.5 rounded-full">{tier.savings}</span>}
                    <p className="text-gray-500 text-xs mt-2.5 leading-relaxed" style={{ fontFamily: "'Lora','Georgia',serif" }}>{tier.description}</p>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() =>
                      router.push(
                        `/billing?plan=${tier.id}&product=${selectedProduct.id}&productName=${encodeURIComponent(selectedProduct.name)}`
                      )
                    }
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${tier.badge ? "bg-orange-500 hover:bg-orange-400 text-white" : "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"}`}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">
              Need a custom scope or fleet arrangement?{" "}
              <Link href="/#contact" className="text-orange-500 hover:underline font-medium">Contact us</Link> for a tailored quote.
            </p>
          </div>
        </section>

      ) : (

        /* ── Product grid + filter panel ─────────────────────────────────────── */
        <section className="py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

            {/* Products list */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 mb-5">
                {filtered.length} {filtered.length === 1 ? "product" : "products"} available
              </p>
              <div className="space-y-4 products-list">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm">
                    No products match your filters.{" "}
                    <button onClick={() => { setFilterAvail("all"); setFilterCat("all"); }} className="text-orange-500 hover:underline">Clear filters</button>
                  </div>
                ) : filtered.map((product) => {
                  const isExpanded = expandedCard === product.id;
                  const avail = availConfig[product.availability];
                  const cat = catConfig[product.category];
                  const canRent = product.availability !== "unavailable";

                  return (
                    <div key={product.id} className="product-card bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">

                      {/* Card header — always visible */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.pill}`}>{product.category}</span>
                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${avail.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
                              {avail.label}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-[#141413] mb-1.5" style={{ fontFamily: "'Poppins','Arial',sans-serif" }}>
                          {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Lora','Georgia',serif" }}>
                          {product.summary}
                        </p>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-6 pb-2 border-t border-gray-50">
                          <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-4" style={{ fontFamily: "'Lora','Georgia',serif" }}>
                            {product.description}
                          </p>
                          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-4">
                            {product.specs.map((spec) => (
                              <div key={spec} className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="text-orange-500 font-bold mt-0.5 shrink-0">—</span>
                                {spec}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card footer */}
                      <div className="px-6 pb-5 flex items-center justify-between gap-4">
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : product.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                          {isExpanded ? "Hide details" : "View details"}
                        </button>

                        <button
                          disabled={!canRent}
                          onClick={() => canRent && setSelectedProduct(product)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${canRent ? "bg-orange-500 hover:bg-orange-400 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                        >
                          {canRent ? "Rent This" : "Unavailable"}
                          {canRent && (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter panel */}
            <aside className="lg:w-60 shrink-0 lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-[#141413]" style={{ fontFamily: "'Poppins','Arial',sans-serif" }}>Filters</h3>
                  {(filterAvail !== "all" || filterCat !== "all") && (
                    <button onClick={() => { setFilterAvail("all"); setFilterCat("all"); }} className="text-xs text-orange-500 hover:underline">
                      Clear all
                    </button>
                  )}
                </div>

                {/* Availability */}
                <div className="mb-5">
                  <p className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-3">Availability</p>
                  <div className="space-y-2">
                    {(["all", "available", "limited", "unavailable"] as const).map((v) => {
                      const label = v === "all" ? "All" : v === "unavailable" ? "Rented Out" : v.charAt(0).toUpperCase() + v.slice(1);
                      return (
                        <button key={v} onClick={() => setFilterAvail(v)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${filterAvail === v ? "bg-[#d97757]/10 text-orange-500" : "text-gray-500 hover:bg-gray-50"}`}>
                          {v !== "all" && <span className={`w-2 h-2 rounded-full shrink-0 ${availConfig[v as Availability].dot}`} />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-3">Category</p>
                  <div className="space-y-2">
                    <button onClick={() => setFilterCat("all")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterCat === "all" ? "bg-[#d97757]/10 text-orange-500" : "text-gray-500 hover:bg-gray-50"}`}>
                      All
                    </button>
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setFilterCat(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${filterCat === cat ? "bg-[#d97757]/10 text-orange-500" : "text-gray-500 hover:bg-gray-50"}`}>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${catConfig[cat].pill}`}>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </section>
      )}

      <Footer />

    </div>
  );
}
