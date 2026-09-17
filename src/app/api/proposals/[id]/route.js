import { updateProposalStatusService } from "@/services/proposals.service";

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const { status } = await request.json();

        const allowedStatuses = [
            "pending",
            "accepted",
            "rejected",
            "withdrawn",
        ];

        if (!allowedStatuses.includes(status)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid status value",
                },
                { status: 400 }
            );
        }

        const updatedProposal = await updateProposalStatusService(
            id,
            status
        );

        return Response.json(
            {
                success: true,
                message: `Proposal has been ${status} successfully`,
                data: updatedProposal,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}