"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductType } from "@/types";
import { Button } from "@/components/ui/CustomButton";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

type ProductDetailsProps = {
  product: ProductType;
};

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "");
  const [qty, setQty] = useState(1);

  const imageVal = product.image[selectedColor] ?? Object.values(product.image)[0];
  const imageSrc = Array.isArray(imageVal) ? imageVal[0] : imageVal;

  const isOutOfStock = product.stock <= 0;
  const maxQty = product.stock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!selectedSize || !selectedColor) return;

    addItem({
      product,
      size: selectedSize,
      color: selectedColor,
      qty: Math.min(qty, maxQty),
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="mb-2 inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700">
            {product.category}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">{product.shortDescription}</p>
        </div>

        <div className="text-2xl font-semibold text-neutral-900">
          {formatPrice(product.price)}
        </div>

        <div className="text-sm text-neutral-600">{product.description}</div>

        {/* Stock indicator */}
        <div className="text-sm">
          {isOutOfStock ? (
            <span className="font-medium text-neutral-500">Out of stock</span>
          ) : (
            <span className="text-neutral-600">
              {product.stock} {product.stock === 1 ? "item" : "items"} in stock
            </span>
          )}
        </div>

        {/* Color Selection */}
        <div>
          <div className="mb-2 text-sm font-medium text-neutral-800">Color</div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-neutral-900 ring-2 ring-neutral-900 ring-offset-2"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <div className="mb-2 text-sm font-medium text-neutral-800">Size</div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-all ${
                  selectedSize === size
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <div className="mb-2 text-sm font-medium text-neutral-800">Quantity</div>
          <div className="inline-flex items-center rounded-md border border-neutral-300">
            <Button
              variant="ghost"
              size="sm"
              className="px-3 py-2"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={isOutOfStock}
            >
              −
            </Button>
            <input
              type="number"
              min={1}
              max={maxQty}
              value={qty}
              onChange={(e) => {
                const val = Math.max(1, Math.min(maxQty, Number(e.target.value) || 1));
                setQty(val);
              }}
              disabled={isOutOfStock}
              className="w-14 border-x border-neutral-300 py-2 text-center text-sm outline-none disabled:bg-neutral-100"
            />
            <Button
              variant="ghost"
              size="sm"
              className="px-3 py-2"
              onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
              disabled={isOutOfStock || qty >= maxQty}
            >
              +
            </Button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || !selectedSize || !selectedColor}
          className="w-full py-3 text-base font-semibold"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
