"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

export default function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const authRoutes = new Set(["/Login", "/SignUp", "/Forgot"]);
  const isAuth = authRoutes.has(pathname);

  return (
    <div className="mx-auto p-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
      {!isAuth && <Header />}
      <main className={!isAuth ? "pt-20" : "pt-0"}>{children}</main>
      {!isAuth && <Footer />}
    </div>
  );
}

