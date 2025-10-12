import type { ProductsType, ProductType } from "@/types";

export const products: ProductsType = [
  {
    id: 1,
    name: "Jordan 1 Retro High OG",
    shortDescription: "Classic high-top with premium leather",
    description:
      "Jordan 1 Retro High OG is the classic basketball shoe that puts a fresh spin on what you know best: crisp leather, clean lines and the perfect amount of flash to make you shine.",
    price: 199.99,
    sizes: ["S", "M", "L", "XL"],
    colors: ["red", "black", "gray"],
    image: {
      red: "/products/Jordan-red.png",
      black: "/products/Jordan-black.png",
      gray: "/products/Jordan-gray.png",
    },
    category: "Jordan",
  },
  {
    id: 2,
    name: "Air Force 1 '07",
    shortDescription: "Timeless style with everyday comfort",
    description:
      "Air Force 1 '07 is the classic basketball shoe that puts a fresh spin on what you know best: crisp leather, clean lines and the perfect amount of flash to make you shine.",
    price: 149.99,
    sizes: ["S", "M", "L", "XL"],
    colors: ["white", "gray"],
    image: {
      white: "/products/Air-white.png",
      gray: "/products/Air-gray.png",
    },
    category: "Air Force",
  },
  {
    id: 3,
    name: "Nike Blazer Mid '77 Vintage",
    shortDescription: "Vintage hoops heritage",
    description:
      "Nike Blazer Mid '77 Vintage is a classic basketball shoe that puts a fresh spin on what you know best: crisp leather, clean lines and the perfect amount of flash to make you shine.",
    price: 129.99,
    sizes: ["S", "M", "L", "XL"],
    colors: ["gray", "pink"],
    image: {
      gray: "/products/Nike-gray.png",
      pink: "/products/Nike-pink.png",
    },
    category: "Blazer",
  },
];

export const getAllProducts = (): ProductsType => products;

export const getProductById = (id: number): ProductType | undefined =>
  products.find((p) => p.id === id);

