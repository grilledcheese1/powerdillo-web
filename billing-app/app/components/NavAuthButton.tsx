"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  fallbackLabel: string;
  fallbackHref: string;
}

export function NavAuthButton({ fallbackLabel, fallbackHref }: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm font-semibold px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
      >
        Sign Out
      </button>
    );
  }

  return (
    <Link
      href={fallbackHref}
      className="text-sm font-semibold px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors whitespace-nowrap"
    >
      {fallbackLabel}
    </Link>
  );
}
