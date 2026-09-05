/**
 * Seed script — populates sample products and an admin user.
 * Run with: npm run seed
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/solea";

const MONGODB_URI = process.env.MONGODB_URI

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    compareAtPrice: Number,
    images: [String],
    category: String,
    brand: String,
    colors: [String],
    sizes: [Number],
    gender: String,
    tags: [String],
    stock: Number,
    rating: Number,
    numReviews: Number,
    isFeatured: Boolean,
    isActive: Boolean,
  },
  { timestamps: true }
);
ProductSchema.index({ name: "text", description: "text", tags: "text" });

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const products = [
  {
    name: "Aero 01",
    slug: "aero-01",
    description:
      "A responsive daily runner with a split outsole, a featherlight ride, and one impossible-to-miss streak.",
    price: 129.99,
    compareAtPrice: 149.99,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
    category: "Running",
    brand: "Solea",
    colors: ["black", "grey"],
    sizes: [7, 8, 9, 10, 11],
    gender: "unisex",
    tags: ["daily-trainer", "lightweight", "bestseller"],
    stock: 40,
    rating: 4.6,
    numReviews: 128,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Sol Court",
    slug: "sol-court",
    description: "Classic court silhouette with reinforced side panels for lateral cuts.",
    price: 109.99,
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"],
    category: "Court",
    brand: "Solea",
    colors: ["gold", "white"],
    sizes: [6, 7, 8, 9, 10],
    gender: "men",
    tags: ["court", "bestseller"],
    stock: 25,
    rating: 4.3,
    numReviews: 64,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Dune Pace",
    slug: "dune-pace",
    description: "Everyday knit sneaker built for warm-weather comfort and all-day wear.",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800"],
    category: "Everyday",
    brand: "Solea",
    colors: ["sand", "white"],
    sizes: [6, 7, 8, 9],
    gender: "women",
    tags: ["knit", "casual"],
    stock: 30,
    rating: 4.1,
    numReviews: 40,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Coast Relay",
    slug: "coast-relay",
    description: "Trail-ready everyday shoe with a rugged outsole for mixed terrain.",
    price: 119.99,
    images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800"],
    category: "Everyday",
    brand: "Solea",
    colors: ["brown", "black"],
    sizes: [8, 9, 10, 11, 12],
    gender: "men",
    tags: ["trail", "durable"],
    stock: 5,
    rating: 4.5,
    numReviews: 22,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Aero 01 Low",
    slug: "aero-01-low",
    description: "The low-top version of the Aero 01, tuned for shorter, faster efforts.",
    price: 119.99,
    images: ["https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800"],
    category: "Running",
    brand: "Solea",
    colors: ["black", "red"],
    sizes: [7, 8, 9, 10],
    gender: "unisex",
    tags: ["daily-trainer", "lightweight"],
    stock: 18,
    rating: 4.4,
    numReviews: 31,
    isFeatured: false,
    isActive: true,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to", MONGODB_URI);

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Inserted ${products.length} products`);

  const adminEmail = "admin@solea.test";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash("Admin123!", 10);
    await User.create({ name: "Solea Admin", email: adminEmail, password: hashed, role: "admin" });
    console.log(`Created admin user -> email: ${adminEmail} / password: Admin123!`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
