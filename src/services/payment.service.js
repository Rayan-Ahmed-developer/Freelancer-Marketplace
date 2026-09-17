import { Payment } from "@/models/Payment";
import { Projects } from "@/models/Projects";
import { Proposals } from "@/models/Proposals";


// Create Client Payment
export const createClientPayment = async (
  userId,
  projectId,
  amount
) => {
  const project = await Projects.findOne({
    _id: projectId,
    userId,
  });   

  if (!project) {
    throw new Error("Project not found or unauthorized");
  }

  const payment = await Payment.create({
    userId,
    projectId,
    paymentType: "client",
    amount,
    currency: "PKR",
    paymentStatus: "pending",
    paymentMethod: "card",
  });

  return payment;
};


// Update Payment Status
export const updatePaymentStatus = async (
  paymentId,
  status,
  transactionId
) => {
  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.paymentStatus = status;

  if (transactionId) {
    payment.transactionId = transactionId;
  }

  if (status === "completed") {
    payment.paidAt = new Date();
  }

  await payment.save();

  return payment;
};