import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// GET /api/products?category=Running&brand=Solea&color=Black&size=9&minPrice=50&maxPrice=200&gender=men&search=aero&sort=price_asc&page=1&limit=12
export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const filter = { isActive: true };

  const category = searchParams.get("category");
  if (category) filter.category = category;

  const brand = searchParams.get("brand");
  if (brand) filter.brand = brand;

  const gender = searchParams.get("gender");
  if (gender) filter.gender = gender;

  const color = searchParams.get("color");
  if (color) filter.colors = color;

  const size = searchParams.get("size");
  if (size) filter.sizes = Number(size);

  const tag = searchParams.get("tag");
  if (tag) filter.tags = tag;

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const search = searchParams.get("search");
  if (search) filter.$text = { $search: search };

  const featured = searchParams.get("featured");
  if (featured === "true") filter.isFeatured = true;

  let sortOption = { createdAt: -1 };
  switch (searchParams.get("sort")) {
    case "price_asc":
      sortOption = { price: 1 };
      break;
    case "price_desc":
      sortOption = { price: -1 };
      break;
    case "rating":
      sortOption = { rating: -1 };
      break;
    case "newest":
      sortOption = { createdAt: -1 };
      break;
  }

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(60, Number(searchParams.get("limit")) || 12);
  const skip = (page - 1) * limit;

  const [items, total, facets] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
    // Facets computed against category/gender only (not the full filter) so the UI can show all options
    Product.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          categories: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
          colors: [{ $unwind: "$colors" }, { $group: { _id: "$colors", count: { $sum: 1 } } }],
          sizes: [{ $unwind: "$sizes" }, { $group: { _id: "$sizes", count: { $sum: 1 } } }],
          priceRange: [
            {
              $group: {
                _id: null,
                min: { $min: "$price" },
                max: { $max: "$price" },
              },
            },
          ],
        },
      },
    ]),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
    facets: facets[0],
  });
}

// POST /api/products (admin only — also exposed at /api/admin/products, kept here for convenience)
export async function POST(req) {
  const { requireAdmin } = await import("@/lib/auth");
  const auth = requireAdmin(req);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}
