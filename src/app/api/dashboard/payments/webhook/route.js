// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { safepay } from "@/lib/safepay";
// import { Payment } from "@/models/Payment";

// export async function POST(req) {
//   await connectDB();

//   const signatureOk = safepay.verify.signature(req);
//   if (!signatureOk) {
//     return NextResponse.json({ error: "bad signature" }, { status: 400 });
//   }

//   const confirmed = await safepay.verify.webhook(req);
//   const body = await req.json();
//   const paymentId = body.order_id;

//   await Payment.findByIdAndUpdate(paymentId, {
//     status: confirmed ? "paid" : "failed",
//   });

//   return NextResponse.json({ received: true });
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { safepay } from "@/lib/safepay";
import { Payment } from "@/models/Payment";

export async function POST(req) {
  await connectDB();

  try {
    // 1. Raw text read karein taake stream lock na ho
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // 2. Signature verification
    const signatureOk = safepay.verify.signature(req);
    if (!signatureOk) {
      return NextResponse.json({ error: "bad signature" }, { status: 400 });
    }

    // 3. Safepay ke payload se orderId nikalen (structure ke mutabiq)
    const paymentId = body.order_id || body.data?.metadata?.orderId;

    if (!paymentId) {
      return NextResponse.json({ error: "Order ID missing in webhook" }, { status: 400 });
    }

    // 4. Status check karein ke payment successful hai ya nahi
    // (Safepay ke event types ke mutabiq check)
    const isCompleted = 
      body.event === "order:complete" || 
      body.type === "payment:completed" || 
      body.data?.state === "completed";

    // 5. Database mein status update karein
    await Payment.findByIdAndUpdate(paymentId, {
      status: isCompleted ? "paid" : "failed",
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}