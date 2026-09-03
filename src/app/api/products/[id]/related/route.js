import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

// GET /api/products/:id/related
// Strategy: same category or overlapping tags, excluding the product itself,
// ranked by number of shared tags then rating.
export async function GET(req, { params }) {
  await connectDB();

  const base = mongoose.Types.ObjectId.isValid(params.id)
    ? await Product.findById(params.id)
    : await Product.findOne({ slug: params.id });

  if (!base) return NextResponse.json({ message: "Product not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(12, Number(searchParams.get("limit")) || 4);

  const related = await Product.aggregate([
    {
      $match: {
        _id: { $ne: base._id },
        isActive: true,
        $or: [{ category: base.category }, { tags: { $in: base.tags || [] } }],
      },
    },
    {
      $addFields: {
        sharedTags: {
          $size: { $ifNull: [{ $setIntersection: ["$tags", base.tags || []] }, []] },
        },
        sameCategory: { $cond: [{ $eq: ["$category", base.category] }, 1, 0] },
      },
    },
    { $sort: { sameCategory: -1, sharedTags: -1, rating: -1 } },
    { $limit: limit },
  ]);

  return NextResponse.json(related);
}
