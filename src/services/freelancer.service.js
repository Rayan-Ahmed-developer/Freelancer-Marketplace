import mongoose from "mongoose";

import { Projects } from "@/models/Projects";
import { Proposals } from "@/models/Proposals";
import { User } from "@/models/User";
import { Payment } from "@/models/Payment";

const PLATFORM_FEE_PERCENT = 0.1; // 10% — frontend ke sath match karta hai

// =====================================================
// 1. GET OPEN PROJECTS
// =====================================================
export const getOpenProjectsService = async () => {
    const projects = await Projects.find({ status: "open" })
        .populate("client", "firstName lastName email avatar")
        .sort({ createdAt: -1 })
        .lean();

    return projects;
};

// =====================================================
// 2. GET MY PROPOSALS (ab client contact bhi nested populate hota hai)
// =====================================================
export const getMyProposalsService = async (freelancerId) => {
    if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
        throw new Error("Invalid freelancer ID");
    }

    const proposals = await Proposals.find({ freelancerId })
        .populate({
            path: "projectId",
            select: "title description budget category experienceLevel deliveryTime status client",
            populate: {
                path: "client",
                select: "firstName lastName email phone", // 👈 ab accepted hone par contact mil sakega
            },
        })
        .sort({ createdAt: -1 })
        .lean();

    return proposals;
};

// =====================================================
// 3. SUBMIT A NEW PROPOSAL (NEW)
// =====================================================
export const createProposalService = async (freelancerId, data) => {
    const { projectId, bidAmount, deliveryTime, coverLetter, attachments } = data;

    if (!projectId || !bidAmount || !deliveryTime || !coverLetter) {
        throw new Error("Missing required proposal fields");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }

    const bid = Number(bidAmount);
    if (!bid || bid < 1) {
        throw new Error("Bid amount must be at least Rs 1");
    }

    const project = await Projects.findById(projectId).lean();
    if (!project) {
        throw new Error("Project not found");
    }
    if (project.status !== "open") {
        throw new Error("This project is no longer open for proposals");
    }

    // 🔒 Fee hamesha server pe calculate hoti hai — frontend value pe trust nahi karte
    const platformFee = Math.round(bid * PLATFORM_FEE_PERCENT * 100) / 100;
    const youwillReceive = Math.round((bid - platformFee) * 100) / 100;

    try {
        const proposal = await Proposals.create({
            projectId,
            freelancerId,
            bidAmount: bid,
            platformFee,
            youwillReceive,
            deliveryTime,
            coverLetter,
            attachments: attachments || [],
            status: "pending",
        });

        return proposal;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error("Aap is project par pehle hi proposal bhej chuke hain");
        }
        throw error;
    }
};

// =====================================================
// 4. GET FREELANCER EARNINGS
// =====================================================


export const getFreelancerEarningsService = async (freelancerId) => {
    if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
        throw new Error("Invalid freelancer ID");
    }

    // jo proposals accepted hain — kaam mil chuka hai
    const acceptedProposals = await Proposals.find({ freelancerId, status: "accepted" })
        .populate("projectId", "title description budget client")
        .sort({ updatedAt: -1 })
        .lean();

    // inme se jo actually paid ho chuki hain
    const paidPayments = await Payment.find({ freelancer: freelancerId, status: "paid" })
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .lean();

    const totalEarnings = paidPayments.reduce(
        (total, payment) => total + (payment.freelancerAmount || 0),
        0
    );

    const paidProposalIds = new Set(paidPayments.map((p) => p.proposal.toString()));

    // accepted hai lekin client ne abhi payment nahi ki
    const pendingPayments = acceptedProposals.filter(
        (proposal) => !paidProposalIds.has(proposal._id.toString())
    );

    return {
        totalEarnings,                          // sirf paid amount
        totalAcceptedProjects: acceptedProposals.length,
        totalPaidProjects: paidPayments.length,
        earnings: paidPayments,                 // paid records (amount + withdrawn status)
        pendingPayments,                        // accepted, payment ka wait hai
    };
};

// =====================================================
// 5. GET FREELANCER PROFILE
// =====================================================
export const getFreelancerProfileService = async (freelancerId) => {
    if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
        throw new Error("Invalid freelancer ID");
    }

    const freelancer = await User.findById(freelancerId)
        .select("firstName lastName email phone role profileSummary skills avatar createdAt")
        .lean();

    if (!freelancer) {
        throw new Error("Freelancer not found");
    }

    return freelancer;
};

// =====================================================
// 6. UPDATE FREELANCER PROFILE (NEW)
// =====================================================
export const updateFreelancerProfileService = async (freelancerId, data) => {
    const { profileSummary, skills } = data;

    const updateFields = {};
    if (profileSummary !== undefined) updateFields.profileSummary = profileSummary;
    if (skills !== undefined) {
        updateFields.skills = Array.isArray(skills)
            ? skills
            : skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const updated = await User.findByIdAndUpdate(freelancerId, updateFields, {
        new: true,
    })
        .select("firstName lastName email phone role profileSummary skills avatar")
        .lean();

    if (!updated) {
        throw new Error("Freelancer not found");
    }

    return updated;
};

// =====================================================
// 7. WITHDRAW A PAYMENT
// =====================================================
export const withdrawPaymentService = async (freelancerId, paymentId) => {
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
        throw new Error("Invalid payment ID");
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
        throw new Error("Payment not found");
    }
    if (payment.freelancer.toString() !== freelancerId) {
        throw new Error("This payment does not belong to you");
    }
    if (payment.status !== "paid") {
        throw new Error("Payment not completed yet");
    }
    if (payment.withdrawn) {
        throw new Error("Already withdrawn");
    }

    payment.withdrawn = true;
    await payment.save();

    return payment;
};