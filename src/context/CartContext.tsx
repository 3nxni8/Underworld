"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProductType } from "@/types";
import { getProductStock } from "@/constants/products";
import { calculateTotal, formatPrice } from "@/lib/utils";

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
  subtotal: number; // subtotal before tax
  tax: number; // 6% tax
  shipping: number; // shipping fee (free over RM 200)
  total: number; // final total
  formattedSubtotal: string;
  formattedTax: string;
  formattedShipping: string;
  formattedTotal: string;
  addItem: (params: { product: ProductType; size: string; color: string; qty: number }) => boolean;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  getAvailableStock: (productId: number) => number;
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

  // Calculate how much stock is already in cart for a product
  const getCartQtyForProduct = (productId: number): number => {
    return items
      .filter((i) => i.productId === productId)
      .reduce((sum, i) => sum + i.qty, 0);
  };

  // Get available stock considering cart items
  const getAvailableStock = (productId: number): number => {
    const totalStock = getProductStock(productId);
    const inCart = getCartQtyForProduct(productId);
    return Math.max(0, totalStock - inCart);
  };

  const addItem: CartContextValue["addItem"] = ({ product, size, color, qty }) => {
    if (!size || !color || qty <= 0) return false;

    // Check stock availability
    const availableStock = getAvailableStock(product.id);
    if (availableStock <= 0) return false;

    const actualQty = Math.min(qty, availableStock);
    if (actualQty <= 0) return false;

    const firstImageVal = product.image[color] ?? Object.values(product.image)[0];
    const firstImage = Array.isArray(firstImageVal) ? firstImageVal[0] : firstImageVal;
    const id = `${product.id}-${size}-${color}`;

    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx >= 0) {
        const clone = [...prev];
        const newQty = clone[idx].qty + actualQty;
        // Validate against max stock
        const maxQty = getProductStock(product.id);
        const totalInCart = getCartQtyForProduct(product.id) - clone[idx].qty + newQty;
        if (totalInCart > maxQty) {
          clone[idx] = { ...clone[idx], qty: maxQty - (getCartQtyForProduct(product.id) - clone[idx].qty) };
        } else {
          clone[idx] = { ...clone[idx], qty: newQty };
        }
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
          qty: actualQty,
        },
      ];
    });
    return true;
  };

  const removeItem: CartContextValue["removeItem"] = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty: CartContextValue["updateQty"] = (id, qty) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      const maxStock = getProductStock(item.productId);
      const otherItemsQty = prev
        .filter((i) => i.productId === item.productId && i.id !== id)
        .reduce((sum, i) => sum + i.qty, 0);
      const maxAllowed = maxStock - otherItemsQty;

      return prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, maxAllowed)) } : i));
    });
  };

  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(() => Number(items.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)), [items]);
  
  const totals = useMemo(() => calculateTotal(subtotal), [subtotal]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      formattedSubtotal: formatPrice(subtotal),
      formattedTax: formatPrice(totals.tax),
      formattedShipping: totals.shipping === 0 ? "Free" : formatPrice(totals.shipping),
      formattedTotal: formatPrice(totals.total),
      addItem,
      removeItem,
      updateQty,
      clear,
      getAvailableStock,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, count, subtotal, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

