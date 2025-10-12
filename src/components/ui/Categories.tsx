export type CategoriesProps = {
  categories: string[];
  selected?: string;
  onChange?: (value: string) => void;
  className?: string;
};

import { Button } from "@/components/ui/CustomButton";

function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

const Categories = ({ categories, selected = "All", onChange, className }: CategoriesProps) => {
  return (
    <div className={cx("-mx-1 overflow-x-auto pb-1", className)}>
      <div className="flex w-full items-center gap-2 px-1">
        {categories.map((cat) => {
          const active = cat === selected;
          return (
            <Button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => onChange?.(cat)}
              variant={active ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap px-3 py-1.5 text-xs"
            >
              {cat}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
