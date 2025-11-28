"use client";

type CategoriesProps = {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
  className?: string;
};

const Categories = ({ categories, selected, onChange, className = "" }: CategoriesProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === category
              ? "bg-neutral-900 text-white"
              : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default Categories;
