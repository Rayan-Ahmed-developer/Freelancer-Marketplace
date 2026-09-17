import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { connectDB } from "@/lib/mongodb";
import { getMyProposalsService, createProposalService } from "@/services/freelancer.service";

export async function GET(request) {
    await connectDB();
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const proposals = await getMyProposalsService(user.userId);
        return NextResponse.json({ success: true, data: proposals }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await connectDB();
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const proposal = await createProposalService(user.userId, body);
        return NextResponse.json({ success: true, proposal }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}