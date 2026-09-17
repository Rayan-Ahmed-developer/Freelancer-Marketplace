import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import {
    getOpenProjectsService,
} from "@/services/freelancerDashboard.service";

export async function GET() {
    await connectDB();
    try {
        const projects = await getOpenProjectsService();

        return NextResponse.json(
            {
                success: true,
                data: projects,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}