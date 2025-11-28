import { getProductById } from "@/constants/products";
import ProductDetails from "@/components/Products/ProductInteraction";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const product = Number.isFinite(id) ? getProductById(id) : undefined;

  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetails product={product} />
    </main>
  );
}
