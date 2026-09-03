import Link from "next/link";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getFeatured() {
  await connectDB();
  const featured = await Product.find({ isFeatured: true, isActive: true }).limit(4).lean();
  return JSON.parse(JSON.stringify(featured));
}

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <main>
      <section className="bg-maroon-950 text-white">
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
              className="inline-block bg-gold-500 text-maroon-950 font-semibold px-6 py-3 rounded"
            >
              Shop Aero 01 →
            </Link>
          </div>
          <div className="bg-white rounded-lg h-80" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold mb-8">Shop by motion</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Running", "Court", "Everyday"].map((c) => (
            <Link
              key={c}
              href={`/shop?category=${c}`}
              className="bg-maroon-900 text-white rounded-lg h-40 flex items-end p-5 hover:opacity-90"
            >
              <span className="text-lg font-semibold">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
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
      </section>
    </main>
  );
}
