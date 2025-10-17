"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/CustomButton";

export default function ForgotPage() {
  const [notice, setNotice] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("Password reset flow is coming soon. This is a UI preview only.");
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <main className="h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      <div className="mx-4 flex w-full max-w-md flex-col items-start">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Forgot password</h1>
          <p className="mt-1 text-sm text-neutral-600">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-md">
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

          <Button type="submit" className="w-full">
            Send reset link
          </Button>

          {notice && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {notice}
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600 w-full">
          Remembered it?{" "}
          <Link href="/Login" className="font-medium text-neutral-900 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
