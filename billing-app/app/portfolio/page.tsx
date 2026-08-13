import Link from "next/link";
import Image from "next/image";
import logo from "../icon.png";
import { NavAuthButton } from "@/app/components/NavAuthButton";
import { Footer } from "@/app/components/Footer";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">

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
              <Link href="/" className="font-extrabold hover:text-orange-500 transition-colors">
                Home
              </Link>
              <Link href="/#services" className="font-extrabold hover:text-orange-500 transition-colors">
                Services
              </Link>
              <Link href="/#contact" className="font-extrabold hover:text-orange-500 transition-colors">
                Contact Us
              </Link>
              <Link href="/portfolio" className="font-extrabold text-orange-500">
                Portfolio
              </Link>
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

      <div className="flex-1" />

      <Footer />

    </div>
  );
}
