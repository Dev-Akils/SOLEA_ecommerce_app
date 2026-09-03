import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return NextResponse.json({ user: null });

  await connectDB();
  const user = await User.findById(decoded.id).select("-password");
  return NextResponse.json({ user });
}

export async function DELETE() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  return res;
}
