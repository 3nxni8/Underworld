"use client";

import { useState } from "react";
import { Button } from "@/components/ui/CustomButton";

export default function ContactPage() {
  const [notice, setNotice] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice("Contact form is for preview only. Submissions will be enabled later.");
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">Contact</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-800">Name</label>
          <input id="name" type="text" required className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-800">Email</label>
          <input id="email" type="email" required className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900" />
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block text-sm font-medium text-neutral-800">Message</label>
          <textarea id="message" rows={5} required className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900" />
        </div>
        <Button type="submit" className="w-full py-2.5">Send message</Button>
        {notice && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">{notice}</div>
        )}
      </form>
    </main>
  );
}
