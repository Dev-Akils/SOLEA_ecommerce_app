import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

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
