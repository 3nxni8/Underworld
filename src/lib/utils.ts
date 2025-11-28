// filepath: /Users/abdullahinur/Documents/Project0/Den/client/src/lib/utils.ts

// Minimal classnames merge helper used by UI components
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ==========================================
// Malaysian Ringgit Currency & Tax Utilities
// ==========================================

/** Tax rate: 6% */
export const TAX_RATE = 0.06;

/** Free shipping threshold in RM */
export const FREE_SHIPPING_THRESHOLD = 200.0;

/** Standard shipping fee in RM */
export const STANDARD_SHIPPING_FEE = 15.0;

/**
 * Format a number as Malaysian Ringgit with 2 decimal places
 */
export function formatPrice(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

/**
 * Calculate tax amount (6% of subtotal)
 */
export function calculateTax(subtotal: number): number {
  return Number((subtotal * TAX_RATE).toFixed(2));
}

/**
 * Calculate shipping fee (free if subtotal >= RM 200)
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

/**
 * Calculate total including tax and shipping
 */
export function calculateTotal(subtotal: number): {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
} {
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = Number((subtotal + tax + shipping).toFixed(2));
  return { subtotal, tax, shipping, total };
}
