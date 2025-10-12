import React from 'react';
import { MagnifyingGlassIcon,  UserIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { NavbarIconProps } from "@/types";
import { Button } from "@/components/ui/CustomButton";

export type NavbarIconName = 'search' | 'middle' | 'account' | 'shopping';


const Navbaricons: React.FC<NavbarIconProps> = ({
  name,
  className = 'h-6 w-6',
  cartCount,
  onClick,
  ariaLabel,
}) => {
  const baseProps = {
    className,
    'aria-hidden': ariaLabel ? undefined : true,
  } as const;

  switch (name) {
    case 'search':
      return (
        <Button type="button" aria-label={ariaLabel ?? 'Search'} onClick={onClick} variant="ghost" size="sm" className="inline-flex p-0 h-auto w-auto">
          <MagnifyingGlassIcon {...baseProps} />
        </Button>
      );

    case 'account':
      return (
        <span className="inline-flex" aria-label={ariaLabel ?? 'Account'}>
          <UserIcon {...baseProps} />
        </span>
      );

    case 'shopping':
      return (
        <span className="relative inline-flex" aria-label={ariaLabel ?? 'Cart'}>
          <ShoppingBagIcon {...baseProps} />
          {!!cartCount && cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none text-white">
              {cartCount}
            </span>
          )}
        </span>
      );

    default:
      return null;
  }
};

export default Navbaricons;
