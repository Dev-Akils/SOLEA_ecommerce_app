import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getProductWithRelated(slug) {
  await connectDB();
  const product = await Product.findOne({ slug, isActive: true }).lean();
  if (!product) return null;

  const related = await Product.aggregate([
    {
      $match: {
        _id: { $ne: product._id },
        isActive: true,
        $or: [{ category: product.category }, { tags: { $in: product.tags || [] } }],
      },
    },
    {
      $addFields: {
        sharedTags: {
          $size: { $ifNull: [{ $setIntersection: ["$tags", product.tags || []] }, []] },
        },
        sameCategory: { $cond: [{ $eq: ["$category", product.category] }, 1, 0] },
      },
    },
    { $sort: { sameCategory: -1, sharedTags: -1, rating: -1 } },
    { $limit: 4 },
  ]);

  return {
    product: JSON.parse(JSON.stringify(product)),
    related: JSON.parse(JSON.stringify(related)),
  };
}

export default async function ProductPage({ params }) {
  const data = await getProductWithRelated(params.slug);
  if (!data) notFound();
  const { product, related } = data;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No image
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">{product.category}</p>
          <h1 className="text-3xl font-bold text-maroon-950 mt-1">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-bold">${product.price?.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-gray-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-5 leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <p className="text-xs text-gray-400 mt-4">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-xl font-bold text-maroon-950 mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
