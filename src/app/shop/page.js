import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getProducts(searchParams) {
  await connectDB();

  const filter = { isActive: true };
  if (searchParams.category) filter.category = searchParams.category;
  if (searchParams.gender) filter.gender = searchParams.gender;
  if (searchParams.color) filter.colors = searchParams.color;
  if (searchParams.size) filter.sizes = Number(searchParams.size);
  if (searchParams.search) filter.$text = { $search: searchParams.search };
  if (searchParams.minPrice || searchParams.maxPrice) {
    filter.price = {};
    if (searchParams.minPrice) filter.price.$gte = Number(searchParams.minPrice);
    if (searchParams.maxPrice) filter.price.$lte = Number(searchParams.maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (searchParams.sort === "price_asc") sortOption = { price: 1 };
  if (searchParams.sort === "price_desc") sortOption = { price: -1 };
  if (searchParams.sort === "rating") sortOption = { rating: -1 };

  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 12;

  const [items, total, facetResult] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
    Product.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          categories: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
          colors: [{ $unwind: "$colors" }, { $group: { _id: "$colors", count: { $sum: 1 } } }],
          sizes: [{ $unwind: "$sizes" }, { $group: { _id: "$sizes", count: { $sum: 1 } } }],
        },
      },
    ]),
  ]);

  return {
    items: JSON.parse(JSON.stringify(items)),
    total,
    pages: Math.ceil(total / limit),
    page,
    facets: facetResult[0],
  };
}

export default async function ShopPage({ searchParams }) {
  const { items, total, pages, page, facets } = await getProducts(searchParams);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-maroon-950">
          Shop all {searchParams.category ? `— ${searchParams.category}` : ""}
        </h1>
        <p className="text-sm text-gray-500">{total} products</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <Filters facets={facets} />

        <div className="flex-1">
          {items.length === 0 ? (
            <p className="text-gray-500">No products match these filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex gap-2 justify-center mt-10">
              {Array.from({ length: pages }).map((_, i) => {
                const params = new URLSearchParams(searchParams);
                params.set("page", String(i + 1));
                return (
                  <Link
                    key={i}
                    href={`/shop?${params.toString()}`}
                    className={`w-9 h-9 flex items-center justify-center rounded border ${
                      page === i + 1 ? "bg-maroon-950 text-white" : "border-gray-300"
                    }`}
                  >
                    {i + 1}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
