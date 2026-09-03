"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { useRouter } from "next/navigation";

export default function AddToCart({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState(product.sizes?.[0] || null);
  const [color, setColor] = useState(product.colors?.[0] || null);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, { size, color, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="space-y-5">
      {product.colors?.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2">Color</p>
          <div className="flex gap-2 flex-wrap">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-3 py-1 rounded-full border capitalize text-sm ${
                  color === c ? "bg-maroon-950 text-white border-maroon-950" : "border-gray-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes?.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2">Size</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-10 h-10 rounded border text-sm ${
                  size === s ? "bg-maroon-950 text-white border-maroon-950" : "border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAdd}
          className="flex-1 bg-maroon-950 text-white py-3 rounded font-semibold hover:bg-maroon-900"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button
          onClick={() => {
            addItem(product, { size, color, quantity: 1 });
            router.push("/cart");
          }}
          className="flex-1 border border-maroon-950 text-maroon-950 py-3 rounded font-semibold"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
