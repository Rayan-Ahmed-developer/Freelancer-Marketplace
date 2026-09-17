import { NextResponse } from "next/server";

import { authMiddleware } from "@/middleware/authmiddleware";
import { roleMiddleware } from "@/middleware/rolemiddleware";

import {
  createProposal,
  getProposalsByProjectId,
  getProposalsByFreelancerId,
} from "@/services/proposals.service";

export async function POST(request) {
  try {
    // =========================
    // AUTHENTICATION
    // =========================
    const user = authMiddleware(request);

    if (user instanceof NextResponse) {
      return user;
    }

    // =========================
    // FREELANCER ONLY
    // =========================
    const roleError = roleMiddleware(user, ["freelancer"]);

    if (roleError) {
      return roleError;
    }

    // =========================
    // USER ID CHECK
    // =========================
    if (!user.userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User ID not found in authentication token",
        },
        { status: 401 }
      );
    }

    // =========================
    // GET REQUEST BODY
    // =========================
    const proposalData = await request.json();

    // =========================
    // REQUIRED PROJECT ID
    // =========================
    if (!proposalData.projectId) {
      return NextResponse.json(
        {
          success: false,
          message: "Project ID is required",
        },
        { status: 400 }
      );
    }

    // =========================
    // CREATE PROPOSAL
    // freelancerId comes from JWT
    // NOT from frontend
    // =========================
    const newProposal = await createProposal({
      ...proposalData,
      freelancerId: user.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Proposal submitted successfully",
        data: newProposal,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Proposal Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}

// =========================
// GET PROPOSALS
// =========================

export async function GET(request) {
  try {
    const user = authMiddleware(request);

    if (user instanceof NextResponse) {
      return user;
    }

    const { searchParams } = new URL(request.url);

    const projectId = searchParams.get("projectId");
    const freelancerId = searchParams.get("freelancerId");

    if (projectId) {
      const proposals =
        await getProposalsByProjectId(projectId);

      return NextResponse.json(
        {
          success: true,
          data: proposals,
        },
        { status: 200 }
      );
    }

    if (freelancerId) {
      const proposals =
        await getProposalsByFreelancerId(freelancerId);

      return NextResponse.json(
        {
          success: true,
          data: proposals,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Provide either projectId or freelancerId",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get Proposals Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}