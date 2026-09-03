import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: null },
    images: [{ type: String }],

    // Filterable attributes
    category: { type: String, required: true, index: true }, // e.g. Running, Court, Everyday
    brand: { type: String, default: "Solea", index: true },
    colors: [{ type: String }],
    sizes: [{ type: Number }],
    gender: { type: String, enum: ["men", "women", "unisex"], default: "unisex", index: true },
    tags: [{ type: String, index: true }],

    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
