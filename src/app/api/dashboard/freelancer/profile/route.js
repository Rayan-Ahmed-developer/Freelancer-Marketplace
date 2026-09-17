import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/getAuthUser";
import { getFreelancerProfileService, updateFreelancerProfileService } from "@/services/freelancer.service";

export async function GET(request) {
    await connectDB();
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const profile = await getFreelancerProfileService(user.userId);
        return NextResponse.json({ success: true, data: profile }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    await connectDB();
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const updated = await updateFreelancerProfileService(user.userId, body);
        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}