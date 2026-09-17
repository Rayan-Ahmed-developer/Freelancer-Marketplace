// import { NextResponse } from "next/server";
// import { getAuthUser } from "@/lib/getAuthUser";
// import {
//     getOpenProjectsService,
//     getMyProposalsService,
//     getFreelancerEarningsService,
//     getFreelancerProfileService,
// } from "@/services/freelancer.service";

// export async function GET(request) {
//     try {
//         const user = getAuthUser(request);
//         if (!user) {
//             return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//         }

//         const [projects, proposals, earnings, profile] = await Promise.all([
//             getOpenProjectsService(),
//             getMyProposalsService(user.userId),
//             getFreelancerEarningsService(user.userId),
//             getFreelancerProfileService(user.userId),
//         ]);

//         return NextResponse.json(
//             { success: true, data: { projects, proposals, earnings, profile } },
//             { status: 200 }
//         );
//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser } from "@/lib/getAuthUser";
import { getOpenProjectsService } from "@/services/freelancer.service";
import { getMyProposalsService, getFreelancerProfileService } from "@/services/freelancer.service";

export async function GET(request) {
    await connectDB();
    try {
        const user = getAuthUser(request);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const [projects, proposals, profile] = await Promise.all([
            getOpenProjectsService(),
            getMyProposalsService(user.userId),
            getFreelancerProfileService(user.userId),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                projects,
                proposals,
                profile,
                earnings: { totalEarnings: 0, totalAcceptedProjects: 0 }, // placeholder — payment gateway baad me
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}