import {ButtonHTMLAttributes, InputHTMLAttributes} from "react";

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
  sizes: string[]; // Array of strings for sizes
  colors: string[]; // Array of strings for colors
  image: {
    [color: string]: string | string[]; // Allow single or multiple image URLs per color
  };
  category: string;
}

export type ProductsType = ProductType[];


declare interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    bgVariant?: 'Primary'| 'secondary'|'danger' | 'outline' | 'success' | 'ghost';
    textVariant?: 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick?: () => void;
}

