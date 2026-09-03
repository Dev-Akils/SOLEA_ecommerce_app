"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const { count } = useCart();
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");


  return (
    <header className="bg-maroon-950 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-widest">
          SOLEA
        </Link>
        {!isAdmin && (
          <>
            <nav className="hidden md:flex gap-8 text-sm uppercase tracking-wide">
              <Link href="/shop?category=Running">Running</Link>
              <Link href="/shop?category=Court">Court</Link>
              <Link href="/shop?category=Everyday">Everyday</Link>
              <Link href="/shop">Shop All</Link>
            </nav>

            <div className="flex items-center gap-4 text-sm">
              <Link href="/login">Login</Link>

              <Link href="/cart" className="relative">
                Cart

                {count > 0 && (
                  <span className="absolute -top-2 -right-3 bg-gold-500 text-maroon-950 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
