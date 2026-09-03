import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import Link from "next/link";

function getAdminFromCookies() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === "admin" ? decoded : null;
  } catch {
    return null;
  }
}

export default function AdminLayout({ children }) {
  const admin = getAdminFromCookies();
  if (!admin) redirect("/login?next=/admin");

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-maroon-950 text-white shrink-0 p-6 space-y-4">
        <p className="font-bold tracking-widest mb-6">SOLEA ADMIN</p>
        <nav className="space-y-2 text-sm">
          <Link href="/admin" className="block hover:text-gold-500">
            Overview
          </Link>
          <Link href="/admin/products" className="block hover:text-gold-500">
            Products
          </Link>
          <Link href="/admin/orders" className="block hover:text-gold-500">
            Orders
          </Link>
          <Link href="/" className="block hover:text-gold-500 pt-6 text-gray-400">
            ← Back to store
          </Link>
        </nav>
      </aside>
      <div className="flex-1 bg-gray-50 p-8">{children}</div>
    </div>
  );
}
