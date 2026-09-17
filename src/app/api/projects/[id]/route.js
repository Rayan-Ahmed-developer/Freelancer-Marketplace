// import {NextResponse} from "next/server";
// import {connectDB} from "@/lib/mongodb";
// import {getProjectById} from "@/services/projects.service";

// export async function GET(request,{params}){
//     try{
//         await connectDB();
//         const projectId = params.id;
//         const project = await getProjectById(projectId);
//         return NextResponse.json(project,{status:200})
//     }
//     catch(error){
//         return NextResponse.json({error:error.message},{status:500})
//     }
// }

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getProjectById } from "@/services/projects.service";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id: projectId } = await params;

    const project = await getProjectById(projectId);

    return NextResponse.json(project, {
      status: 200,
    });
  } catch (error) {
    console.error("Get Project By ID Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}