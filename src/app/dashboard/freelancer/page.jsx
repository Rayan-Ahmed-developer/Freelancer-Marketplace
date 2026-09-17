// "use client";

// import { useState, useRef, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Briefcase,
//   Search,
//   Send,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   DollarSign,
//   LogOut,
//   Settings,
//   Calculator,
//   X,
//   Paperclip,
//   Wallet,
//   CreditCard,
//   Upload,
//   Phone,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function FreelancerDashboard() {
//   const router = useRouter();

//   const [activeTab, setActiveTab] = useState("explore");
//   const [selectedProject, setSelectedProject] = useState(null);

//   const [mounted, setMounted] = useState(false);
//   const [authChecking, setAuthChecking] = useState(true);

//   // =========================
//   // AUTH PROTECTION
//   // =========================
//   useEffect(() => {
//     setMounted(true);

//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     // No token/user = not logged in
//     if (!token || !storedUser) {
//       router.replace("/login");
//       return;
//     }

//     try {
//       const user = JSON.parse(storedUser);

//       // Freelancer dashboard sirf freelancer ke liye
//       if (user.role !== "freelancer") {
//         router.replace("/");
//         return;
//       }

//       // Correct user
//       setAuthChecking(false);
//     } catch (error) {
//       console.error("Auth check failed:", error);

//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       router.replace("/login");
//     }
//   }, [router]);

//   // =========================
//   // LOGOUT
//   // =========================
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     router.replace("/login");
//   };

//   // =========================
//   // REAL DATA STATES
//   // =========================
//   const [openProjects, setOpenProjects] = useState([]);
//   const [myProposals, setMyProposals] = useState([]);
//   const [earnings, setEarnings] = useState({
//     totalEarnings: 0,
//     totalAcceptedProjects: 0,
//   });
//   const [profile, setProfile] = useState(null);

//   const [loadingData, setLoadingData] = useState(true);
//   const [error, setError] = useState(null);

//   // =========================
//   // PROPOSAL FORM STATES
//   // =========================
//   const [bidAmount, setBidAmount] = useState("");
//   const [deliveryTime, setDeliveryTime] = useState("");
//   const [coverLetter, setCoverLetter] = useState("");
//   const [attachmentFile, setAttachmentFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fileInputRef = useRef(null);

//   // =========================
//   // WITHDRAWAL STATES
//   // =========================
//   const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

//   // =========================
//   // PROFILE FORM STATES
//   // =========================
//   const [skillsInput, setSkillsInput] = useState("");
//   const [summaryInput, setSummaryInput] = useState("");
//   const [isSavingProfile, setIsSavingProfile] = useState(false);

//   // =========================
//   // AUTH HEADERS
//   // =========================
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");

//     return {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };
//   };

//   // =========================
//   // FETCH DASHBOARD DATA
//   // =========================
//   const fetchDashboardData = async () => {
//     try {
//       setLoadingData(true);
//       setError(null);

//       const res = await fetch("/api/dashboard/freelancer", {
//         headers: getAuthHeaders(),
//       });

//       const data = await res.json();

//       // Token expired / unauthorized
//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         router.replace("/login");
//         return;
//       }

//       // Wrong role / forbidden
//       if (res.status === 403) {
//         router.replace("/");
//         return;
//       }

//       if (res.ok) {
//         setOpenProjects(data.data?.projects || []);
//         setMyProposals(data.data?.proposals || []);
//         setEarnings(
//           data.data?.earnings || {
//             totalEarnings: 0,
//             totalAcceptedProjects: 0,
//           },
//         );
//         setProfile(data.data?.profile || null);

//         setSummaryInput(data.data?.profile?.profileSummary || "");
//         setSkillsInput((data.data?.profile?.skills || []).join(", "));
//       } else {
//         setError(data.message || "Failed to load dashboard data.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Network error connecting to backend API.");
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   // =========================
//   // LOAD DATA ONLY AFTER AUTH
//   // =========================
//   useEffect(() => {
//     if (!authChecking) {
//       fetchDashboardData();
//     }
//   }, [authChecking]);

//   // =========================
//   // BID CALCULATION
//   // =========================
//   const parsedBid = Number(bidAmount) || 0;
//   const platformFee = parsedBid * 0.1;
//   const youWillReceive = parsedBid - platformFee;

//   // =========================
//   // FORMAT PKR
//   // =========================
//   const formatPKR = (value) => {
//     return `Rs ${new Intl.NumberFormat("en-PK").format(value || 0)}`;
//   };

//   // =========================
//   // FILE CHANGE
//   // =========================
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];

//     if (file) {
//       setAttachmentFile(file);
//     }
//   };

//   // =========================
//   // SUBMIT PROPOSAL
//   // =========================
//   const handleProposalSubmit = async (e) => {
//     e.preventDefault();

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/dashboard/freelancer/proposals", {
//         method: "POST",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           projectId: selectedProject?._id,
//           bidAmount: parsedBid,
//           deliveryTime,
//           coverLetter,
//           attachments: attachmentFile
//             ? [
//                 {
//                   fileName: attachmentFile.name,
//                   fileType: attachmentFile.type,
//                   fileSize: attachmentFile.size,
//                 },
//               ]
//             : [],
//         }),
//       });

//       const data = await res.json();

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         router.replace("/login");
//         return;
//       }

//       if (res.status === 403) {
//         router.replace("/");
//         return;
//       }

//       if (res.ok) {
//         alert("Proposal submitted successfully!");

//         setSelectedProject(null);
//         setBidAmount("");
//         setDeliveryTime("");
//         setCoverLetter("");
//         setAttachmentFile(null);

//         fetchDashboardData();
//       } else {
//         setError(data.message || "Failed to submit proposal.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server connection failed while submitting proposal.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // =========================
//   // PROFILE SAVE
//   // =========================
//   const handleSaveProfile = async () => {
//     setIsSavingProfile(true);
//     setError(null);

//     try {
//       const res = await fetch("/api/dashboard/freelancer/profile", {
//         method: "PATCH",
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           profileSummary: summaryInput,
//           skills: skillsInput,
//         }),
//       });

//       const data = await res.json();

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         router.replace("/login");
//         return;
//       }

//       if (res.status === 403) {
//         router.replace("/");
//         return;
//       }

//       if (res.ok) {
//         setProfile(data.data);
//         alert("Profile updated successfully!");
//       } else {
//         setError(data.message || "Failed to update profile.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server connection failed while saving profile.");
//     } finally {
//       setIsSavingProfile(false);
//     }
//   };

//   // =========================
//   // MODAL SCROLL LOCK
//   // =========================
//   useEffect(() => {
//     const anyModalOpen =
//       selectedProject !== null || isWithdrawModalOpen === true;

//     document.body.style.overflow = anyModalOpen ? "hidden" : "";

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [selectedProject, isWithdrawModalOpen]);

//   // =========================
//   // AUTH CHECK SCREEN
//   // =========================
//   if (authChecking) {
//     return (
//       <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-white">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
//           <p className="text-xs text-gray-400">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   const proposalModal = (
//     <AnimatePresence>
//       {selectedProject && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//         >
//           <div className="min-h-full flex items-start justify-center px-4 py-6 sm:py-8">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.96, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 20 }}
//               transition={{ duration: 0.25 }}
//               className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[calc(100vh-3rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//             >
//               <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800">
//                 <div>
//                   <h3 className="text-xl font-bold text-white">
//                     Submit Proposal
//                   </h3>

//                   <p className="text-xs text-gray-400 mt-1">
//                     Project:
//                     <span className="text-indigo-400 font-semibold ml-1">
//                       {selectedProject.title}
//                     </span>
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => setSelectedProject(null)}
//                   className="p-2 rounded-xl bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>

//               <form onSubmit={handleProposalSubmit} className="space-y-5">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-300 mb-2">
//                     Bid Amount (PKR) *
//                   </label>

//                   <div className="relative flex items-center">
//                     <span className="absolute left-4 text-indigo-400 text-xs font-bold">
//                       PKR
//                     </span>

//                     <input
//                       type="number"
//                       required
//                       min="1"
//                       placeholder="e.g. 100000"
//                       value={bidAmount}
//                       onChange={(e) => setBidAmount(e.target.value)}
//                       className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl pl-14 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
//                     />
//                   </div>

//                   <p className="text-[11px] text-gray-500 mt-1.5">
//                     Enter the total amount you want to charge the client.
//                   </p>
//                 </div>

//                 <div className="bg-[#0a0f1d]/70 border border-gray-800/80 rounded-2xl p-4 space-y-3">
//                   <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-xs">
//                     <Calculator size={14} />
//                     Fee Breakdown (estimate)
//                   </div>

//                   <div className="flex justify-between text-xs">
//                     <span className="text-gray-400">Platform Fee (10%)</span>

//                     <span className="text-rose-400 font-medium">
//                       - {formatPKR(platformFee)}
//                     </span>
//                   </div>

//                   <div className="flex justify-between border-t border-gray-800/80 pt-3 font-bold text-white text-sm">
//                     <span>You will receive</span>
//                     <span className="text-emerald-400">
//                       {formatPKR(youWillReceive)}
//                     </span>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-300 mb-2">
//                     Delivery Time *
//                   </label>

//                   <div className="relative flex items-center">
//                     <Clock
//                       size={16}
//                       className="absolute left-4 text-gray-500"
//                     />

//                     <input
//                       type="text"
//                       required
//                       placeholder="e.g. 2 weeks"
//                       value={deliveryTime}
//                       onChange={(e) => setDeliveryTime(e.target.value)}
//                       className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <label className="block text-xs font-medium text-gray-300">
//                       Cover Letter & Approach *
//                     </label>

//                     <span className="text-[10px] text-gray-500">
//                       {coverLetter.length}/2000
//                     </span>
//                   </div>

//                   <textarea
//                     rows={5}
//                     required
//                     minLength={20}
//                     maxLength={2000}
//                     placeholder="Explain why you are the right freelancer for this project and how you will approach the work."
//                     value={coverLetter}
//                     onChange={(e) => setCoverLetter(e.target.value)}
//                     className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-medium text-gray-300 mb-2">
//                     Portfolio / Resume / Document
//                     <span className="text-gray-500 ml-1">(Optional)</span>
//                   </label>

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     className="hidden"
//                     accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
//                     onChange={handleFileChange}
//                   />

//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="w-full border border-dashed border-gray-700 hover:border-indigo-500 bg-[#0a0f1d] hover:bg-indigo-500/5 rounded-2xl p-5 transition-all duration-300 cursor-pointer group"
//                   >
//                     <div className="flex flex-col items-center justify-center gap-2">
//                       <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
//                         <Upload size={20} />
//                       </div>

//                       <div className="text-center">
//                         {attachmentFile ? (
//                           <>
//                             <p className="text-sm font-medium text-white truncate max-w-[280px]">
//                               {attachmentFile.name}
//                             </p>

//                             <p className="text-[11px] text-emerald-400 mt-1">
//                               File selected successfully
//                             </p>
//                           </>
//                         ) : (
//                           <>
//                             <p className="text-sm font-medium text-gray-300 group-hover:text-white">
//                               Click to choose a file
//                             </p>

//                             <p className="text-[11px] text-gray-500 mt-1">
//                               PDF, DOC, DOCX, JPG, PNG or ZIP
//                             </p>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedProject(null)}
//                     className="px-5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-800 transition-colors cursor-pointer"
//                   >
//                     Cancel
//                   </button>

//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
//                   >
//                     {isSubmitting ? (
//                       "Submitting..."
//                     ) : (
//                       <>
//                         Send Proposal
//                         <Send size={13} />
//                       </>
//                     )}
//                   </motion.button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );

//   return (
//     <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
//       {/* HEADER */}
//       <header className="border-b border-gray-800/80 bg-[#111827]/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
//             <Briefcase className="w-5 h-5" />
//           </div>

//           <div>
//             <span className="text-lg font-bold tracking-tight text-white">
//               Workly
//             </span>

//             <span className="text-xs text-indigo-400 block font-medium">
//               Freelancer Workspace
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="hidden sm:flex items-center gap-2 bg-[#161f33] px-3 py-1.5 rounded-full border border-gray-800 text-xs text-gray-300">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
//             Online & Ready to Work
//           </div>

//           {/* PROPER LOGOUT */}
//           <button
//             onClick={handleLogout}
//             title="Logout"
//             className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
//           >
//             <LogOut className="w-4 h-4" />
//           </button>
//         </div>
//       </header>

//       {/* MAIN */}
//       <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* SIDEBAR */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.4 }}
//           className="lg:col-span-1 space-y-2"
//         >
//           <div className="bg-[#111827]/70 backdrop-blur-md border border-gray-800/80 rounded-2xl p-4 shadow-xl space-y-1">
//             <p className="text-[10px] uppercase font-semibold text-gray-500 px-3 mb-3 tracking-wider">
//               Navigation
//             </p>

//             <button
//               onClick={() => setActiveTab("explore")}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
//                 activeTab === "explore"
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
//                   : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
//               }`}
//             >
//               <Search className="w-4 h-4" />
//               Explore Projects
//             </button>

//             <button
//               onClick={() => {
//                 setActiveTab("proposals");
//                 fetchDashboardData();
//               }}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
//                 activeTab === "proposals"
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
//                   : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
//               }`}
//             >
//               <Send className="w-4 h-4" />
//               My Proposals
//             </button>

//             <button
//               onClick={() => setActiveTab("earnings")}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
//                 activeTab === "earnings"
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
//                   : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
//               }`}
//             >
//               <Wallet className="w-4 h-4" />
//               Earnings & Payouts
//             </button>

//             <button
//               onClick={() => setActiveTab("profile")}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
//                 activeTab === "profile"
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
//                   : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
//               }`}
//             >
//               <Settings className="w-4 h-4" />
//               Profile & Skills
//             </button>
//           </div>
//         </motion.div>

//         {/* CONTENT */}
//         <div className="lg:col-span-3">
//           {error && (
//             <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
//               <AlertCircle className="w-4 h-4 shrink-0" />
//               {error}
//             </div>
//           )}

//           {loadingData ? (
//             <div className="py-20 flex justify-center items-center">
//               <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
//             </div>
//           ) : (
//             <AnimatePresence mode="wait">
//               {/* EXPLORE */}
//               {activeTab === "explore" && (
//                 <motion.div
//                   key="explore"
//                   initial={{ opacity: 0, y: 15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -15 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <div>
//                     <h2 className="text-2xl font-extrabold tracking-tight">
//                       Open Projects Market
//                     </h2>

//                     <p className="text-xs text-gray-400 mt-1">
//                       Browse open client projects and submit your custom
//                       proposal.
//                     </p>
//                   </div>

//                   {openProjects.length === 0 ? (
//                     <div className="bg-[#111827]/80 border border-gray-800/90 rounded-2xl p-12 text-center text-gray-400 text-xs">
//                       No open projects available right now.
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 gap-4">
//                       {openProjects.map((project) => (
//                         <motion.div
//                           key={project._id}
//                           whileHover={{ y: -3 }}
//                           transition={{ duration: 0.2 }}
//                           className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
//                         >
//                           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />

//                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//                             <div>
//                               <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full">
//                                 {project.category}
//                               </span>

//                               <h3 className="text-lg font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
//                                 {project.title}
//                               </h3>
//                             </div>

//                             <div className="text-left sm:text-right">
//                               <span className="text-xs text-gray-400 block">
//                                 Project Budget
//                               </span>

//                               <span className="text-xl font-extrabold text-emerald-400">
//                                 {formatPKR(project.budget)}
//                               </span>
//                             </div>
//                           </div>

//                           <p className="text-xs text-gray-400 leading-relaxed mb-6">
//                             {project.description}
//                           </p>

//                           <div className="flex items-center justify-between pt-4 border-t border-gray-800/80">
//                             <div className="text-xs text-gray-400">
//                               Client:
//                               <span className="text-gray-200 font-medium ml-1">
//                                 {project.client?.firstName}{" "}
//                                 {project.client?.lastName}
//                               </span>
//                             </div>

//                             <button
//                               onClick={() => setSelectedProject(project)}
//                               className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
//                             >
//                               <Send className="w-3.5 h-3.5" />
//                               Submit Proposal
//                             </button>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* PROPOSALS */}
//               {activeTab === "proposals" && (
//                 <motion.div
//                   key="proposals"
//                   initial={{ opacity: 0, y: 15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -15 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <div>
//                     <h2 className="text-2xl font-extrabold tracking-tight">
//                       My Submitted Proposals
//                     </h2>

//                     <p className="text-xs text-gray-400 mt-1">
//                       Track the status of your bids and client decisions.
//                     </p>
//                   </div>

//                   {myProposals.length === 0 ? (
//                     <div className="bg-[#111827]/80 border border-gray-800/90 rounded-2xl p-12 text-center text-gray-400 text-xs">
//                       You haven't submitted any proposals yet.
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {myProposals.map((prop) => (
//                         <motion.div
//                           key={prop._id}
//                           whileHover={{ y: -2 }}
//                           className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-6 shadow-xl space-y-4"
//                         >
//                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                             <div>
//                               <h4 className="font-bold text-white text-sm mb-1">
//                                 {prop.projectId?.title}
//                               </h4>

//                               <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
//                                 <span>
//                                   Bid:
//                                   <strong className="text-indigo-400 ml-1">
//                                     {formatPKR(prop.bidAmount)}
//                                   </strong>
//                                 </span>

//                                 <span>
//                                   Delivery:
//                                   <strong className="text-gray-300 ml-1">
//                                     {prop.deliveryTime}
//                                   </strong>
//                                 </span>

//                                 {prop.attachments?.length > 0 && (
//                                   <span className="text-indigo-400 flex items-center gap-1">
//                                     <Paperclip size={12} />
//                                     Attachment
//                                   </span>
//                                 )}
//                               </div>
//                             </div>

//                             <div>
//                               {prop.status === "pending" && (
//                                 <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
//                                   <Clock className="w-3.5 h-3.5" />
//                                   Pending Review
//                                 </span>
//                               )}

//                               {prop.status === "accepted" && (
//                                 <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
//                                   <CheckCircle2 className="w-3.5 h-3.5" />
//                                   Accepted (Hired!)
//                                 </span>
//                               )}

//                               {/* 👇 NAYA BLOCK ADD KARO */}
//                               {prop.status === "completed" && (
//                                 <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
//                                   <CheckCircle2 className="w-3.5 h-3.5" />
//                                   Project Completed
//                                 </span>
//                               )}

//                               {prop.status === "rejected" && (
//                                 <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
//                                   <XCircle className="w-3.5 h-3.5" />
//                                   Declined
//                                 </span>
//                               )}
//                             </div>
//                           </div>

//                           {prop.status === "accepted" && (
//                             <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-400">
//                               <span className="flex items-center gap-2 font-medium">
//                                 <Phone className="w-3.5 h-3.5" />
//                                 Client Contact:{" "}
//                                 {prop.projectId?.client?.firstName}{" "}
//                                 {prop.projectId?.client?.lastName} —{" "}
//                                 {prop.projectId?.client?.phone || "N/A"}
//                               </span>
//                             </div>
//                           )}
//                         </motion.div>
//                       ))}
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {/* EARNINGS */}
//               {activeTab === "earnings" && (
//                 <motion.div
//                   key="earnings"
//                   initial={{ opacity: 0, y: 15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -15 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <div>
//                     <h2 className="text-2xl font-extrabold tracking-tight">
//                       Earnings & Payouts
//                     </h2>

//                     <p className="text-xs text-gray-400 mt-1">
//                       Track your lifetime earnings from completed projects.
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
//                       <div className="flex items-center justify-between text-gray-400 mb-2">
//                         <span className="text-xs font-semibold uppercase tracking-wider">
//                           Total Lifetime Earnings
//                         </span>

//                         <DollarSign size={20} className="text-emerald-400" />
//                       </div>

//                       <div className="text-3xl font-extrabold text-white">
//                         {formatPKR(earnings.totalEarnings)}
//                       </div>

//                       <p className="text-xs text-gray-400 mt-1">
//                         From {earnings.totalAcceptedProjects} accepted projects
//                       </p>

//                       <div className="mt-6 text-[11px] text-gray-500">
//                         Platform fee deduction: 10% already applied.
//                       </div>
//                     </div>

//                     <div className="bg-[#111827]/40 border border-gray-800 rounded-2xl p-6 shadow-xl opacity-60">
//                       <div className="flex items-center justify-between text-gray-400 mb-2">
//                         <span className="text-xs font-semibold uppercase tracking-wider">
//                           Available Balance
//                         </span>

//                         <Wallet size={20} className="text-gray-500" />
//                       </div>

//                       <div className="text-3xl font-extrabold text-gray-500">
//                         Coming Soon
//                       </div>

//                       <p className="text-xs text-gray-500 mt-1">
//                         Withdrawals will be enabled once payment system is
//                         ready.
//                       </p>

//                       <button
//                         disabled
//                         className="mt-6 w-full bg-gray-700 text-gray-400 font-bold py-2.5 px-4 rounded-xl text-xs cursor-not-allowed"
//                       >
//                         Withdraw Funds (Coming Soon)
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* PROFILE */}
//               {activeTab === "profile" && (
//                 <motion.div
//                   key="profile"
//                   initial={{ opacity: 0, y: 15 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -15 }}
//                   transition={{ duration: 0.3 }}
//                   className="space-y-6"
//                 >
//                   <div>
//                     <h2 className="text-2xl font-extrabold tracking-tight">
//                       Profile & Skills
//                     </h2>

//                     <p className="text-xs text-gray-400 mt-1">
//                       Manage your professional summary and skills.
//                     </p>
//                   </div>

//                   <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-8 shadow-xl space-y-6">
//                     <div>
//                       <label className="block text-xs font-medium text-gray-300 mb-2">
//                         Profile Summary
//                       </label>

//                       <textarea
//                         rows={4}
//                         value={summaryInput}
//                         onChange={(e) => setSummaryInput(e.target.value)}
//                         className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-300 mb-2">
//                         Skills (comma separated)
//                       </label>

//                       <input
//                         type="text"
//                         value={skillsInput}
//                         onChange={(e) => setSkillsInput(e.target.value)}
//                         className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
//                       />
//                     </div>

//                     <button
//                       onClick={handleSaveProfile}
//                       disabled={isSavingProfile}
//                       className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-3 px-6 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
//                     >
//                       {isSavingProfile ? "Saving..." : "Save Changes"}
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           )}
//         </div>
//       </div>

//       {mounted && createPortal(<>{proposalModal}</>, document.body)}
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Search,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  LogOut,
  Settings,
  Calculator,
  X,
  Paperclip,
  Wallet,
  CreditCard,
  Upload,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FreelancerDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("explore");
  const [selectedProject, setSelectedProject] = useState(null);

  const [mounted, setMounted] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // =========================
  // AUTH PROTECTION
  // =========================
  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // No token/user = not logged in
    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      // Freelancer dashboard sirf freelancer ke liye
      if (user.role !== "freelancer") {
        router.replace("/");
        return;
      }

      // Correct user
      setAuthChecking(false);
    } catch (error) {
      console.error("Auth check failed:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  }, [router]);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  // =========================
  // REAL DATA STATES
  // =========================
  const [openProjects, setOpenProjects] = useState([]);
  const [myProposals, setMyProposals] = useState([]);

  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    totalAcceptedProjects: 0,
  });

  const [profile, setProfile] = useState(null);

  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // EARNINGS DETAILS
  // =========================
  const [earningsDetails, setEarningsDetails] = useState({
    totalEarnings: 0,
    totalAcceptedProjects: 0,
    totalPaidProjects: 0,
    earnings: [],
    pendingPayments: [],
  });

  const [withdrawingPaymentId, setWithdrawingPaymentId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // =========================
  // PROPOSAL FORM STATES
  // =========================
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // =========================
  // WITHDRAWAL STATES
  // =========================
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // =========================
  // PROFILE FORM STATES
  // =========================
  const [skillsInput, setSkillsInput] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // =========================
  // AUTH HEADERS
  // =========================
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      const res = await fetch("/api/dashboard/freelancer", {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      // Token expired / unauthorized
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      // Wrong role / forbidden
      if (res.status === 403) {
        router.replace("/");
        return;
      }

      if (res.ok) {
        setOpenProjects(data.data?.projects || []);
        setMyProposals(data.data?.proposals || []);

        setEarnings(
          data.data?.earnings || {
            totalEarnings: 0,
            totalAcceptedProjects: 0,
          },
        );

        setProfile(data.data?.profile || null);

        setSummaryInput(data.data?.profile?.profileSummary || "");
        setSkillsInput((data.data?.profile?.skills || []).join(", "));
      } else {
        setError(data.message || "Failed to load dashboard data.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error connecting to backend API.");
    } finally {
      setLoadingData(false);
    }
  };

  // =========================
  // FETCH FREELANCER EARNINGS
  // =========================
  const fetchFreelancerEarnings = async () => {
    try {
      const res = await fetch("/api/dashboard/freelancer/earnings", {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      // Token expired / unauthorized
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      // Wrong role / forbidden
      if (res.status === 403) {
        router.replace("/");
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to load earnings.",
        );
      }

      setEarningsDetails(
        data.data || {
          totalEarnings: 0,
          totalAcceptedProjects: 0,
          totalPaidProjects: 0,
          earnings: [],
          pendingPayments: [],
        },
      );
    } catch (err) {
      console.error("Earnings fetch error:", err);

      setError(err.message || "Failed to load earnings.");
    }
  };

  // =========================
  // LOAD DASHBOARD DATA
  // =========================
  useEffect(() => {
    if (!authChecking) {
      fetchDashboardData();
      fetchFreelancerEarnings();
    }
  }, [authChecking]);

  // =========================
  // BID CALCULATION
  // =========================
  const parsedBid = Number(bidAmount) || 0;
  const platformFee = parsedBid * 0.1;
  const youWillReceive = parsedBid - platformFee;

  // =========================
  // FORMAT PKR
  // =========================
  const formatPKR = (value) => {
    return `Rs ${new Intl.NumberFormat("en-PK").format(value || 0)}`;
  };

  // =========================
  // FILE CHANGE
  // =========================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setAttachmentFile(file);
    }
  };

  // =========================
  // SUBMIT PROPOSAL
  // =========================
  const handleProposalSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/freelancer/proposals", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          projectId: selectedProject?._id,
          bidAmount: parsedBid,
          deliveryTime,
          coverLetter,
          attachments: attachmentFile
            ? [
                {
                  fileName: attachmentFile.name,
                  fileType: attachmentFile.type,
                  fileSize: attachmentFile.size,
                },
              ]
            : [],
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      if (res.status === 403) {
        router.replace("/");
        return;
      }

      if (res.ok) {
        alert("Proposal submitted successfully!");

        setSelectedProject(null);
        setBidAmount("");
        setDeliveryTime("");
        setCoverLetter("");
        setAttachmentFile(null);

        fetchDashboardData();
      } else {
        setError(data.message || "Failed to submit proposal.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed while submitting proposal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // PROFILE SAVE
  // =========================
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/freelancer/profile", {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          profileSummary: summaryInput,
          skills: skillsInput,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }

      if (res.status === 403) {
        router.replace("/");
        return;
      }

      if (res.ok) {
        setProfile(data.data);
        alert("Profile updated successfully!");
      } else {
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed while saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // =========================
  // OPEN WITHDRAW MODAL
  // =========================
  const openWithdrawModal = (payment) => {
    if (!payment) return;

    if (payment.withdrawn) {
      setError("This payment has already been withdrawn.");
      return;
    }

    setSelectedPayment(payment);
    setIsWithdrawModalOpen(true);
  };

  // =========================
  // CLOSE WITHDRAW MODAL
  // =========================
  const closeWithdrawModal = () => {
    if (withdrawingPaymentId) return;

    setIsWithdrawModalOpen(false);
    setSelectedPayment(null);
  };

  // =========================
  // WITHDRAW PAYMENT
  // =========================
  const handleWithdraw = async (paymentId) => {
    if (!paymentId) return;

    try {
      setWithdrawingPaymentId(paymentId);
      setError(null);

      const res = await fetch(
        `/api/dashboard/freelancer/earnings/withdraw/${paymentId}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        },
      );

      const data = await res.json();

      // Token expired / unauthorized
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        router.replace("/login");
        return;
      }

      // Wrong role / forbidden
      if (res.status === 403) {
        setError(
          data.error ||
            data.message ||
            "You cannot withdraw this payment.",
        );

        return;
      }

      if (!res.ok) {
        setError(
          data.error ||
            data.message ||
            "Withdrawal failed.",
        );

        return;
      }

      // Close modal
      setIsWithdrawModalOpen(false);
      setSelectedPayment(null);

      alert("Payment marked as withdrawn successfully.");

      // Refresh earnings
      await fetchFreelancerEarnings();
    } catch (err) {
      console.error("Withdraw error:", err);

      setError("Server connection failed while withdrawing payment.");
    } finally {
      setWithdrawingPaymentId(null);
    }
  };

  // =========================
  // CALCULATE AVAILABLE BALANCE
  // =========================
  const availableBalance = earningsDetails.earnings
    .filter((payment) => !payment.withdrawn)
    .reduce(
      (total, payment) =>
        total + (Number(payment.freelancerAmount) || 0),
      0,
    );

  // =========================
  // MODAL SCROLL LOCK
  // =========================
  useEffect(() => {
    const anyModalOpen =
      selectedProject !== null || isWithdrawModalOpen === true;

    document.body.style.overflow = anyModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject, isWithdrawModalOpen]);

  // =========================
  // AUTH CHECK SCREEN
  // =========================
  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />

          <p className="text-xs text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PROPOSAL MODAL
  // =========================
  const proposalModal = (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="min-h-full flex items-start justify-center px-4 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[calc(100vh-3rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-800">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Submit Proposal
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Project:
                    <span className="text-indigo-400 font-semibold ml-1">
                      {selectedProject.title}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={handleProposalSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Bid Amount (PKR) *
                  </label>

                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-indigo-400 text-xs font-bold">
                      PKR
                    </span>

                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 100000"
                      value={bidAmount}
                      onChange={(e) =>
                        setBidAmount(e.target.value)
                      }
                      className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl pl-14 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1.5">
                    Enter the total amount you want to charge the
                    client.
                  </p>
                </div>

                <div className="bg-[#0a0f1d]/70 border border-gray-800/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-xs">
                    <Calculator size={14} />

                    Fee Breakdown (estimate)
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">
                      Platform Fee (10%)
                    </span>

                    <span className="text-rose-400 font-medium">
                      - {formatPKR(platformFee)}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-800/80 pt-3 font-bold text-white text-sm">
                    <span>You will receive</span>

                    <span className="text-emerald-400">
                      {formatPKR(youWillReceive)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Delivery Time *
                  </label>

                  <div className="relative flex items-center">
                    <Clock
                      size={16}
                      className="absolute left-4 text-gray-500"
                    />

                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 weeks"
                      value={deliveryTime}
                      onChange={(e) =>
                        setDeliveryTime(e.target.value)
                      }
                      className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-gray-300">
                      Cover Letter & Approach *
                    </label>

                    <span className="text-[10px] text-gray-500">
                      {coverLetter.length}/2000
                    </span>
                  </div>

                  <textarea
                    rows={5}
                    required
                    minLength={20}
                    maxLength={2000}
                    placeholder="Explain why you are the right freelancer for this project and how you will approach the work."
                    value={coverLetter}
                    onChange={(e) =>
                      setCoverLetter(e.target.value)
                    }
                    className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Portfolio / Resume / Document
                    <span className="text-gray-500 ml-1">
                      (Optional)
                    </span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="w-full border border-dashed border-gray-700 hover:border-indigo-500 bg-[#0a0f1d] hover:bg-indigo-500/5 rounded-2xl p-5 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>

                      <div className="text-center">
                        {attachmentFile ? (
                          <>
                            <p className="text-sm font-medium text-white truncate max-w-[280px]">
                              {attachmentFile.name}
                            </p>

                            <p className="text-[11px] text-emerald-400 mt-1">
                              File selected successfully
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                              Click to choose a file
                            </p>

                            <p className="text-[11px] text-gray-500 mt-1">
                              PDF, DOC, DOCX, JPG, PNG or ZIP
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedProject(null)
                    }
                    className="px-5 py-2.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Send Proposal
                        <Send size={13} />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // =========================
  // WITHDRAW MODAL
  // =========================
  const withdrawModal = (
    <AnimatePresence>
      {isWithdrawModalOpen && selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Withdraw Payment
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Confirm your withdrawal request.
                </p>
              </div>

              <button
                type="button"
                disabled={!!withdrawingPaymentId}
                onClick={closeWithdrawModal}
                className="p-2 rounded-xl bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#0a0f1d] border border-gray-800 rounded-2xl p-5 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Project
                </p>

                <p className="text-sm font-semibold text-white mt-1">
                  {selectedPayment.project?.title ||
                    "Project Payment"}
                </p>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  Your Amount
                </p>

                <p className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {formatPKR(
                    selectedPayment.freelancerAmount,
                  )}
                </p>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  This is a practice withdrawal. The payment will be
                  marked as withdrawn in the system.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                disabled={!!withdrawingPaymentId}
                onClick={closeWithdrawModal}
                className="flex-1 px-5 py-3 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!!withdrawingPaymentId}
                onClick={() =>
                  handleWithdraw(selectedPayment._id)
                }
                className="flex-1 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {withdrawingPaymentId === selectedPayment._id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Confirm Withdraw
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* HEADER */}
      <header className="border-b border-gray-800/80 bg-[#111827]/90 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>

          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              Workly
            </span>

            <span className="text-xs text-indigo-400 block font-medium">
              Freelancer Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#161f33] px-3 py-1.5 rounded-full border border-gray-800 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online & Ready to Work
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1 space-y-2"
        >
          <div className="bg-[#111827]/70 backdrop-blur-md border border-gray-800/80 rounded-2xl p-4 shadow-xl space-y-1">
            <p className="text-[10px] uppercase font-semibold text-gray-500 px-3 mb-3 tracking-wider">
              Navigation
            </p>

            <button
              onClick={() => setActiveTab("explore")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "explore"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" />
              Explore Projects
            </button>

            <button
              onClick={() => {
                setActiveTab("proposals");
                fetchDashboardData();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "proposals"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Send className="w-4 h-4" />
              My Proposals
            </button>

            <button
              onClick={() => {
                setActiveTab("earnings");
                fetchFreelancerEarnings();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "earnings"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Wallet className="w-4 h-4" />
              Earnings & Payouts
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              Profile & Skills
            </button>
          </div>
        </motion.div>

        {/* CONTENT */}
        <div className="lg:col-span-3">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />

              {error}

              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {loadingData ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* =========================
                  EXPLORE
              ========================= */}
              {activeTab === "explore" && (
                <motion.div
                  key="explore"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Open Projects Market
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Browse open client projects and submit your
                      custom proposal.
                    </p>
                  </div>

                  {openProjects.length === 0 ? (
                    <div className="bg-[#111827]/80 border border-gray-800/90 rounded-2xl p-12 text-center text-gray-400 text-xs">
                      No open projects available right now.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {openProjects.map((project) => (
                        <motion.div
                          key={project._id}
                          whileHover={{ y: -3 }}
                          transition={{ duration: 0.2 }}
                          className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div>
                              <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                                {project.category}
                              </span>

                              <h3 className="text-lg font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                                {project.title}
                              </h3>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="text-xs text-gray-400 block">
                                Project Budget
                              </span>

                              <span className="text-xl font-extrabold text-emerald-400">
                                {formatPKR(project.budget)}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 leading-relaxed mb-6">
                            {project.description}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-800/80">
                            <div className="text-xs text-gray-400">
                              Client:
                              <span className="text-gray-200 font-medium ml-1">
                                {project.client?.firstName}{" "}
                                {project.client?.lastName}
                              </span>
                            </div>

                            <button
                              onClick={() =>
                                setSelectedProject(project)
                              }
                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />

                              Submit Proposal
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* =========================
                  PROPOSALS
              ========================= */}
              {activeTab === "proposals" && (
                <motion.div
                  key="proposals"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      My Submitted Proposals
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Track the status of your bids and client
                      decisions.
                    </p>
                  </div>

                  {myProposals.length === 0 ? (
                    <div className="bg-[#111827]/80 border border-gray-800/90 rounded-2xl p-12 text-center text-gray-400 text-xs">
                      You haven't submitted any proposals yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myProposals.map((prop) => (
                        <motion.div
                          key={prop._id}
                          whileHover={{ y: -2 }}
                          className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-6 shadow-xl space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-white text-sm mb-1">
                                {prop.projectId?.title}
                              </h4>

                              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                                <span>
                                  Bid:
                                  <strong className="text-indigo-400 ml-1">
                                    {formatPKR(
                                      prop.bidAmount,
                                    )}
                                  </strong>
                                </span>

                                <span>
                                  Delivery:
                                  <strong className="text-gray-300 ml-1">
                                    {prop.deliveryTime}
                                  </strong>
                                </span>

                                {prop.attachments?.length > 0 && (
                                  <span className="text-indigo-400 flex items-center gap-1">
                                    <Paperclip size={12} />
                                    Attachment
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              {prop.status === "pending" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending Review
                                </span>
                              )}

                              {prop.status === "accepted" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Accepted (Hired!)
                                </span>
                              )}

                              {prop.status === "completed" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Project Completed
                                </span>
                              )}

                              {prop.status === "rejected" && (
                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Declined
                                </span>
                              )}
                            </div>
                          </div>

                          {prop.status === "accepted" && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-400">
                              <span className="flex items-center gap-2 font-medium">
                                <Phone className="w-3.5 h-3.5" />

                                Client Contact:{" "}
                                {prop.projectId?.client?.firstName}{" "}
                                {prop.projectId?.client?.lastName} —{" "}
                                {prop.projectId?.client?.phone ||
                                  "N/A"}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* =========================
                  EARNINGS
              ========================= */}
              {activeTab === "earnings" && (
                <motion.div
                  key="earnings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-extrabold tracking-tight">
                        Earnings & Payouts
                      </h2>

                      <p className="text-xs text-gray-400 mt-1">
                        Track your paid projects and available
                        withdrawal balance.
                      </p>
                    </div>

                    <button
                      onClick={fetchFreelancerEarnings}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                    >
                      Refresh Earnings
                    </button>
                  </div>

                  {/* SUMMARY CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* TOTAL EARNINGS */}
                    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Total Earnings
                        </span>

                        <DollarSign
                          size={20}
                          className="text-emerald-400"
                        />
                      </div>

                      <div className="text-2xl sm:text-3xl font-extrabold text-white">
                        {formatPKR(
                          earningsDetails.totalEarnings,
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Your net earnings from paid payments.
                      </p>

                      <div className="mt-4 text-[11px] text-gray-500">
                        Platform fee deduction already applied.
                      </div>
                    </div>

                    {/* PAID PROJECTS */}
                    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Paid Projects
                        </span>

                        <CheckCircle2
                          size={20}
                          className="text-indigo-400"
                        />
                      </div>

                      <div className="text-2xl sm:text-3xl font-extrabold text-white">
                        {earningsDetails.totalPaidProjects}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Payments successfully completed by clients.
                      </p>
                    </div>

                    {/* AVAILABLE BALANCE */}
                    <div className="bg-[#111827]/80 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Available Balance
                        </span>

                        <Wallet
                          size={20}
                          className="text-emerald-400"
                        />
                      </div>

                      <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                        {formatPKR(availableBalance)}
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        Paid payments that have not been withdrawn.
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT HISTORY */}
                  <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Payment History
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Your completed SafePay payments.
                        </p>
                      </div>

                      <CreditCard className="w-5 h-5 text-indigo-400" />
                    </div>

                    {earningsDetails.earnings.length === 0 ? (
                      <div className="py-10 text-center border border-dashed border-gray-800 rounded-2xl">
                        <Wallet className="w-8 h-8 text-gray-700 mx-auto mb-3" />

                        <p className="text-xs text-gray-500">
                          No paid payments yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {earningsDetails.earnings.map(
                          (payment) => (
                            <div
                              key={payment._id}
                              className="bg-[#0a0f1d] border border-gray-800 rounded-2xl p-4"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-semibold text-white truncate">
                                      {payment.project?.title ||
                                        "Project Payment"}
                                    </h4>

                                    {payment.withdrawn ? (
                                      <span className="shrink-0 px-2 py-1 rounded-full bg-gray-700/50 border border-gray-700 text-gray-400 text-[10px] font-medium">
                                        Withdrawn
                                      </span>
                                    ) : (
                                      <span className="shrink-0 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
                                        Available
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 flex-wrap text-[11px] text-gray-500">
                                    <span>
                                      Paid:{" "}
                                      {payment.createdAt
                                        ? new Date(
                                            payment.createdAt,
                                          ).toLocaleDateString(
                                            "en-PK",
                                            {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                            },
                                          )
                                        : "N/A"}
                                    </span>

                                    <span className="text-gray-700">
                                      •
                                    </span>

                                    <span>
                                      Payment ID:{" "}
                                      {payment._id
                                        ? payment._id
                                            .toString()
                                            .slice(-8)
                                        : "N/A"}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-4">
                                  <div className="text-left lg:text-right">
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500">
                                      You Receive
                                    </p>

                                    <p className="text-base font-bold text-emerald-400">
                                      {formatPKR(
                                        payment.freelancerAmount,
                                      )}
                                    </p>
                                  </div>

                                  {!payment.withdrawn && (
                                    <button
                                      onClick={() =>
                                        openWithdrawModal(
                                          payment,
                                        )
                                      }
                                      disabled={
                                        withdrawingPaymentId ===
                                        payment._id
                                      }
                                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
                                    >
                                      <Wallet className="w-3.5 h-3.5" />

                                      Withdraw
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* PENDING PAYMENTS */}
                  <div className="bg-[#111827]/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-5">
                      <Clock className="w-5 h-5 text-amber-400" />

                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Pending Payments
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Accepted projects where the client has not
                          paid yet.
                        </p>
                      </div>
                    </div>

                    {earningsDetails.pendingPayments.length ===
                    0 ? (
                      <div className="py-8 text-center border border-dashed border-gray-800 rounded-2xl">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500/50 mx-auto mb-2" />

                        <p className="text-xs text-gray-500">
                          No pending payments.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {earningsDetails.pendingPayments.map(
                          (proposal) => (
                            <div
                              key={proposal._id}
                              className="bg-[#0a0f1d] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div>
                                <h4 className="text-sm font-semibold text-white">
                                  {proposal.projectId?.title ||
                                    "Accepted Project"}
                                </h4>

                                <p className="text-[11px] text-gray-500 mt-1">
                                  Proposal accepted — waiting for
                                  client payment.
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                                  Expected Bid
                                </p>

                                <p className="text-sm font-bold text-amber-400">
                                  {formatPKR(
                                    proposal.bidAmount,
                                  )}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* =========================
                  PROFILE
              ========================= */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Profile & Skills
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Manage your professional summary and skills.
                    </p>
                  </div>

                  <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-8 shadow-xl space-y-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Profile Summary
                      </label>

                      <textarea
                        rows={4}
                        value={summaryInput}
                        onChange={(e) =>
                          setSummaryInput(e.target.value)
                        }
                        className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Skills (comma separated)
                      </label>

                      <input
                        type="text"
                        value={skillsInput}
                        onChange={(e) =>
                          setSkillsInput(e.target.value)
                        }
                        className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-3 px-6 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
                    >
                      {isSavingProfile
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* PORTALS */}
      {mounted &&
        createPortal(
          <>
            {proposalModal}
            {withdrawModal}
          </>,
          document.body,
        )}
    </div>
  );
}
