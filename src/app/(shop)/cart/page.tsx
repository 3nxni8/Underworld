"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/CustomButton";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    count,
    formattedSubtotal,
    formattedTax,
    formattedShipping,
    formattedTotal,
    subtotal,
    updateQty,
    removeItem,
    clear,
    getAvailableStock,
  } = useCart();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-sm text-neutral-600">
          Your cart is empty.{" "}
          <Link href="/Products" className="text-neutral-900 underline hover:no-underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {items.map((i) => {
              const maxStock = getAvailableStock(i.productId) + i.qty;
              return (
                <div key={i.id} className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md bg-neutral-100">
                    <Image src={i.image} alt={i.name} fill className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">{i.name}</div>
                        <div className="text-xs text-neutral-600">Size: {i.size} • Color: {i.color}</div>
                      </div>
                      <div className="text-sm font-semibold">{formatPrice(i.price)}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-md border border-neutral-300">
                        <Button variant="ghost" size="sm" className="px-2 py-1 text-sm" onClick={() => updateQty(i.id, i.qty - 1)}>−</Button>
                        <input
                          type="number"
                          min={1}
                          max={maxStock}
                          value={i.qty}
                          onChange={(e) => updateQty(i.id, Math.max(1, Math.min(maxStock, Number(e.target.value) || 1)))}
                          className="w-12 border-x border-neutral-300 py-1 text-center text-sm outline-none"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-2 py-1 text-sm"
                          onClick={() => updateQty(i.id, i.qty + 1)}
                          disabled={i.qty >= maxStock}
                        >+</Button>
                      </div>
                      <Button variant="link" size="sm" className="text-neutral-600 hover:text-neutral-900 hover:underline" onClick={() => removeItem(i.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Items ({count})</span>
                <span className="font-medium">{formattedSubtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax (6%)</span>
                <span className="font-medium">{formattedTax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="font-medium">{formattedShipping}</span>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="text-xs text-neutral-500">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                </div>
              )}
            </div>

            <div className="my-4 border-t border-neutral-200" />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formattedTotal}</span>
            </div>

            <Button
              href="/Checkout"
              className="mt-4 w-full py-2.5 text-sm font-semibold"
              disabled={!items.length}
            >
              Proceed to Checkout
            </Button>

            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full px-4 py-2.5 text-sm font-semibold"
              onClick={clear}
            >
              Clear cart
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
