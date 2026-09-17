import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { markProjectCompletedService } from "@/services/client.service";

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;

        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (user.role !== "client") {
            return NextResponse.json({ success: false, message: "Only clients can mark projects as completed" }, { status: 403 });
        }

        const project = await markProjectCompletedService(id, user.userId);

        return NextResponse.json({ success: true, project }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}