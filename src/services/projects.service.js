// import { Projects } from "../models/Projects.js";

// export const createProject = async (projectData, client) => {
//   const project = await Projects.create({
//     ...projectData,
//     client,
//   });

//   return project;
// };

// export const getAllProjects = async () => {
//   const projects = await Projects.find({
//     status: "open",
//   }).populate(
//     "client",
//     "firstName lastName email phone"
//   );

//   return projects;
// };

// export const getProjectById = async (projectId) => {
//   const project = await Projects.findById(projectId).populate(
//     "client",
//     "firstName lastName email phone"
//   );

//   if (!project) {
//     throw new Error("Project not found");
//   }

//   return project;
// };

import { Projects } from "../models/Projects.js";
import { User } from "../models/User.js";

export const createProject = async (projectData, client) => {
  const project = await Projects.create({
    ...projectData,
    client,
  });

  return project;
};

export const getAllProjects = async () => {
  const projects = await Projects.find({
    status: "open",
  })
    .populate(
      "client",
      "firstName lastName email phone"
    )
    .sort({ createdAt: -1 });

  return projects;
};

export const getProjectById = async (projectId) => {
  const project = await Projects.findById(projectId).populate(
    "client",
    "firstName lastName email phone"
  );

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};