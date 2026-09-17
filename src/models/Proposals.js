import mongoose, { models } from "mongoose";

const proposalSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Projects",
            required: [true, "Project ID is required"],
        },

        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Freelancer ID is required"],
        },

        bidAmount: {
            type: Number,
            required: [true, "Bid amount is required"],
            min: [1, "Bid amount must be greater than 0"],
        },

        platformFee: {
            type: Number,
            required: [true, "Platform fee is required"],
            min: [0, "Platform fee cannot be negative"],
        },

        youwillReceive: {
            type: Number,
            required: [true, "You will receive amount is required"],
            min: [0, "Receiving amount cannot be negative"],
        },

        deliveryTime: {
            type: String,
            required: [true, "Delivery time is required"],
            trim: true,
        },

        coverLetter: {
            type: String,
            required: [true, "Cover letter is required"],
            trim: true,
            minlength: [20, "Cover letter is too short"],
            maxlength: [2000, "Cover letter is too long"],
        },

        attachments: [
            {
                type: String,
            },
        ],

        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "withdrawn","completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

proposalSchema.index(
    { projectId: 1, freelancerId: 1 },
    { unique: true }
);

export const Proposals = models.Proposals || mongoose.model("Proposals", proposalSchema);