import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { getFreelancerEarningsService } from "@/services/freelancer.service";

export async function GET(request) {
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const earnings = await getFreelancerEarningsService(user.userId);
        return NextResponse.json({ success: true, data: earnings }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}