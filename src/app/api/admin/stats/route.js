import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req) {
  const auth = requireAdmin(req);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  await connectDB();

  const [productCount, userCount, orders, revenueAgg, lowStock] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    Product.find({ stock: { $lte: 5 } }).select("name stock").limit(10),
  ]);

  return NextResponse.json({
    productCount,
    userCount,
    orderCount: orders,
    revenue: revenueAgg[0]?.total || 0,
    lowStock,
  });
}
