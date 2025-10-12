"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/CustomButton";

export default function LoginPage() {
  const [notice, setNotice] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("Authentication is coming soon. This is a UI preview only.");
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <main className="min-h-[80vh] w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border bg-white">
      {/* Left: brand / logo */}
      <div className="relative hidden md:flex items-center justify-center bg-neutral-50 p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 via-white to-neutral-100" />
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          <Image src="/icons/logo.png" alt="Underworld" width={80} height={80} priority />
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight">Underworld</h2>
          <p className="max-w-xs text-sm text-neutral-600">
            Step into the underworld of sneakers. Premium drops, curated for you.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="p-6 sm:p-10">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-600">Sign in to continue</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-800">
                Password
              </label>
              <Link href="/Forgot" className="text-xs text-neutral-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <Button type="submit" className="w-full">
            Sign in
          </Button>

          {notice && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {notice}
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link href="/SignUp" className="font-medium text-neutral-900 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
