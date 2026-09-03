import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-maroon-950 mb-8">Edit Product</h1>
      <ProductForm product={JSON.parse(JSON.stringify(product))} productId={params.id} />
    </div>
  );
}
