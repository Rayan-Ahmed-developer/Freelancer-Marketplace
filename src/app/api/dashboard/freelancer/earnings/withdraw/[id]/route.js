import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authMiddleware } from "@/middleware/authmiddleware";
import { roleMiddleware } from "@/middleware/rolemiddleware";
import { Payment } from "@/models/Payment";

export async function POST(req, { params }) {
  await connectDB();

  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const roleCheck = roleMiddleware(auth, ["freelancer"]);
  if (roleCheck) return roleCheck;

  const { id } = await params;

  const payment = await Payment.findById(id);
  if (!payment) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (payment.freelancer.toString() !== auth.userId) {
    return NextResponse.json({ error: "Not your payment" }, { status: 403 });
  }
  if (payment.status !== "paid") {
    return NextResponse.json({ error: "Not paid yet" }, { status: 400 });
  }

  payment.withdrawn = true;
  await payment.save();

  return NextResponse.json({ success: true });
}