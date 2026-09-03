"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function placeOrder(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
        })),
        shippingAddress: address,
      }),
    });

    setLoading(false);

    if (res.status === 401) {
      router.push("/login?next=/checkout");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Something went wrong");
      return;
    }

    const order = await res.json();
    clearCart();
    router.push(`/orders/${order._id}`);
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-maroon-950 mb-8">Checkout</h1>

      <form onSubmit={placeOrder} className="space-y-4">
        <input
          required
          placeholder="Address line 1"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          placeholder="Address line 2 (optional)"
          value={address.line2}
          onChange={(e) => setAddress({ ...address, line2: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            required
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            required
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            required
            placeholder="Postal code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            required
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-between font-bold text-lg border-t pt-4">
          <span>Total</span>
          <span>${(subtotal + (subtotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
        </div>

        <button
          disabled={loading}
          className="w-full bg-maroon-950 text-white py-3 rounded font-semibold disabled:opacity-60"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </main>
  );
}
