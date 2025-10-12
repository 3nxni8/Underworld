"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProductType } from "@/types";

type CartItem = {
  id: string; // unique key: `${productId}-${size}-${color}`
  productId: number;
  name: string;
  price: number;
  image: string; // selected image
  size: string;
  color: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number; // total quantity
  total: number; // subtotal
  addItem: (params: { product: ProductType; size: string; color: string; qty: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "den_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from storage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to storage
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem: CartContextValue["addItem"] = ({ product, size, color, qty }) => {
    if (!size || !color || qty <= 0) return;
    const firstImageVal = product.image[color] ?? Object.values(product.image)[0];
    const firstImage = Array.isArray(firstImageVal) ? firstImageVal[0] : firstImageVal;
    const id = `${product.id}-${size}-${color}`;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + qty };
        return clone;
      }
      return [
        ...prev,
        {
          id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: firstImage,
          size,
          color,
          qty,
        },
      ];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty: CartContextValue["updateQty"] = (id, qty) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ items, count, total, addItem, removeItem, updateQty, clear }),
    [items, count, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

