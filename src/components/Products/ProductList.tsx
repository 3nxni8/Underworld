"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductsType } from "@/types";
import Categories from "@/components/ui/Categories";
import ProductCard from "@/components/Products/ProductCard";
import { getAllProducts } from "@/constants/products";

export type ProductListProps = {
	title?: string;
	subtitle?: string;
	initialCategory?: string;
	showCount?: boolean;
	className?: string;
};

const ProductList = ({
	title = "Featured products",
	subtitle = "Browse our latest drops and classics",
	initialCategory = "All",
	showCount = true,
	className = "",
}: ProductListProps) => {
	const [mounted, setMounted] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

	useEffect(() => {
		const id = requestAnimationFrame(() => setMounted(true));
		return () => cancelAnimationFrame(id);
	}, []);

	const allProducts: ProductsType = useMemo(() => getAllProducts(), []);

	const categories = useMemo(() => {
		const set = new Set<string>(["All"]);
		allProducts.forEach((p) => set.add(p.category));
		return Array.from(set);
	}, [allProducts]);

	const filtered = useMemo(() => {
		return selectedCategory === "All"
			? allProducts
			: allProducts.filter((p) => p.category === selectedCategory);
	}, [selectedCategory, allProducts]);

	return (
		<section className={["w-full", className].join(" ")}>
			<div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-center">
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-neutral-900">
						{title}
					</h2>
					<p className="text-sm text-neutral-500">{subtitle}</p>
				</div>
				{showCount && (
					<div className="text-sm text-neutral-500">{filtered.length} items</div>
				)}
			</div>

			<Categories
				categories={categories}
				selected={selectedCategory}
				onChange={setSelectedCategory}
				className="mb-4 sm:mb-6"
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{filtered.map((product, i) => (
					<div
						key={product.id}
						className={[
							"transition-all duration-500 ease-out",
							mounted
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-2",
						].join(" ")}
						style={{ transitionDelay: `${i * 60}ms` }}
					>
						<ProductCard product={product} />
					</div>
				))}
			</div>
		</section>
	);
};

export default ProductList;
