import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getOrder(id) {
  await connectDB();
  const token = cookies().get("token")?.value;
  if (!token) return null;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }

  const order = await Order.findOne({ _id: id, user: decoded.id }).lean();
  if (!order) return null;
  return JSON.parse(JSON.stringify(order));
}

export default async function OrderDetailPage({ params }) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-maroon-950 mb-2">Order confirmed 🎉</h1>
      <p className="text-gray-500 mb-8">Order #{order._id}</p>

      <div className="space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between border-b pb-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.color} · Size {item.size} · Qty {item.quantity}
              </p>
            </div>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-1 text-right">
        <p className="text-gray-600">Shipping: ${order.shippingPrice.toFixed(2)}</p>
        <p className="font-bold text-lg">Total: ${order.totalPrice.toFixed(2)}</p>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Status: <span className="capitalize font-medium">{order.status}</span>
      </p>
    </main>
  );
}
