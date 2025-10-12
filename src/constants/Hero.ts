export type HeroAction = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export type HeroStat = {
  label: string;
  value: string;
};

export type BrandLogo = {
  src: string;
  alt: string;
};

export type HeroContent = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle: string;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  stats?: HeroStat[];
  brands?: BrandLogo[];
  image?: {
    src: string;
    alt: string;
  };
};

export const HERO_CONTENT: HeroContent = {
  eyebrow: "New Arrivals",
  title: "Step into the Underworld",
  highlight: "Elevate your style",
  subtitle:
    "Discover limited-edition releases and essentials crafted with precision. Built for those who move different.",
  primaryAction: { label: "Shop now", href: "/Products", ariaLabel: "Shop new arrivals" },
  secondaryAction: { label: "Explore collections", href: "/about", ariaLabel: "Explore collections" },
  stats: [
    { label: "New drops", value: "Weekly" },
    { label: "Customers", value: "25k+" },
    { label: "Satisfaction", value: "4.9★" },
  ],
  brands: [
    { src: "/icons/stripe.png", alt: "Stripe" },
    { src: "/icons/tngo.png", alt: "Touch 'n Go" },
    { src: "/icons/visa.png", alt: "Visa" },
    { src: "/icons/duitnow.png", alt: "DuitNow" },
  ],
  image: {
    src: "/featured..png",
    alt: "Featured product",
  },
};
