import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authMiddleware } from "@/middleware/authmiddleware";
import { Payment } from "@/models/Payment";

export async function GET(req, { params }) {
  await connectDB();

  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  const payment = await Payment.findById(id);
  if (!payment) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Agar payment pending hai aur DB mein safepayToken mojood hai
  if (payment.status === "pending" && payment.safepayToken) {
    try {
      const isProd = process.env.SAFEPAY_ENV === "production";
      const baseUrl = isProd 
        ? "https://api.getsafepay.com" 
        : "sandbox.api.getsafepay.com"; // Ensuring proper sandbox URL string

      const apiKey = process.env.SAFEPAY_API_KEY;

      const response = await fetch(`https://${isProd ? "api" : "sandbox.api"}.getsafepay.com/order/v1/${payment.safepayToken}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
      });

      const result = await response.json();
      const state = result.data?.state;
      
      // TRACKER_ENDED ya transaction hone par payment paid ho jayegi
      if (response.ok && (state === "TRACKER_ENDED" || state === "TRACKER_COMPLETED" || result.data?.transaction)) {
        payment.status = "paid";
        await payment.save();
        console.log("Database successfully updated to PAID!");
      }
    } catch (err) {
      console.log("Safepay Verification error:", err);
    }
  }

  return NextResponse.json({ status: payment.status });
}