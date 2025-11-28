import { z } from "zod";

export type NavbarIconName = 'search' | 'middle' | 'account' | 'shopping';

export interface NavbarIconProps {
    name: NavbarIconName;
    className?: string;
    cartCount?: number; // Only used for shopping
    onClick?: () => void;
    ariaLabel?: string;
}

export type ProductType = {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    stock: number; // Available inventory
    sizes: string[]; // Array of strings for sizes
    colors: string[]; // Array of strings for colors
    image: {
        [color: string]: string | string[]; // Allow single or multiple image URLs per color
    };
    category: string;
}

export type ProductsType = ProductType[];

export type CartItemType = {
    id: string;
    productId: number;
    name: string;
    price: number;
    image: string;
    size: string;
    color: string;
    qty: number;
};

export type CartItemsType = CartItemType[];

export const shippingFormSchema = z.object({
    name: z.string().min(1, "Name is required!"),
    email: z.email().min(1, "Email is required!"),
    phone: z
        .string()
        .min(7, "Phone number must be between 7 and 10 digits!")
        .max(10, "Phone number must be between 7 and 10 digits!")
        .regex(/^\d+$/, "Phone number must contain only numbers!"),
    address: z.string().min(1, "Address is required!"),
    city: z.string().min(1, "City is required!"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
    cardHolder: z.string().min(1, "Card holder is required!"),
    cardNumber: z
        .string()
        .min(16, "Card Number is required!")
        .max(16, "Card Number is required!"),
    expirationDate: z
        .string()
        .regex(
            /^(0[1-9]|1[0-2])\/\d{2}$/,
            "Expiration date must be in MM/YY format!"
        ),
    cvv: z.string().min(3, "CVV is required!").max(3, "CVV is required!"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;

export type CartStoreStateType = {
    cart: CartItemsType;
    hasHydrated: boolean;
};

export type CartStoreActionsType = {
    addToCart: (product: CartItemType) => void;
    removeFromCart: (product: CartItemType) => void;
    clearCart: () => void;
};
