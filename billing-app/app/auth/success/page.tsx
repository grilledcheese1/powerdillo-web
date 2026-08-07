import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuthSuccessPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-6">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1
          className="text-4xl font-bold mb-3 leading-tight"
          style={{ fontFamily: "'Poppins','Arial',sans-serif", letterSpacing: "-0.02em" }}
        >
          Account Created
        </h1>
        <p className="text-zinc-400 text-sm mb-2">
          Welcome, <span className="text-white font-semibold">{session.user?.name}</span>
        </p>
        <p className="text-zinc-500 text-sm mb-10">
          Your account is ready. Head to the dashboard to browse equipment rentals.
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 text-sm tracking-wide"
        >
          Go to Dashboard →
        </Link>
      </div>
    </main>
  );
}
