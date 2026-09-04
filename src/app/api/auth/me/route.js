// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { getUserFromRequest } from "@/lib/auth";

// export async function GET(req) {
//   const decoded = getUserFromRequest(req);
//   if (!decoded) return NextResponse.json({ user: null });

//   await connectDB();
//   const user = await User.findById(decoded.id).select("-password");
//   return NextResponse.json({ user });
// }

// export async function DELETE() {
//   const res = NextResponse.json({ message: "Logged out" });
//   res.cookies.set("token", "", { path: "/", maxAge: 0 });
//   return res;
// }


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

// PATCH /api/auth/me — update the logged-in user's own name/avatar
export async function PATCH(req) {
  const decoded = getUserFromRequest(req);
  if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { name, avatar } = await req.json();
  const update = {};
  if (name) update.name = name;
  if (avatar) update.avatar = avatar;

  await connectDB();
  const user = await User.findByIdAndUpdate(decoded.id, update, { new: true }).select("-password");
  return NextResponse.json({ user });
}

export async function DELETE() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  return res;
}