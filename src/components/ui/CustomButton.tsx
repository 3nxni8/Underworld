"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";



// --- 1. Defining Button Variants with CVA ---
// All style logic is centralized here.
const buttonVariants = cva(
    // Base classes applied to all variants
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                // Use project-neutral palette across variants
                default: "bg-neutral-900 text-white hover:bg-neutral-800",
                destructive: "bg-red-600 text-white hover:bg-red-700",
                outline: "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
                secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
                ghost: "bg-transparent hover:bg-neutral-50 text-neutral-900",
                link: "bg-transparent underline-offset-4 hover:underline text-neutral-900",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-9 px-3 rounded-md",
                lg: "h-11 px-8 rounded-md",
                icon: "h-10 w-10", // For icon-only buttons
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// --- 2. Defining Component Props ---
// We use VariantProps to get the types from our cva definition.
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    href?: string; // optional link mode
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    // Explicitly declare to satisfy TS in consumers even without cva type inference
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

// --- 3. The Button Component Implementation ---
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            href,
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const isDisabled = isLoading || disabled;

        // The content of the button, including icons and loading state
        const buttonContent = (
            <>
                {isLoading && (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
                {children}
                {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
            </>
        );

        // --- Polymorphism: Render a Link or a Button ---
        if (href) {
            return (
                <Link
                    href={href}
                    className={cn(buttonVariants({ variant, size, className }))}
                    // The 'ref' for a Next.js Link is on the underlying `<a>` tag.
                >
                    {buttonContent}
                </Link>
            );
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isDisabled}
                type={(props as any)?.type ?? "button"}
                {...props}
            >
                {buttonContent}
            </button>
        );
    }
);
Button.displayName = "Button";

// --- 4. Exporting ---
export { Button, buttonVariants };