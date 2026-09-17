import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { updateProposalStatusService } from "@/services/client.service";

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { status } = await request.json();
        const proposal = await updateProposalStatusService(id, user.userId, status);
        return NextResponse.json({ success: true, proposal }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}