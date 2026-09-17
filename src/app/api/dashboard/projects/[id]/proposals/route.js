import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { getProjectProposalsForClientService } from "@/services/client.service";


export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const proposals = await getProjectProposalsForClientService(id, user.userId);
        return NextResponse.json({ success: true, proposals }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}