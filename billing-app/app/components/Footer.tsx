import Link from "next/link";
import Image from "next/image";
import logo from "../icon.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact Us" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/dashboard", label: "Rentals & Solutions" },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">

          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image src={logo} alt="PowerDillo logo" width={36} height={36} className="rounded-md" />
              <span className="text-xl font-bold tracking-tight text-white">
                Power<span className="text-orange-500">Dillo</span>
              </span>
            </Link>
            <p className="text-xs font-mono tracking-widest uppercase text-gray-600 mb-4">
              IT Construction · Subcontracting · Equipment Rental
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Veteran Owned &amp; Operated — proudly serving our clients with the same
              commitment and discipline instilled through military service.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-gray-600 mb-4">
              Navigate
            </p>
            <nav className="flex flex-col gap-2.5 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-gray-600 mb-4">
              Get in Touch
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="mailto:kmchazlett@powerdillo.com"
                className="flex items-center gap-2.5 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                kmchazlett@powerdillo.com
              </a>
              <a
                href="tel:+15123485883"
                className="flex items-center gap-2.5 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                (512) 348-5883
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-xs text-gray-600 text-center sm:text-left">
          © {new Date().getFullYear()} PowerDillo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
