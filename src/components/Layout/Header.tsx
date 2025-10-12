"use client"

import React from 'react';
import Link from "next/link";
import Navbaricons from "../ui/Navbaricons";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { count } = useCart();
  return (
    <header className="w-full h-20 p-4">
      <div className="container mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="text-2xl font-bold font-sans font-display text-foreground">
          <Link href="/" className="shrink-0">Underworld</Link>
        </div>

        {/* Center: Desktop navigation */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">Home</Link>
          <Link href="/Products" className="text-foreground/70 hover:text-foreground transition-colors">Products</Link>
          <Link href="/collection" className="text-foreground/70 hover:text-foreground transition-colors">Collection</Link>
          <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">About</Link>
          <Link href="/contact" className="text-foreground/70 hover:text-foreground transition-colors">Contact</Link>
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-4">
          <Navbaricons name="search" ariaLabel="Search" />
          <Link href="/Login" aria-label="Account" className="inline-flex">
            <Navbaricons name="account" ariaLabel="Account" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="inline-flex">
            <Navbaricons name="shopping" ariaLabel="Cart" cartCount={count} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;