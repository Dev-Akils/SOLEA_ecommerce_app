import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Name, email and password are required" }, { status: 400 });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email: email.toLowerCase(), password: hashed });

  const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

  const res = NextResponse.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
