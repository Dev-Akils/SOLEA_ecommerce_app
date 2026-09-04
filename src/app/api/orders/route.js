import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth";

// GET /api/orders — current user's order history
export async function GET(req) {
  const auth = requireAuth(req);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  await connectDB();
  const orders = await Order.find({ user: auth.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}



// POST /api/orders — create an order from the cart the client sends
export async function POST(req) {
  const auth = requireAuth(req);
  if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

  await connectDB();
  const { items, shippingAddress } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  // Re-price server-side from the DB rather than trusting client prices
  let itemsPrice = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;
    const lineTotal = product.price * item.quantity;
    itemsPrice += lineTotal;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    });
  }

  const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: auth.user.id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  return NextResponse.json(order, { status: 201 });
}
