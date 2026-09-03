import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-white overflow-hidden rounded-lg">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
        {product.compareAtPrice && (
          <span className="absolute top-2 left-2 bg-gold-500 text-maroon-950 text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">{product.category}</p>
        <h3 className="font-semibold text-maroon-950">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold">${product.price?.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
