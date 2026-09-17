import mongoose, { models } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    proposal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposals",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
        type: Number, required: true
    },           // client ne kitna paya (bidAmount)
    freelancerAmount:{
        type: Number, required: true
    },  // freelancer ka hissa (youwillReceive)
    safepayToken: {
        type: String 
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    withdrawn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Payment = models.Payment || mongoose.model("Payment", paymentSchema);