"use client";

import {
    ShoppingBasket,
    Footprints,
    Zap,
    Briefcase,
    Mountain,
    Sun,
    Home,
    Gem
} from "lucide-react";

const categories = [
    {
        name: "All Shoes",
        icon: <ShoppingBasket className="w-4 h-4" />,
        slug: "all",
        subCategories: [],
    },
    {
        name: "Sneakers",
        icon: <Footprints className="w-4 h-4" />,
        slug: "sneakers",
        subCategories: [
            { name: "Low Top", slug: "low-top" },
            { name: "High Top", slug: "high-top" },
            { name: "Slip-on", slug: "slip-on" },
            { name: "Canvas", slug: "canvas" }
        ]
    },
    {
        name: "Running & Sport",
        icon: <Zap className="w-4 h-4" />,
        slug: "sport",
        subCategories: [
            { name: "Running", slug: "running" },
            { name: "Training", slug: "training" },
            { name: "Trail", slug: "trail" },
            { name: "Cleats", slug: "cleats" }
        ]
    },
    {
        name: "Formal",
        icon: <Briefcase className="w-4 h-4" />,
        slug: "formal",
        subCategories: [
            { name: "Oxfords", slug: "oxfords" },
            { name: "Derbys", slug: "derbys" },
            { name: "Loafers", slug: "loafers" },
            { name: "Monk Straps", slug: "monk-straps" }
        ]
    },
    {
        name: "Boots",
        icon: <Mountain className="w-4 h-4" />,
        slug: "boots",
        subCategories: [
            { name: "Chelsea", slug: "chelsea" },
            { name: "Chukka", slug: "chukka" },
            { name: "Hiking", slug: "hiking" },
            { name: "Work Boots", slug: "work-boots" }
        ]
    },
    {
        name: "Sandals",
        icon: <Sun className="w-4 h-4" />,
        slug: "sandals",
        subCategories: [
            { name: "Slides", slug: "slides" },
            { name: "Flip Flops", slug: "flip-flops" },
            { name: "Gladiator", slug: "gladiator" }
        ]
    },
    {
        name: "Heels & Party",
        icon: <Gem className="w-4 h-4" />,
        slug: "heels",
        subCategories: [
            { name: "Pumps", slug: "pumps" },
            { name: "Stilettos", slug: "stilettos" },
            { name: "Wedges", slug: "wedges" },
            { name: "Platforms", slug: "platforms" }
        ]
    },
    {
        name: "Slippers",
        icon: <Home className="w-4 h-4" />,
        slug: "slippers",
        subCategories: [
            { name: "Moccasins", slug: "moccasins" },
            { name: "House Shoes", slug: "house-shoes" }
        ]
    },
];



const Categories = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const SelectCategory = SearchParams.get("category") || "all";

    const handleCategoryClick = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug === "all") {
            params.delete("category");
        } else {
            params.set("category", slug);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex space-x-4 overflow-x-auto pb-4">
            {categories.map((category) => (
                <button
                    key={category.slug}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        SelectCategory === category.slug
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    {category.icon}
                    <span>{category.name}</span>
                </button>
            ))}
        </div>
    );
}
    export default Categories;
