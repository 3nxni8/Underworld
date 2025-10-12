"use client";

import { useState } from "react";
import { Button } from "@/components/ui/CustomButton";

export type PaymentButtonProps = {
  name: string;
  amount: number; // unit price
  quantity: number;
  image?: string;
  disabled?: boolean;
  className?: string;
};

export default function PaymentButton({ name, amount, quantity, image: _image, disabled, className = "" }: PaymentButtonProps) {
  const [notice, setNotice] = useState<string>("");

  const handleClick = () => {
    if (disabled) return;
    setNotice("Payments are coming soon. This is a preview of the checkout UI only.");
    // Auto-hide after a moment
    window.setTimeout(() => setNotice(""), 3000);
  };

  const total = (amount * Math.max(1, quantity)).toFixed(2);

  return (
    <div>
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={["w-full", className].join(" ")}
      >
        {disabled ? "Payment unavailable" : `Pay ${total}`}
      </Button>
      {notice && (
        <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {notice}
        </div>
      )}
      {/* Accessible description for screen readers */}
      <p className="sr-only" aria-live="polite">
        {disabled
          ? "Payment is currently disabled."
          : `Checkout preview for ${name}. Quantity ${quantity}. Total ${total}.`}
      </p>
    </div>
  );
}
