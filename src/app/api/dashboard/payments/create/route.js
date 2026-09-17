import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { safepay } from "@/lib/safepay";
import { authMiddleware } from "@/middleware/authmiddleware";
import { roleMiddleware } from "@/middleware/rolemiddleware";
import { Payment } from "@/models/Payment";
import { Proposals } from "@/models/Proposals";
import { Projects } from "@/models/Projects";

export async function POST(req) {
  await connectDB();

  const auth = authMiddleware(req);
  if (auth instanceof NextResponse) return auth; // token missing/invalid

  const roleCheck = roleMiddleware(auth, ["client"]);
  if (roleCheck) return roleCheck; // sirf client hi pay kar sakta hai

  const { proposalId } = await req.json();

  const proposal = await Proposals.findById(proposalId);
  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }
  if (proposal.status !== "completed") {
    return NextResponse.json({ error: "Proposal not accepted yet" }, { status: 400 });
  }

  const project = await Projects.findById(proposal.projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.client.toString() !== auth.userId) {
    return NextResponse.json({ error: "Not your project" }, { status: 403 });
  }

  const alreadyPaid = await Payment.findOne({ proposal: proposal._id, status: "paid" });
  if (alreadyPaid) {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  const payment = await Payment.create({
    proposal: proposal._id,
    project: project._id,
    client: project.client,
    freelancer: proposal.freelancerId,
    amount: proposal.bidAmount,
    freelancerAmount: proposal.youwillReceive,
    status: "pending",
  });

  const { token } = await safepay.payments.create({
    amount: proposal.bidAmount * 100,
    currency: "PKR",
  });

  payment.safepayToken = token;
  await payment.save();

  const checkoutUrl = safepay.checkout.create({
    token,
    orderId: payment._id.toString(),
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    source: "custom",
    webhooks: true,
  });

  return NextResponse.json({ paymentId: payment._id, checkoutUrl });
}