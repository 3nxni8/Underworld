"use client";

import Image from "next/image";
import PaymentButton from "@/components/ui/PaymentButton";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/CustomButton";

export default function CartPage() {
  const { items, total, count, updateQty, removeItem, clear } = useCart();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900">Your cart</h1>

      {items.length === 0 ? (
        <div className="text-sm text-neutral-600">Your cart is empty.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {items.map((i) => (
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
                    <div className="text-sm font-semibold">${i.price.toFixed(2)}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-md border border-neutral-300">
                      <Button variant="ghost" size="sm" className="px-2 py-1 text-sm" onClick={() => updateQty(i.id, i.qty - 1)}>−</Button>
                      <input
                        type="number"
                        min={1}
                        value={i.qty}
                        onChange={(e) => updateQty(i.id, Math.max(1, Number(e.target.value) || 1))}
                        className="w-12 border-x border-neutral-300 py-1 text-center text-sm outline-none"
                      />
                      <Button variant="ghost" size="sm" className="px-2 py-1 text-sm" onClick={() => updateQty(i.id, i.qty + 1)}>+</Button>
                    </div>
                    <Button variant="link" size="sm" className="text-red-600 hover:underline" onClick={() => removeItem(i.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-2 text-sm text-neutral-600">Items: {count}</div>
            <div className="mb-4 text-lg font-semibold">Subtotal: ${total.toFixed(2)}</div>
            <PaymentButton
              name="Cart subtotal"
              amount={total}
              quantity={1}
              disabled={!items.length}
            />
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
