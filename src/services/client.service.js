import mongoose from "mongoose";
import { Projects } from "@/models/Projects";
import { Proposals } from "@/models/Proposals";
import {User} from "@/models/User";
import { Payment } from "@/models/Payment";


// =====================================================
// MARK PROJECT AS COMPLETED (Client only)
// =====================================================
export const markProjectCompletedService = async (projectId, clientId) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }

    const project = await Projects.findOne({
        _id: projectId,
        client: clientId, 
    });

    if (!project) {
        throw new Error("Project not found or you are not authorized to update it");
    }

    if (project.status !== "in progress") {
        throw new Error("Only projects that are 'in progress' can be marked as completed");
    }

    project.status = "completed";
    await Proposals.updateMany(
        { projectId },
        { status: "completed" }
    );
    await project.save();

    return project;
};
// =====================================================
// 1. GET CLIENT'S POSTED PROJECTS
// Client Dashboard → My Posted Projects
// =====================================================

export const getClientProjectsService = async (clientId) => {
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        throw new Error("Invalid client ID");
    }

    const projects = await Projects.aggregate([
        {
            $match: {
                client: new mongoose.Types.ObjectId(clientId),
            },
        },

        {
            $lookup: {
                from: "proposals",
                localField: "_id",
                foreignField: "projectId",
                as: "proposals",
            },
        },

        {
            $addFields: {
                proposalCount: {
                    $size: "$proposals",
                },
            },
        },

        {
            $project: {
                proposals: 0,
            },
        },

        {
            $sort: {
                createdAt: -1,
            },
        },
    ]);

    return projects;
};


// =====================================================
// 2. GET CLIENT DASHBOARD SUMMARY
// Dashboard Summary:
// - Total Projects
// - Active Projects
// - Proposals Received
// =====================================================

export const getClientDashboardSummaryService = async (clientId) => {
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        throw new Error("Invalid client ID");
    }

    const clientObjectId = new mongoose.Types.ObjectId(clientId);

    const totalProjects = await Projects.countDocuments({
        client: clientObjectId,
    });

    const activeProjects = await Projects.countDocuments({
        client: clientObjectId,
        status: {
            $in: ["open", "in progress"],
        },
    });

    const clientProjects = await Projects.find({
        client: clientObjectId,
    })
        .select("_id")
        .lean();

    const projectIds = clientProjects.map(
        (project) => project._id
    );

    const proposalsReceived = await Proposals.countDocuments({
        projectId: {
            $in: projectIds,
        },
    });

    return {
        totalProjects,
        activeProjects,
        proposalsReceived,
    };
};


// =====================================================
// 3. GET PROPOSALS FOR A SPECIFIC PROJECT
// Client → View Proposals
// =====================================================

export const getProjectProposalsForClientService = async (
    projectId,
    clientId
) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        throw new Error("Invalid client ID");
    }

    const project = await Projects.findOne({
        _id: projectId,
        client: clientId,
    }).lean();

    if (!project) {
        throw new Error(
            "Project not found or you are not authorized to access it"
        );
    }

    const proposals = await Proposals.find({
        projectId,
    })
        .populate(
            "freelancerId",
            "firstName lastName email phone avatar profileSummary skills"
        )
        .sort({
            createdAt: -1,
        })
        .lean();

    // in proposals me se jo paid ho chuki hain unke IDs nikalo
    const proposalIds = proposals.map((p) => p._id);

    const paidPayments = await Payment.find({
        proposal: { $in: proposalIds },
        status: "paid",
    })
        .select("proposal")
        .lean();

    const paidProposalIds = new Set(
        paidPayments.map((p) => p.proposal.toString())
    );

    // har proposal ke saath ek naya field "paymentStatus" attach karo
    const proposalsWithPaymentStatus = proposals.map((proposal) => ({
        ...proposal,
        paymentStatus: paidProposalIds.has(proposal._id.toString())
            ? "paid"
            : "unpaid",
    }));

    return proposalsWithPaymentStatus;
};

// =====================================================
// 4. GET SINGLE CLIENT PROJECT
// Client → Project Details
// =====================================================

export const getClientProjectByIdService = async (
    projectId,
    clientId
) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        throw new Error("Invalid client ID");
    }

    const project = await Projects.findOne({
        _id: projectId,
        client: clientId,
    })
        .populate(
            "client",
            "firstName lastName email phone avatar"
        )
        .lean();

    if (!project) {
        throw new Error(
            "Project not found or you are not authorized to access it"
        );
    }

    return project;
};

// NEW: Create Project
export const createProjectService = async (clientId, data) => {
    const { title, description, budget, category, skillsRequired, experienceLevel, deliveryTime } = data;

    if (!title || !description || !budget || !category) {
        throw new Error("Missing required project fields");
    }

    // 🔒 Ye naya check add kar
    if (Number(budget) < 1) {
        throw new Error("Budget must be at least Rs 1");
    }

    const project = await Projects.create({
        client: clientId,
        title,
        description,
        budget,
        category,
        skillsRequired: skillsRequired || [],
        experienceLevel: experienceLevel || "intermediate",
        deliveryTime: deliveryTime || "1 to 4 months",
        status: "open",
    });

    return project;
};

// NEW: Accept / Reject Proposal (with ownership check)
export const updateProposalStatusService = async (proposalId, clientId, status) => {
    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
        throw new Error("Invalid proposal ID");
    }
    if (!["accepted", "rejected"].includes(status)) {
        throw new Error("Invalid status value");
    }

    const proposal = await Proposals.findById(proposalId).populate("projectId");

    if (!proposal) {
        throw new Error("Proposal not found");
    }

    if (proposal.projectId.client.toString() !== clientId.toString()) {
        throw new Error("You are not authorized to update this proposal");
    }

    proposal.status = status;
    await proposal.save();

    if (status === "accepted") {
        await Projects.findByIdAndUpdate(proposal.projectId._id, { status: "in progress" });
    }

    return proposal;
};