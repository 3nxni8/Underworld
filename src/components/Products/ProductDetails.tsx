"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductType } from "@/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/CustomButton";

type ProductDetailsProps = {
  product: ProductType;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const colorKeys = useMemo(() => Object.keys(product.image), [product.image]);
  const defaultColor = product.colors?.[0] ?? colorKeys[0];
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] ?? "");
  const [qty, setQty] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const imageVal = product.image[selectedColor] ?? product.image[colorKeys[0]];
  const images = useMemo(() => (Array.isArray(imageVal) ? imageVal : imageVal ? [imageVal] : []), [imageVal]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeImage = images[activeIndex];

  const canBuy = Boolean(selectedSize) && Boolean(selectedColor);

  const handleAddToCart = () => {
    setError("");
    if (!canBuy) {
      setError("Please choose a size and color before adding to cart.");
      return;
    }
    addItem({ product, size: selectedSize, color: selectedColor, qty: Math.max(1, qty) });
    router.push(
        `/Cart?productId=${product.id}&size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(
            selectedColor
        )}&qty=${Math.max(1, qty)}`
    );
  };

  const handleBuyNow = () => {
    setError("");
    if (!canBuy) {
      setError("Please choose a size and color before checkout.");
      return;
    }
    router.push(
      `/Checkout?productId=${product.id}&size=${encodeURIComponent(selectedSize)}&color=${encodeURIComponent(
        selectedColor
      )}&qty=${Math.max(1, qty)}`
    );
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Left: Images */}
      <div>
        <div className="relative aspect-square w-full  rounded-2xl bg-neutral-100">
          {activeImage && (
            <Image
              src={activeImage}
              alt={`${product.name} - ${selectedColor}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          )}
        </div>

        {/* Thumbnails strip if multiple images */}
        {images.length > 1 && (
          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <Button
                key={`${img}-${idx}`}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveIndex(idx)}
                className={[
                  "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md",
                  activeIndex === idx ? "ring-2 ring-neutral-900" : "hover:opacity-90",
                ].join(" ")}
              >
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain" />
              </Button>
            ))}
          </div>
        )}


      </div>

      {/* Right: Details */}
      <div className="flex flex-col gap-6">
        <div>
          {product.category && (
            <span className="mb-2 inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
              {product.category}
            </span>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            {product.name}
          </h1>
          <div>
              <div>
                  <div className="text-3xl font-bold tracking-tight">${product.price.toFixed(2)}</div>
              </div>
          </div>
          <p className="mt-1 text-sm text-neutral-600">{product.shortDescription}</p>
        </div>

          {/* Description */}
          <div>
              <div className="text-sm leading-6 text-neutral-700">{product.description}</div>
          </div>



        {/* Sizes */}
        {product.sizes?.length ? (
          <div>
            <div className="mb-2 text-sm font-medium text-neutral-800">Select size</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <Button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  variant={selectedSize === s ? "default" : "outline"}
                  size="sm"
                  className="px-3 py-1.5"
                  aria-pressed={selectedSize === s}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Colors (as labels) */}
        {product.colors?.length ? (
          <div>
            <div className="mb-2 text-sm font-medium text-neutral-800">Select color</div>
            <div className="flex flex-wrap items-center gap-3">
              {product.colors.map((c) => (
                <Button
                  key={c}
                  type="button"
                  title={c}
                  aria-label={`Select color ${c}`}
                  onClick={() => setSelectedColor(c)}
                  variant="ghost"
                  size="sm"
                  className={[
                    "h-8 w-8 rounded-full border shadow-sm transition",
                    selectedColor === c ? "ring-2 ring-offset-2 ring-neutral-900" : "hover:scale-105",
                  ].join(" ")}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Quantity */}
        <div>
          <div className="mb-2 text-sm font-medium text-neutral-800">Quantity</div>
          <div className="inline-flex items-center rounded-md border border-neutral-300">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-3 py-2 text-sm hover:bg-neutral-50"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </Button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="w-14 border-x border-neutral-300 py-2 text-center text-sm outline-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-3 py-2 text-sm hover:bg-neutral-50"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </Button>
            </div>
        </div>

        {error && (
          <div className="-mt-2 text-sm text-red-600" role="alert">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleBuyNow}
            disabled={!canBuy}
          >
            Buy now
          </Button>
          <Button
            type="button"
            onClick={handleAddToCart}
            variant="outline"
          >
            Add to cart
          </Button>
          <span className="text-xs text-neutral-500">Free returns within 30 days</span>
        </div>


      </div>
    </div>
  );
}
