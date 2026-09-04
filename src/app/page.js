import Link from "next/link";
import Image from 'next/image'
import banner from "@/app/assets/banner1.png";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import court from '@/app/assets/court.png';
import running from '@/app/assets/running.png';
import everyday from '@/app/assets/everyday.png';



export const dynamic = "force-dynamic";

async function getFeatured() {
  await connectDB();
  const featured = await Product.find({ isFeatured: true, isActive: true }).limit(4).lean();
  return JSON.parse(JSON.stringify(featured));
}

export default async function HomePage() {
  const featured = await getFeatured();

  const currentYear = new Date().getFullYear();
  const categories = [
    {
      name: 'Running Shoes',
      href: '/shop?category=running',
      image: running,
    },
    {
      name: 'Court Shoes',
      href: '/shop?category=court',
      image: court,
    },
    {
      name: 'Everyday Shoes',
      href: '/shop?category=everyday',
      image: everyday,
    },
  ];
  return (
    <main>
      <section id="hero" className="bg-maroon-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold-500 uppercase tracking-widest text-xs mb-4">
              Drop 01 / Run Without Noise
            </p>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              The pace changes.
              <br />
              The point stays.
            </h1>
            <p className="text-gray-300 mb-8 max-w-md">
              A responsive daily runner with a split outsole, a featherlight ride, and one
              impossible-to-miss streak.
            </p>
            <Link
              href="/shop?category=Running"
              className="inline-block bg-gold-500 text-maroon-950 text-sm font-semibold px-6 py-3 btn-gold
               rounded"
            >
              Shop Now →
            </Link>
          </div>
          <div className="bg-white rounded-lg h-80" >
            <Image src={banner}
              alt="Aero 01" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="relative w-full  py-16 px-6 sm:px-10 lg:px-16 overflow-hidden">
        {/* Background radial glow bg-[#3A0F14]*/}
        <div
          className="pointer-events-none absolute inset-0 opacity-40
           bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
            from-amber-700/20 via-transparent to-black/40"
        />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center">
          {/* Section Heading  text-[#EBDCC6]*/}
          <h2 className="text-3xl sm:text-3xl md:text-3xl font-bold  font-sans tracking-wide
           text-maroon-950 text-sm uppercase
           tracking-tight mb-12 text-center drop-shadow-md">
            Shop by motion
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative flex flex-col items-center 
                justify-between rounded-xl bg-[#24080B] border 
                border-amber-900/30 p-5 shadow-2xl transition-all
                 duration-300 hover:-translate-y-1 hover:border-amber-600/40 
                 hover:shadow-amber-950/40"
              >
                {/* Product Visual Container */}
                <div className="relative w-full h-56 overflow-hidden
                 rounded-lg bg-[#3A0F14]/40 border border-white/5 flex items-center justify-center p-4">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Title */}
                <span className="mt-5 text-xl sm:text-2xl
                 font-serif italic tracking-wide text-[#EBDCC6]
                  transition-colors duration-200 ">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Explore Collections Button
          <div className="mt-14 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center 
              px-8 py-3 rounded-full text-sm font-bold
               tracking-wider text-[#3A0F14] bg-gradient-to-r
                from-[#EBDCC6] via-[#D8BC93] to-[#C4A77D] 
                shadow-lg shadow-black/40 transition-all duration-300 
                hover:brightness-110 hover:scale-105 active:scale-95"
            >
              Explore Collections
            </Link>
          </div> */}
        </div>
      </section>
      <div className=" w-full relative">
        {/* Background radial glow bg-[#3A0F14]*/}
        <div
          className="pointer-events-none absolute inset-0 opacity-40
           bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
            from-amber-700/20 via-transparent to-black/40"
        />
        <section className="max-w-7xl relative mx-auto px-6 py-14 ">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">The latest in motion</h2>
            <Link href="/shop" className="text-sm underline">
              All styles
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
            {featured.length === 0 && (
              <p className="col-span-4 text-gray-500">
                No featured products yet — add some from the admin dashboard.
              </p>
            )}
          </div>
        </section></div>


      <footer className="w-full bg-[#1A0609] border-t border-amber-900/30 text-[#EBDCC6]/80 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Brand & Copyright */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <a href="#hero"><span className="text-xl font-extrabold uppercase tracking-widest text-[#EBDCC6] mb-1">
               SOLEA
              </span></a>
              <p className="text-xs text-[#EBDCC6]/60">
                &copy; {currentYear} SOLEA Inc. All rights reserved.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium">
              <Link
                href="/shop?category=running"
                className="transition-colors hover:text-[#EBDCC6] text-[#EBDCC6]/70"
              >
                Running
              </Link>
              <Link
                href="/shop?category=court"
                className="transition-colors hover:text-[#EBDCC6] text-[#EBDCC6]/70"
              >
                Court
              </Link>
              <Link
                href="/shop?category=everyday"
                className="transition-colors hover:text-[#EBDCC6] text-[#EBDCC6]/70"
              >
                Everyday
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-[#EBDCC6] text-[#EBDCC6]/70"
              >
                Privacy Policy & Terms
              </Link>
              {/* <Link
                href="/terms"
                className="transition-colors hover:text-[#EBDCC6] text-[#EBDCC6]/70"
              >
                Terms of Service
              </Link> */}
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
