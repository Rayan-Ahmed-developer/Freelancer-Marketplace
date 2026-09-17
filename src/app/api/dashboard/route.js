import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { getClientDashboardSummaryService } from "@/services/client.service";

export async function GET(request) {
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const summary = await getClientDashboardSummaryService(user.userId);
        return NextResponse.json({ success: true, summary }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}