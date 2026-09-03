"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const emptyProduct = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAtPrice: "",
  images: "",
  category: "Running",
  brand: "Solea",
  colors: "",
  sizes: "",
  gender: "unisex",
  tags: "",
  stock: 0,
  isFeatured: false,
  isActive: true,
};

function toFormState(product) {
  if (!product) return emptyProduct;
  return {
    ...emptyProduct,
    ...product,
    images: (product.images || []).join(", "),
    colors: (product.colors || []).join(", "),
    sizes: (product.sizes || []).join(", "),
    tags: (product.tags || []).join(", "),
    compareAtPrice: product.compareAtPrice ?? "",
  };
}

function toPayload(form) {
  return {
    name: form.name,
    slug: form.slug || undefined,
    description: form.description,
    price: Number(form.price),
    compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
    images: form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    category: form.category,
    brand: form.brand,
    colors: form.colors
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    sizes: form.sizes
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n)),
    gender: form.gender,
    tags: form.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    stock: Number(form.stock) || 0,
    isFeatured: !!form.isFeatured,
    isActive: !!form.isActive,
  };
}

export default function ProductForm({ product, productId }) {
  const router = useRouter();
  const [form, setForm] = useState(toFormState(product));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
    const method = productId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(form)),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Something went wrong");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          placeholder="Slug (auto-generated if blank)"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        rows={3}
      />

      <div className="grid grid-cols-3 gap-4">
        <input
          required
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Compare-at price"
          value={form.compareAtPrice}
          onChange={(e) => set("compareAtPrice", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => set("stock", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <input
        placeholder="Image URLs, comma separated"
        value={form.images}
        onChange={(e) => set("images", e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />

      <div className="grid grid-cols-2 gap-4">
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option>Running</option>
          <option>Court</option>
          <option>Everyday</option>
        </select>
        <select
          value={form.gender}
          onChange={(e) => set("gender", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="unisex">Unisex</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Colors, comma separated (e.g. black, white)"
          value={form.colors}
          onChange={(e) => set("colors", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          placeholder="Sizes, comma separated (e.g. 7, 8, 9)"
          value={form.sizes}
          onChange={(e) => set("sizes", e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <input
        placeholder="Tags, comma separated"
        value={form.tags}
        onChange={(e) => set("tags", e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />

      <div className="flex gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => set("isFeatured", e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
          />
          Active / visible in store
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        disabled={loading}
        className="bg-maroon-950 text-white px-5 py-2.5 rounded font-semibold disabled:opacity-60"
      >
        {loading ? "Saving..." : productId ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
