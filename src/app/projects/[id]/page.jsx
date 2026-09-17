// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
// import ProposalModal from '@/components/proposalModel';

// export default function ProjectDetail() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fallback project data taake screen bilkul khali na ho
//   const project = {
//     title: "Build a Decentralized Exchange (DEX) Frontend",
//     description: "Seeking a senior React developer with extensive Web3 experience to build a high-performance trading interface. You will collaborate directly with our smart contract engineering team to integrate liquidity pools, real-time trading charts, and wallet connectivity.",
//     budget: "$15,000 - $25,000",
//     duration: "Fixed Price • Estimated 2 Months",
//     clientRating: "⭐ 4.98 (120+ Reviews)",
//     category: "Verified Enterprise",
//     deliverables: [
//       "Develop responsive trading views using React, Tailwind CSS, and Ethers.js.",
//       "Implement real-time order book updates using WebSockets."
//     ],
//     techStack: ['React', 'Web3', 'Tailwind CSS', 'Ethers.js', 'TypeScript']
//   };

//   return (
//     <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-between">
      
//       {/* Main Content Wrapper */}
//       <main className="py-12 px-6 md:px-16 w-full flex-1">
        
//         {/* Back Button */}
//         <div className="max-w-5xl mx-auto mb-8">
//           <Link href="/projects" className="inline-flex items-center text-sm text-slate-400 hover:text-cyan-400 transition">
//             <ArrowLeft size={16} className="mr-2" /> Back to Marketplace
//           </Link>
//         </div>

//         <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* Left Column: Project Overview */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-8 shadow-xl">
//               <div className="flex items-center space-x-3 mb-4">
//                 <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded-md font-medium uppercase tracking-wider">
//                   {project.category}
//                 </span>
//                 <span className="text-xs text-slate-400">• Posted 2 hours ago</span>
//               </div>

//               <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
//                 {project.title}
//               </h1>

//               <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
//                 {project.description}
//               </p>

//               <h3 className="text-lg font-bold text-white mb-3">Key Deliverables & Requirements</h3>
//               <ul className="space-y-2 mb-6 text-sm text-slate-300">
//                 {project.deliverables.map((item, idx) => (
//                   <li key={idx} className="flex items-start">
//                     <CheckCircle size={16} className="text-cyan-400 mr-2 mt-0.5 flex-shrink-0" /> {item}
//                   </li>
//                 ))}
//               </ul>

//               <h3 className="text-lg font-bold text-white mb-3">Required Tech Stack</h3>
//               <div className="flex flex-wrap gap-2">
//                 {project.techStack.map(skill => (
//                   <span key={skill} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Proposal Trigger Card */}
//           <div className="space-y-6">
//             <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
//               <div className="mb-6">
//                 <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Project Budget</span>
//                 <div className="text-2xl md:text-3xl font-extrabold text-white mt-1">{project.budget}</div>
//                 <span className="text-xs text-cyan-400 mt-1 inline-block">{project.duration}</span>
//               </div>

//               <div className="space-y-4 border-t border-slate-800 pt-6 mb-6 text-sm text-slate-300">
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Client Rating:</span>
//                   <span className="font-semibold text-white">{project.clientRating}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Payment Verified:</span>
//                   <span className="font-semibold text-emerald-400 flex items-center"><ShieldCheck size={14} className="mr-1"/> Yes</span>
//                 </div>
//               </div>

//               {/* Trigger Button */}
//               <button 
//                 onClick={() => setIsModalOpen(true)}
//                 className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-cyan-500/20 text-center block cursor-pointer"
//               >
//                 Submit Proposal
//               </button>
//             </div>
//           </div>

//         </div>
//       </main>

//       {/* Proposal Modal Component */}
//       <ProposalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Clock,
  User,
  Briefcase,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import ProposalModal from "@/components/proposalModel";

export default function ProjectDetail({ params }) {
  const [project, setProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET PROJECT BY ID
  // =========================
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const { id } = await params;

        const response = await fetch(`/api/projects/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Failed to fetch project"
          );
        }

        setProject(data);
      } catch (error) {
        console.error("Get Project Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params]);

  // =========================
  // FORMAT PKR
  // =========================
  const formatPKR = (amount) => {
    if (amount === undefined || amount === null) {
      return "PKR 0";
    }

    return `PKR ${Number(amount).toLocaleString("en-PK")}`;
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center px-6">
        <div className="text-center">

          <Loader2
            size={40}
            className="mx-auto mb-4 text-cyan-400 animate-spin"
          />

          <p className="text-slate-400 text-sm">
            Loading project...
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex items-center justify-center px-6">

        <div className="text-center max-w-md">

          <AlertCircle
            size={45}
            className="mx-auto mb-4 text-red-400"
          />

          <h1 className="text-2xl font-bold text-white mb-2">
            Project Not Found
          </h1>

          <p className="text-sm text-slate-400 mb-6">
            {error || "This project could not be found."}
          </p>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-3 rounded-xl transition"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">

      {/* =========================
          MAIN
      ========================= */}
      <main className="py-12 px-6 md:px-16">

        {/* BACK BUTTON */}
        <div className="max-w-6xl mx-auto mb-8">

          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-slate-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft
              size={16}
              className="mr-2"
            />

            Back to Marketplace
          </Link>

        </div>

        {/* =========================
            MAIN GRID
        ========================= */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* =====================================================
              LEFT SIDE
          ===================================================== */}
          <div className="lg:col-span-2 space-y-6">

            {/* PROJECT OVERVIEW */}
            <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-7 md:p-8 shadow-xl">

              {/* CATEGORY + STATUS */}
              <div className="flex flex-wrap items-center gap-3 mb-5">

                <span className="text-[10px] bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 px-3 py-1.5 rounded-md font-semibold uppercase tracking-wider">
                  {project.category}
                </span>

                <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 px-3 py-1.5 rounded-md font-semibold uppercase">
                  {project.status || "open"}
                </span>

              </div>

              {/* TITLE */}
              <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-5">
                {project.title}
              </h1>

              {/* DESCRIPTION */}
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                {project.description}
              </p>

              {/* =========================
                  PROJECT INFORMATION
              ========================= */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

                {/* EXPERIENCE */}
                <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4">

                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Award size={15} />
                    <span className="text-xs">
                      Experience
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white capitalize">
                    {project.experienceLevel}
                  </p>

                </div>

                {/* DELIVERY */}
                <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4">

                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Clock size={15} />
                    <span className="text-xs">
                      Delivery Time
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white">
                    {project.deliveryTime ||
                      "1 to 4 months"}
                  </p>

                </div>

                {/* BUDGET */}
                <div className="bg-[#0B0F19] border border-slate-800 rounded-xl p-4">

                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Briefcase size={15} />
                    <span className="text-xs">
                      Budget
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-cyan-400">
                    {formatPKR(project.budget)}
                  </p>

                </div>

              </div>

              {/* =========================
                  REQUIRED SKILLS
              ========================= */}
              <div className="border-t border-slate-800 pt-7">

                <h2 className="text-lg font-bold text-white mb-4">
                  Required Skills
                </h2>

                {project.skillsRequired?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">

                    {project.skillsRequired.map(
                      (skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="text-xs bg-slate-800 text-slate-300 px-3 py-2 rounded-lg border border-slate-700"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No specific skills were provided.
                  </p>
                )}

              </div>

            </div>

            {/* =========================
                PROJECT REQUIREMENTS
            ========================= */}
            <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-7 md:p-8 shadow-xl">

              <h2 className="text-xl font-bold text-white mb-5">
                Project Requirements
              </h2>

              <div className="space-y-4">

                <div className="flex items-start gap-3">

                  <CheckCircle
                    size={18}
                    className="text-cyan-400 mt-0.5 flex-shrink-0"
                  />

                  <p className="text-sm text-slate-300">
                    Complete the project according to the
                    requirements provided by the client.
                  </p>

                </div>

                <div className="flex items-start gap-3">

                  <CheckCircle
                    size={18}
                    className="text-cyan-400 mt-0.5 flex-shrink-0"
                  />

                  <p className="text-sm text-slate-300">
                    Use the required skills and technologies
                    listed for this project.
                  </p>

                </div>

                <div className="flex items-start gap-3">

                  <CheckCircle
                    size={18}
                    className="text-cyan-400 mt-0.5 flex-shrink-0"
                  />

                  <p className="text-sm text-slate-300">
                    Deliver the completed work within the
                    specified delivery time.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}
          <div>

            <div className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 shadow-xl lg:sticky lg:top-24">

              {/* BUDGET */}
              <div className="mb-6">

                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Project Budget
                </span>

                <div className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                  {formatPKR(project.budget)}
                </div>

                <div className="flex items-center gap-2 text-xs text-cyan-400 mt-2">

                  <Clock size={13} />

                  {project.deliveryTime ||
                    "1 to 4 months"}

                </div>

              </div>

              {/* CLIENT INFO */}
              <div className="border-t border-slate-800 pt-6 mb-6">

                <h3 className="text-sm font-semibold text-white mb-4">
                  About the Client
                </h3>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                    <User
                      size={18}
                      className="text-cyan-400"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-white">
                      {project.client?.firstName || ""}{" "}
                      {project.client?.lastName || ""}
                    </p>

                    <p className="text-xs text-slate-500">
                      {project.client?.email ||
                        "Verified Client"}
                    </p>

                  </div>

                </div>

              </div>

              {/* PAYMENT VERIFIED */}
              <div className="border-t border-slate-800 pt-6 mb-6">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-400">
                    Payment Verified
                  </span>

                  <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">

                    <ShieldCheck size={15} />

                    Yes

                  </span>

                </div>

              </div>

              {/* SUBMIT PROPOSAL */}
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={project.status !== "open"}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-cyan-500/20 text-center"
              >
                {project.status === "open"
                  ? "Submit Proposal"
                  : "Project Closed"}
              </button>

              <p className="text-[11px] text-slate-500 text-center mt-4">
                Submit your proposal to apply for this project.
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* =========================
          PROPOSAL MODAL
      ========================= */}
      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={project._id}
      />

    </div>
  );
}