"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/CustomButton";

export default function SignUpPage() {
  const [notice, setNotice] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("Sign up flow is coming soon. This is a UI preview only.");
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <main className="h-screen w-full flex items-center justify-center overflow-hidden bg-white">
      <div className="mx-4 flex w-full max-w-md flex-col items-start">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Create account</h1>
          <p className="mt-1 text-sm text-neutral-600">Sign up to get started</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 w-full max-w-md">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-800">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="Abdullahi nur"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

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
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-neutral-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-neutral-800">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <Button type="submit" className="w-full">
            Create account
          </Button>

          {notice && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {notice}
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600 w-full">
          Already have an account?{" "}
          <Link href="/Login" className="font-medium text-neutral-900 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
