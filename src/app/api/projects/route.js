// import { NextResponse } from "next/server";

// import { connectDB } from "@/lib/mongodb";

// import {
//   createProject,
//   getAllProjects,
// } from "@/services/projects.service";

// import { authMiddleware } from "@/middleware/authmiddleware";
// import { roleMiddleware } from "@/middleware/rolemiddleware";

// export async function GET() {
//   try {
//     await connectDB();

//     const projects = await getAllProjects();

//     return NextResponse.json(projects, {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Get Projects Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     // Get logged-in user from JWT
//     const user = authMiddleware(request);

//     if (user instanceof NextResponse) {
//       return user;
//     }

//     console.log("Authenticated User:", user);

//     // Only client/admin can post project
//     const roleError = roleMiddleware(user, [
//       "client",
//       "admin",
//     ]);

//     if (roleError) {
//       return roleError;
//     }

//     // Make sure user ID exists
//     if (!user.userId) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User ID not found in authentication token",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     await connectDB();

//     const projectData = await request.json();

//     console.log("Project Data:", projectData);
//     console.log("Project Client ID:", user.userId);

//     // IMPORTANT:
//     // client ID comes from JWT, NOT from frontend
//     const project = await createProject(
//       projectData,
//       user.userId
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Project created successfully",
//         project,
//       },
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     console.error("Create Project Error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import {
  createProject,
  getAllProjects,
} from "@/services/projects.service";

import { authMiddleware } from "@/middleware/authmiddleware";
import { roleMiddleware } from "@/middleware/rolemiddleware";

export async function GET() {
  try {
    await connectDB();

    const projects = await getAllProjects();

    return NextResponse.json(
      {
        success: true,
        projects,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get Projects Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const user = authMiddleware(request);

    if (user instanceof NextResponse) {
      return user;
    }

    const roleError = roleMiddleware(user, [
      "client",
      "admin",
    ]);

    if (roleError) {
      return roleError;
    }

    if (!user.userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User ID not found in authentication token",
        },
        {
          status: 401,
        }
      );
    }

    await connectDB();

    const projectData = await request.json();

    const project = await createProject(
      projectData,
      user.userId
    );

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create Project Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}