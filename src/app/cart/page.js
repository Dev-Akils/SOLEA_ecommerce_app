"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-maroon-950 mb-4">Your cart is empty</h1>
        <Link href="/shop" className="text-maroon-950 underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-maroon-950 mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className="flex gap-4 border-b border-gray-200 pb-6"
          >
            <div className="relative w-24 h-24 bg-white rounded overflow-hidden shrink-0">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.slug}`} className="font-semibold text-maroon-950">
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">
                {item.color} · Size {item.size}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, item.size, item.color, Number(e.target.value))
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1"
                />
                <button
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  className="text-sm text-red-600 underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <div className="w-full md:w-80 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{subtotal > 100 ? "Free" : "$9.99"}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total</span>
            <span>${(subtotal + (subtotal > 100 ? 0 : 9.99)).toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block text-center bg-maroon-950 text-white py-3 rounded font-semibold mt-4"
          >
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
