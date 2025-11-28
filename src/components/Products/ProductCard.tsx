"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductType } from "@/types";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: ProductType;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const defaultColor = product.colors?.[0];
  const firstVal =
    (defaultColor ? product.image[defaultColor] : undefined) ??
    Object.values(product.image)[0];
  const imageSrc = Array.isArray(firstVal) ? firstVal[0] : firstVal;

  const isOutOfStock = product.stock <= 0;

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={[
        "group relative rounded-2xl border border-neutral-200 bg-white",
        "shadow-sm hover:shadow-lg transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "overflow-hidden",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
    >
      <Link href={`/Products/${product.id}`} className="block" aria-label={`View ${product.name}`}>
        {/* Image area */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900">
                Out of Stock
              </span>
            </div>
          )}

          {/* Top-left category badge */}
          {product.category && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-white/85 px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur">
              {product.category}
            </span>
          )}

          {/* Top-right price pill */}
          <span className="absolute right-3 top-3 z-10 rounded-full bg-neutral-900/85 px-2.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
            {formatPrice(product.price)}
          </span>

          {/* Bottom overlay (name left, colors right; always visible) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="from-black/60 via-black/35 to-transparent bg-gradient-to-t px-3 pb-3 pt-10">
              <div className="flex items-end justify-between gap-3">
                <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-white drop-shadow">
                  {product.name}
                </h3>
                {product.colors?.length ? (
                  <div className="flex items-center gap-2">
                    {product.colors.slice(0, 6).map((c) => (
                      <span
                        key={c}
                        title={c}
                        className="h-4 w-4 rounded-full border border-white/50 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                    {product.colors.length > 6 && (
                      <span className="text-xs text-white/85">+{product.colors.length - 6}</span>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Removed separate text block below to keep name in overlay */}
      </Link>
    </div>
  );
};

export default ProductCard;
