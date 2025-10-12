import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-neutral-200 py-8 text-sm text-neutral-600">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="font-semibold text-neutral-900">Underworld</div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="hover:text-neutral-900">Home</Link>
          <Link href="/Products" className="hover:text-neutral-900">Products</Link>
          <Link href="/collection" className="hover:text-neutral-900">Collection</Link>
          <Link href="/about" className="hover:text-neutral-900">About</Link>
          <Link href="/contact" className="hover:text-neutral-900">Contact</Link>
        </nav>
        <div className="text-xs">© {new Date().getFullYear()} Den. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
