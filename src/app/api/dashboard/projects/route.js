import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import { getClientProjectsService, createProjectService } from "@/services/client.service";

export async function GET(request) {
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const projects = await getClientProjectsService(user.userId);
        return NextResponse.json({ success: true, projects }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const project = await createProjectService(user.userId, body);
        return NextResponse.json({ success: true, project }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}