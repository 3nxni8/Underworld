import { getProductById } from "@/constants/products";
import ProductDetails from "@/components/Products/ProductDetails";
import { notFound } from "next/navigation";

type PageParams = {
  params: { id: string };
};

export default function ProductDetailPage({ params }: PageParams) {
  const id = Number(params.id);
  const product = Number.isFinite(id) ? getProductById(id) : undefined;

  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetails product={product} />
    </main>
  );
}
