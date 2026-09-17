import { Proposals } from "@/models/Proposals";
import {connectDB} from "@/lib/mongodb";

export const createProposal = async (proposalData) => {
    await connectDB();

    const existingProposal = await Proposals.findOne({
        projectId: proposalData.projectId,
        freelancerId: proposalData.freelancerId,
    });

    if (existingProposal) {
        throw new Error(
            "Proposal already exists for this project by the freelancer"
        );
    }

    return await Proposals.create(proposalData);
};

export const getProposalsByProjectId = async (projectId) => {
    await connectDB();

    return await Proposals.find({ projectId })
        .populate(
            "freelancerId",
            "firstName lastName email phone"
        )
        .sort({ createdAt: -1 });
};

export const getProposalsByFreelancerId = async (freelancerId) => {
    await connectDB();

    return await Proposals.find({ freelancerId })
        .populate(
            "projectId",
            "title description budget"
        )
        .sort({ createdAt: -1 });
};

export const updateProposalStatusService = async (
    proposalId,
    status
) => {
    await connectDB();

    const updatedProposal = await Proposals.findByIdAndUpdate(
        proposalId,
        { status },
        {
            new: true,
            runValidators: true,
        }
    )
        .populate(
            "freelancerId",
            "firstName lastName email phone avatar"
        )
        .populate({
            path: "projectId",
            populate: {
                path: "client",
                select: "firstName lastName email phone",
            },
        });

    if (!updatedProposal) {
        throw new Error("Proposal not found");
    }

    return updatedProposal;
};