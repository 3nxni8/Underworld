import ProductList from "@/components/Products/ProductList";

export default function CollectionPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductList
        title="Collections"
        subtitle="Curated styles and iconic silhouettes"
        initialCategory="All"
      />
    </main>
  );
}

