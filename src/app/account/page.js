import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Link from "next/link";
import AccountForm from "@/components/AccountForm";

export const dynamic = "force-dynamic";

async function getAccountData() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }

  await connectDB();
  const [user, orders] = await Promise.all([
    User.findById(decoded.id).select("-password").lean(),
    Order.find({ user: decoded.id }).sort({ createdAt: -1 }).limit(3).lean(),
  ]);

  if (!user) return null;

  return {
    user: JSON.parse(JSON.stringify(user)),
    orders: JSON.parse(JSON.stringify(orders)),
  };
}

export default async function AccountPage() {
  const data = await getAccountData();
  if (!data) redirect("/login?next=/account");

  const { user, orders } = data;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-maroon-950 mb-8">My Account</h1>

      <AccountForm user={user} />

      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-maroon-950">Recent Orders</h2>
          <Link href="/order" className="text-sm underline text-maroon-950">
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500">
            You haven't placed any orders yet.{" "}
            <Link href="/shop" className="text-maroon-950 underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs text-gray-500">#{order._id}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-maroon-950">${order.totalPrice.toFixed(2)}</p>
                    <span className="text-xs capitalize text-gray-500">{order.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}