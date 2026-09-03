"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Filters({ facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "" || params.get(key) === String(value)) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const activeColor = searchParams.get("color");
  const activeSize = searchParams.get("size");
  const activeGender = searchParams.get("gender");
  const activeSort = searchParams.get("sort") || "";

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-8 text-sm">
      <div>
        <h4 className="font-semibold mb-3 text-maroon-950">Category</h4>
        <div className="space-y-2">
          {(facets?.categories || []).map((c) => (
            <button
              key={c._id}
              onClick={() => updateParam("category", c._id)}
              className={`block w-full text-left px-2 py-1 rounded ${
                activeCategory === c._id ? "bg-maroon-950 text-white" : "hover:bg-gray-100"
              }`}
            >
              {c._id} ({c.count})
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-maroon-950">Gender</h4>
        <div className="flex gap-2 flex-wrap">
          {["men", "women", "unisex"].map((g) => (
            <button
              key={g}
              onClick={() => updateParam("gender", g)}
              className={`px-3 py-1 rounded-full border capitalize ${
                activeGender === g ? "bg-maroon-950 text-white border-maroon-950" : "border-gray-300"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-maroon-950">Color</h4>
        <div className="flex flex-wrap gap-2">
          {(facets?.colors || []).map((c) => (
            <button
              key={c._id}
              onClick={() => updateParam("color", c._id)}
              className={`px-3 py-1 rounded-full border capitalize ${
                activeColor === c._id ? "bg-maroon-950 text-white border-maroon-950" : "border-gray-300"
              }`}
            >
              {c._id}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-maroon-950">Size</h4>
        <div className="flex flex-wrap gap-2">
          {(facets?.sizes || [])
            .sort((a, b) => a._id - b._id)
            .map((s) => (
              <button
                key={s._id}
                onClick={() => updateParam("size", s._id)}
                className={`w-9 h-9 rounded border ${
                  activeSize === String(s._id)
                    ? "bg-maroon-950 text-white border-maroon-950"
                    : "border-gray-300"
                }`}
              >
                {s._id}
              </button>
            ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-maroon-950">Sort by</h4>
        <select
          value={activeSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-2"
        >
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <button
        onClick={() => router.push(pathname)}
        className="text-maroon-950 underline underline-offset-2"
      >
        Clear all filters
      </button>
    </aside>
  );
}
