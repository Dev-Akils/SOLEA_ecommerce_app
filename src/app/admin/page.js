import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();
  const [productCount, userCount, orderCount, revenueAgg, lowStock] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    Product.find({ stock: { $lte: 5 } }).select("name stock").limit(10).lean(),
  ]);

  return {
    productCount,
    userCount,
    orderCount,
    revenue: revenueAgg[0]?.total || 0,
    lowStock: JSON.parse(JSON.stringify(lowStock)),
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}` },
    { label: "Orders", value: stats.orderCount },
    { label: "Products", value: stats.productCount },
    { label: "Customers", value: stats.userCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon-950 mb-8">Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg p-5 shadow-sm">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold text-maroon-950 mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-maroon-950 mb-4">Low stock (≤ 5 units)</h2>
        {stats.lowStock.length === 0 ? (
          <p className="text-sm text-gray-500">Nothing low on stock right now.</p>
        ) : (
          <ul className="divide-y">
            {stats.lowStock.map((p) => (
              <li key={p._id} className="py-2 flex justify-between text-sm">
                <span>{p.name}</span>
                <span className="text-red-600 font-medium">{p.stock} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
