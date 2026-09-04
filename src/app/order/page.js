// src/app/orders/page.js
import MyOrdersClient from "@/components/MyOrdersClient";

export default function OrdersPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <MyOrdersClient />
    </main>
  );
}