import mongoose,{Schema,models} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "freelancer","admin"],
      default: "freelancer",
      required: true,
    },

    // Optional fields (Jo profile edit ya onboarding mein fill honge)
    profileSummary: { type: String, default: "" },
    skills: [
      {
        type: String,
      },
    ],
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export const User = models.User || mongoose.model("User", userSchema);
