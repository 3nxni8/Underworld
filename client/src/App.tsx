"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type View = "shop" | "cart" | "checkout" | "success";

interface Product {
  id: number;
  name: string;
  price: number; // in RM
  rating: number;
  image: string;
  category: string;
}

interface InventoryItem extends Product {
  stock: number;
}

interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TAX_RATE = 0.06; // 6% SST
const SHIPPING_FEE = 15.0; // RM 15.00
const FREE_SHIPPING_THRESHOLD = 200.0; // RM 200.00

// Initial mock inventory data
const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 1,
    name: "Urban Shadow Runner",
    price: 299.0,
    rating: 4.8,
    stock: 5,
    image: "/products/Jordan-black.png",
    category: "Running",
  },
  {
    id: 2,
    name: "Midnight Classic",
    price: 249.0,
    rating: 4.5,
    stock: 2,
    image: "/products/Air-gray.png",
    category: "Casual",
  },
  {
    id: 3,
    name: "Stealth Walker Pro",
    price: 189.0,
    rating: 4.7,
    stock: 8,
    image: "/products/Nike-gray.png",
    category: "Walking",
  },
  {
    id: 4,
    name: "Onyx Street Elite",
    price: 329.0,
    rating: 4.9,
    stock: 0,
    image: "/products/Jordan-gray.png",
    category: "Premium",
  },
  {
    id: 5,
    name: "Graphite Court",
    price: 219.0,
    rating: 4.3,
    stock: 1,
    image: "/products/Air-white.png",
    category: "Sport",
  },
  {
    id: 6,
    name: "Shadow Flex 2.0",
    price: 279.0,
    rating: 4.6,
    stock: 12,
    image: "/products/Jordan-red.png",
    category: "Training",
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatPrice = (amount: number): string => {
  return `RM ${amount.toFixed(2)}`;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  // View state for simulated routing
  const [view, setView] = useState<View>("shop");

  // Inventory state - single source of truth for stock levels
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Checkout processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // ============================================================================
  // TOAST MANAGEMENT
  // ============================================================================

  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ============================================================================
  // INVENTORY MANAGEMENT
  // ============================================================================

  const getAvailableStock = useCallback(
    (productId: number): number => {
      const item = inventory.find((p) => p.id === productId);
      return item?.stock ?? 0;
    },
    [inventory]
  );

  const decrementStock = useCallback((productId: number, qty: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, stock: Math.max(0, item.stock - qty) }
          : item
      )
    );
  }, []);

  const incrementStock = useCallback((productId: number, qty: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stock: item.stock + qty } : item
      )
    );
  }, []);

  // ============================================================================
  // CART MANAGEMENT
  // ============================================================================

  const addToCart = useCallback(
    (product: InventoryItem) => {
      const availableStock = getAvailableStock(product.id);

      if (availableStock <= 0) {
        addToast("Error: Out of Stock", "error");
        return;
      }

      // Check if already in cart
      const existingItem = cart.find((item) => item.productId === product.id);
      const currentQtyInCart = existingItem?.qty ?? 0;

      if (currentQtyInCart >= availableStock) {
        addToast("Error: Not enough stock available", "error");
        return;
      }

      // Decrement stock immediately
      decrementStock(product.id, 1);

      // Update cart
      setCart((prev) => {
        const idx = prev.findIndex((item) => item.productId === product.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
          return updated;
        }
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1,
          },
        ];
      });

      addToast("Added to Bag", "success");
    },
    [cart, getAvailableStock, decrementStock, addToast]
  );

  const updateCartQty = useCallback(
    (productId: number, newQty: number) => {
      const existingItem = cart.find((item) => item.productId === productId);
      if (!existingItem) return;

      const currentQty = existingItem.qty;
      const availableStock = getAvailableStock(productId);
      const totalAvailable = availableStock + currentQty;

      if (newQty <= 0) {
        // Remove item completely
        incrementStock(productId, currentQty);
        setCart((prev) => prev.filter((item) => item.productId !== productId));
        addToast("Item removed from cart", "info");
        return;
      }

      if (newQty > totalAvailable) {
        addToast("Error: Not enough stock available", "error");
        return;
      }

      const diff = newQty - currentQty;
      if (diff > 0) {
        // Increasing qty - decrement stock
        decrementStock(productId, diff);
      } else {
        // Decreasing qty - increment stock (refund)
        incrementStock(productId, Math.abs(diff));
      }

      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, qty: newQty } : item
        )
      );
    },
    [cart, getAvailableStock, incrementStock, decrementStock, addToast]
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      const existingItem = cart.find((item) => item.productId === productId);
      if (!existingItem) return;

      // Refund stock
      incrementStock(productId, existingItem.qty);
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      addToast("Item removed from cart", "info");
    },
    [cart, incrementStock, addToast]
  );

  const clearCart = useCallback(() => {
    // Refund all stock
    cart.forEach((item) => {
      incrementStock(item.productId, item.qty);
    });
    setCart([]);
  }, [cart, incrementStock]);

  // ============================================================================
  // PRICING CALCULATIONS
  // ============================================================================

  const cartSummary = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: cart.reduce((sum, item) => sum + item.qty, 0),
    };
  }, [cart]);

  // ============================================================================
  // CHECKOUT HANDLER
  // ============================================================================

  const handleCheckout = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (cart.length === 0) {
        addToast("Your cart is empty", "error");
        return;
      }

      setIsProcessing(true);

      // Simulate 2-second payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart (stock already decremented, no refund needed)
      setCart([]);
      setIsProcessing(false);
      setView("success");
    },
    [cart, addToast]
  );

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderToasts = () => (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-neutral-900 text-white"
              : toast.type === "error"
              ? "bg-neutral-800 text-white"
              : "bg-neutral-700 text-white"
          }`}
        >
          {toast.type === "success" && <CheckCircle className="w-4 h-4" />}
          {toast.type === "error" && <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-70"
            aria-label="Dismiss notification"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );

  const renderLoginModal = () => {
    const [showPassword, setShowPassword] = useState(false);

    if (!showLoginModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold text-neutral-900 mb-6">
            Sign In
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addToast("Login feature is simulated", "info");
              setShowLoginModal(false);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-neutral-900 text-white py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-neutral-500">
            {"Don't have an account? "}
            <button className="text-neutral-900 font-medium hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => setView("shop")}
          className="text-xl font-bold text-neutral-900 hover:opacity-80 transition-opacity"
        >
          Underworld
        </button>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setView("shop")}
            className={`transition-colors ${
              view === "shop"
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setView("cart")}
            className={`transition-colors ${
              view === "cart"
                ? "text-neutral-900"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Cart
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="Open login modal"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={() => setView("cart")}
            className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            aria-label="View cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartSummary.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {cartSummary.itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );

  const renderProductCard = (product: InventoryItem) => {
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 3;

    return (
      <div
        key={product.id}
        className={`group relative rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
          isOutOfStock ? "border-neutral-300 opacity-75" : "border-neutral-200"
        }`}
      >
        {/* Image */}
        <div className="relative aspect-square bg-neutral-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isOutOfStock ? "grayscale" : ""
            }`}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='%23e5e5e5'%3E%3Crect width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23737373' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />

          {/* Stock badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-neutral-900 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Sold Out
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-3 left-3 bg-neutral-700 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Low Stock
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-600 text-xs font-medium px-2.5 py-1 rounded-full">
            {product.category}
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 right-3 bg-neutral-900/90 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900 text-sm mb-2 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" />
              <span className="text-sm font-medium text-neutral-700">
                {product.rating}
              </span>
            </div>

            {/* Stock indicator */}
            <span
              className={`text-xs font-medium ${
                isOutOfStock
                  ? "text-neutral-500"
                  : isLowStock
                  ? "text-neutral-600"
                  : "text-neutral-500"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : `${product.stock} left`}
            </span>
          </div>

          {/* Add to cart button */}
          <button
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className={`mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {isOutOfStock ? "Out of Stock" : "Add to Bag"}
          </button>
        </div>
      </div>
    );
  };

  const renderShopView = () => (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Featured Collection
        </h1>
        <p className="text-neutral-600">
          Premium footwear crafted with precision. Free shipping on orders over{" "}
          {formatPrice(FREE_SHIPPING_THRESHOLD)}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventory.map(renderProductCard)}
      </div>
    </main>
  );

  const renderCartItem = (item: CartItem) => {
    const product = inventory.find((p) => p.id === item.productId);
    const maxQty = (product?.stock ?? 0) + item.qty;

    return (
      <div
        key={item.productId}
        className="flex gap-4 p-4 border border-neutral-200 rounded-xl bg-white"
      >
        {/* Image */}
        <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' fill='%23e5e5e5'%3E%3Crect width='96' height='96'/%3E%3C/svg%3E";
            }}
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 text-sm mb-1 truncate">
            {item.name}
          </h3>
          <p className="text-neutral-600 text-sm mb-3">
            {formatPrice(item.price)}
          </p>

          <div className="flex items-center justify-between">
            {/* Quantity controls */}
            <div className="flex items-center border border-neutral-300 rounded-lg">
              <button
                onClick={() => updateCartQty(item.productId, item.qty - 1)}
                className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {item.qty}
              </span>
              <button
                onClick={() => updateCartQty(item.productId, item.qty + 1)}
                disabled={item.qty >= maxQty}
                className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeFromCart(item.productId)}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Line total */}
        <div className="text-right">
          <p className="font-semibold text-neutral-900 text-sm">
            {formatPrice(item.price * item.qty)}
          </p>
        </div>
      </div>
    );
  };

  const renderEmptyCart = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingBag className="w-8 h-8 text-neutral-400" />
      </div>
      <h2 className="text-lg font-semibold text-neutral-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-neutral-600 mb-6 max-w-sm mx-auto">
        Looks like you haven&apos;t added anything to your cart yet. Start
        shopping to find something you&apos;ll love.
      </p>
      <button
        onClick={() => setView("shop")}
        className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
      >
        Start Shopping
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderCartView = () => (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => setView("shop")}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </button>

      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        renderEmptyCart()
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(renderCartItem)}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 sticky top-24">
              <h2 className="font-semibold text-neutral-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(cartSummary.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-medium text-neutral-900">
                    {cartSummary.shipping === 0 ? (
                      <span className="text-neutral-600">Free</span>
                    ) : (
                      formatPrice(cartSummary.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax (6% SST)</span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(cartSummary.tax)}
                  </span>
                </div>

                {cartSummary.subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-neutral-500 bg-neutral-100 p-2 rounded-lg">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - cartSummary.subtotal)}{" "}
                    more for free shipping!
                  </p>
                )}

                <div className="border-t border-neutral-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-900">Total</span>
                    <span className="font-bold text-lg text-neutral-900">
                      {formatPrice(cartSummary.total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView("checkout")}
                className="mt-6 w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="mt-3 w-full text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );

  const renderCheckoutView = () => (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => setView("cart")}
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </button>

      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-600 mb-4">Your cart is empty.</p>
          <button
            onClick={() => setView("shop")}
            className="text-neutral-900 font-medium hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      placeholder="+60 12-345 6789"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      placeholder="123 Jalan Bukit Bintang"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      placeholder="Kuala Lumpur"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postcode"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Postcode
                    </label>
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      required
                      placeholder="50100"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <h2 className="font-semibold text-neutral-900 mb-4">
                  Payment Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="cardHolder"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      name="cardHolder"
                      required
                      placeholder="JOHN DOE"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm uppercase"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      required
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiry"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-neutral-700 mb-1"
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        required
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 sticky top-24">
                <h2 className="font-semibold text-neutral-900 mb-4">
                  Order Summary
                </h2>

                {/* Cart items summary */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-10 h-10 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='%23e5e5e5'%3E%3Crect width='40' height='40'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-neutral-500">Qty: {item.qty}</p>
                      </div>
                      <p className="font-medium text-neutral-900">
                        {formatPrice(item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-medium text-neutral-900">
                      {formatPrice(cartSummary.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-medium text-neutral-900">
                      {cartSummary.shipping === 0 ? (
                        <span className="text-neutral-600">Free</span>
                      ) : (
                        formatPrice(cartSummary.shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax (6% SST)</span>
                    <span className="font-medium text-neutral-900">
                      {formatPrice(cartSummary.tax)}
                    </span>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-neutral-900">Total</span>
                      <span className="font-bold text-lg text-neutral-900">
                        {formatPrice(cartSummary.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cart.length === 0}
                  className="mt-6 w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Order
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </main>
  );

  const renderSuccessView = () => (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-2xl font-bold text-neutral-900 mb-3">
        Order Confirmed!
      </h1>
      <p className="text-neutral-600 mb-8 max-w-md mx-auto">
        Thank you for your purchase. Your order has been placed successfully.
        We&apos;ll send you an email confirmation with tracking details shortly.
      </p>

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 mb-8 text-left">
        <h2 className="font-semibold text-neutral-900 mb-3">
          What&apos;s Next?
        </h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-neutral-900" />
            Order confirmation email sent to your inbox
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-neutral-900" />
            Your order is being prepared for shipping
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-neutral-900" />
            Tracking number will be provided once shipped
          </li>
        </ul>
      </div>

      <button
        onClick={() => setView("shop")}
        className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
      >
        Continue Shopping
        <ArrowRight className="w-4 h-4" />
      </button>
    </main>
  );

  const renderFooter = () => (
    <footer className="border-t border-neutral-200 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Underworld. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-sm text-neutral-500">
          <button className="hover:text-neutral-900 transition-colors">
            Privacy
          </button>
          <button className="hover:text-neutral-900 transition-colors">
            Terms
          </button>
          <button className="hover:text-neutral-900 transition-colors">
            Contact
          </button>
        </div>
      </div>
    </footer>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {renderToasts()}
      {renderLoginModal()}
      {renderHeader()}

      {view === "shop" && renderShopView()}
      {view === "cart" && renderCartView()}
      {view === "checkout" && renderCheckoutView()}
      {view === "success" && renderSuccessView()}

      {renderFooter()}
    </div>
  );
}
