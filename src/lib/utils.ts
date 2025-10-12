// filepath: /Users/abdullahinur/Documents/Project0/Den/client/src/lib/utils.ts

// Minimal classnames merge helper used by UI components
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

