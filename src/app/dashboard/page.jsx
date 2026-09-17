"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Layers,
  CheckCircle2,
  Phone,
  LogOut,
  FileText,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ClientDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProjectForProposals, setSelectedProjectForProposals] =
    useState(null);

  const [myProjects, setMyProjects] = useState([]);
  const [projectProposals, setProjectProposals] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // =========================
  // PAYMENT STATES
  // =========================

  const [payingId, setPayingId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState({});

  // =========================
  // PROJECT FORM STATES
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [deliveryTime, setDeliveryTime] = useState("1 to 4 months");

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
  // CLIENT AUTH PROTECTION
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.role !== "client") {
        router.replace("/");
        return;
      }

      fetchClientProjects();
    } catch (error) {
      console.error("Auth check failed:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.replace("/login");
    }
  }, [router]);

  // =========================
  // RESUME PAYMENT POLLING (SafePay se wapas aane ke baad)
  // =========================

  useEffect(() => {
    const pendingPaymentId = localStorage.getItem("pendingPaymentId");
    const pendingProposalId = localStorage.getItem("pendingProposalId");

    if (pendingPaymentId && pendingProposalId) {
      pollPaymentStatus(pendingPaymentId, pendingProposalId);
    }
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  // =========================
  // FETCH CLIENT PROJECTS
  // =========================

  const fetchClientProjects = async () => {
    try {
      setLoadingProjects(true);

      const res = await fetch("/api/dashboard/projects", {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (res.ok) {
        setMyProjects(data.projects || data);
      } else {
        setError(data.message || "Failed to fetch projects from database.");
      }
    } catch (err) {
      setError("Network error connecting to backend API.");
    } finally {
      setLoadingProjects(false);
    }
  };

  // =========================
  // VIEW PROJECT PROPOSALS
  // =========================

  const handleViewProposals = async (project) => {
    setSelectedProjectForProposals(project);

    try {
      setLoadingProposals(true);

      const res = await fetch(
        `/api/dashboard/projects/${project._id}/proposals`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProjectProposals(data.proposals || data);
      } else {
        setError(data.message || "Failed to fetch proposals.");
      }
    } catch (err) {
      setError("Failed to load proposals.");
    } finally {
      setLoadingProposals(false);
    }
  };

  // =========================
  // CREATE PROJECT
  // =========================

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError(null);

    const budgetNumber = Number(budget);

    if (!budgetNumber || budgetNumber < 1) {
      setError("Budget kam se kam Rs 1 hona chahiye.");
      return;
    }

    setIsSubmitting(true);

    const skillsArray = skillsRequired
      ? skillsRequired.split(",").map((s) => s.trim())
      : [];

    try {
      const res = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          description,
          budget: budgetNumber,
          category,
          skillsRequired: skillsArray,
          experienceLevel,
          deliveryTime,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMyProjects((prev) => [data.project || data, ...prev]);

        setActiveTab("projects");

        setTitle("");
        setDescription("");
        setBudget("");
        setCategory("");
        setSkillsRequired("");
      } else {
        setError(data.message || "Failed to post project to database.");
      }
    } catch (err) {
      setError("Server connection failed while posting project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // UPDATE PROPOSAL STATUS
  // =========================

  // const handleUpdateProposalStatus = async (proposalId, newStatus) => {
  //   try {
  //     const res = await fetch(`/api/dashboard/proposals/${proposalId}`, {
  //       method: "PATCH",
  //       headers: getAuthHeaders(),
  //       body: JSON.stringify({
  //         status: newStatus,
  //       }),
  //     });

  //     if (res.ok) {
  //       setProjectProposals((prev) =>
  //         prev.map((p) =>
  //           p._id === proposalId ? { ...p, status: newStatus } : p
  //         )
  //       );

  //       alert(`Proposal successfully ${newStatus}!`);
  //     } else {
  //       const data = await res.json();

  //       alert(data.message || "Failed to update proposal status.");
  //     }
  //   } catch (err) {
  //     alert("Error connecting to backend API.");
  //   }
  // };
// UPDATE PROPOSAL STATUS
  const handleUpdateProposalStatus = async (proposalId, newStatus) => {
    try {
      const res = await fetch(`/api/dashboard/proposals/${proposalId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (res.ok) {
        setProjectProposals((prev) =>
          prev.map((p) =>
            p._id === proposalId ? { ...p, status: newStatus } : p
          )
        );

        // 👇 YEH LINE ADD KAR DE TAAKI PROJECT KA STATUS BHI FORAN UPDATE HO JAYE
        if (newStatus === "accepted" && selectedProjectForProposals) {
          setSelectedProjectForProposals((prev) => ({
            ...prev,
            status: "in progress",
          }));
        }

        alert(`Proposal successfully ${newStatus}!`);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update proposal status.");
      }
    } catch (err) {
      alert("Error connecting to backend API.");
    }
  };
  // =========================
  // MARK PROJECT COMPLETED
  // =========================

  const handleMarkCompleted = async (projectId) => {
    if (!confirm("Mark this project as completed?")) return;

    try {
      const res = await fetch(`/api/dashboard/projects/${projectId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (res.ok) {
        setSelectedProjectForProposals((prev) =>
          prev ? { ...prev, status: "completed" } : prev
        );

        setMyProjects((prev) =>
          prev.map((p) =>
            p._id === projectId ? { ...p, status: "completed" } : p
          )
        );

        alert("Project marked as completed!");
      } else {
        alert(data.message || "Failed to mark project as completed.");
      }
    } catch (err) {
      alert("Error connecting to backend API.");
    }
  };

  // =========================
  // PAY NOW (proposal ke liye)
  // =========================

  const handlePayNow = async (proposalId) => {
    setPayingId(proposalId);

    try {
      const res = await fetch("/api/dashboard/payments/create", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ proposalId }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("pendingPaymentId", data.paymentId);
        localStorage.setItem("pendingProposalId", proposalId);
        window.location.href = data.checkoutUrl;
      }
      else if (data.error === "Already paid") {
      // backend confirm kar raha hai payment ho chuki hai — UI update kar do
      setPaymentStatus((prev) => ({ ...prev, [proposalId]: "paid" }));
      setPayingId(null);
      }
      else {
        alert(data.error || "Payment start nahi ho saka.");
        setPayingId(null);
      }
    } catch (err) {
      alert("Network error — payment shuru nahi ho saka.");
      setPayingId(null);
    }
  };

  // =========================
  // POLL PAYMENT STATUS
  // =========================

  const pollPaymentStatus = async (paymentId, proposalId) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/dashboard/payments/status/${paymentId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();

        if (data.status && data.status !== "pending") {
          setPaymentStatus((prev) => ({ ...prev, [proposalId]: data.status }));
          clearInterval(interval);
          localStorage.removeItem("pendingPaymentId");
          localStorage.removeItem("pendingProposalId");
        }
      } catch {
        // agli interval me dobara try hoga
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* =========================
          HEADER
      ========================= */}

      <header className="border-b border-gray-800/80 bg-[#111827]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Briefcase className="w-5 h-5" />
          </div>

          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              Workly
            </span>

            <span className="text-xs text-indigo-400 block font-medium">
              Client Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-[#161f33] px-3 py-1.5 rounded-full border border-gray-800 text-xs text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Database Synced
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <div className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SIDEBAR */}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-1 space-y-2"
        >
          <div className="bg-[#111827]/70 backdrop-blur-md border border-gray-800/80 rounded-2xl p-4 shadow-xl">
            <p className="text-[10px] uppercase font-semibold text-gray-500 px-3 mb-3 tracking-wider">
              Client Menu
            </p>

            <button
              onClick={() => {
                setActiveTab("projects");
                setSelectedProjectForProposals(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "projects" && !selectedProjectForProposals
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Layers className="w-4 h-4" />
              My Posted Projects
            </button>

            <button
              onClick={() => setActiveTab("post-project")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mt-1 ${
                activeTab === "post-project"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              }`}
            >
              <Plus className="w-4 h-4" />
              Post New Project
            </button>
          </div>
        </motion.div>

        {/* =========================
            CONTENT
        ========================= */}

        <div className="lg:col-span-3">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* =========================
                PROJECTS
            ========================= */}

            {activeTab === "projects" && !selectedProjectForProposals && (
              <motion.div
                key="projects-list"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                      Your Posted Projects
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Fetched directly from your database backend models.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("post-project")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 w-fit"
                  >
                    <Plus className="w-4 h-4" />
                    Post Project
                  </button>
                </div>

                {loadingProjects ? (
                  <div className="py-20 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                ) : myProjects.length === 0 ? (
                  <div className="bg-[#111827]/80 border border-gray-800/90 rounded-2xl p-12 text-center text-gray-400 text-xs">
                    No projects found in the database. Click "Post Project" to
                    create one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {myProjects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                                {project.category}
                              </span>

                              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
                                {project.status}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
                              {project.title}
                            </h3>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-xs text-gray-400 block">
                              Budget
                            </span>

                            <span className="text-xl font-extrabold text-emerald-400">
                              Rs {Number(project.budget).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {project.skillsRequired &&
                          project.skillsRequired.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                              <span className="text-[10px] text-gray-500">
                                Skills:
                              </span>

                              {project.skillsRequired.map((skill, index) => (
                                <span
                                  key={index}
                                  className="text-[10px] bg-gray-800/80 text-gray-300 px-2 py-0.5 rounded-md border border-gray-700"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-800/80">
                          <div className="text-xs text-gray-400">
                            Experience:{" "}
                            <span className="text-gray-200 font-medium capitalize">
                              {project.experienceLevel}
                            </span>
                          </div>

                          <button
                            onClick={() => handleViewProposals(project)}
                            className="bg-[#161f33] hover:bg-gray-800 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Proposals
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* =========================
                PROPOSALS
            ========================= */}

            {activeTab === "projects" && selectedProjectForProposals && (
              <motion.div
                key="project-proposals"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <button
                    onClick={() => setSelectedProjectForProposals(null)}
                    className="text-xs text-indigo-400 hover:underline mb-2 block"
                  >
                    ← Back to all projects
                  </button>

                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Proposals for "{selectedProjectForProposals.title}"
                  </h2>

                  {selectedProjectForProposals.status === "in progress" && (
                    <button
                      onClick={() =>
                        handleMarkCompleted(selectedProjectForProposals._id)
                      }
                      className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 w-fit"
                    >
                      ✅ Mark Project as Completed
                    </button>
                  )}

                  {selectedProjectForProposals.status === "completed" && (
                    <span className="mt-3 inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-semibold">
                      Project Completed
                    </span>
                  )}
                </div>

                {loadingProposals ? (
                  <div className="py-20 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                ) : projectProposals.length === 0 ? (
                  <div className="bg-[#111827]/80 border border-gray-800/90 rounded-2xl p-12 text-center text-gray-400 text-xs">
                    No proposals submitted for this project yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectProposals.map((prop) => (
                      <div
                        key={prop._id}
                        className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-6 shadow-xl space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                              {prop.freelancerId?.firstName?.[0] || "F"}
                            </div>

                            <div>
                              <h4 className="font-bold text-white text-sm">
                                {prop.freelancerId?.firstName}{" "}
                                {prop.freelancerId?.lastName}
                              </h4>

                              <p className="text-xs text-gray-400">
                                {prop.freelancerId?.email}
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-xs text-gray-400 block">
                              Bid Amount
                            </span>

                            <span className="text-lg font-extrabold text-indigo-400">
                              Rs {Number(prop.bidAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-300 mb-1">
                            Cover Letter:
                          </p>

                          <p className="text-xs text-gray-400 bg-[#0a0f1d] p-3 rounded-xl border border-gray-800 leading-relaxed">
                            {prop.coverLetter}
                          </p>
                        </div>
                        {/* ✅ Yahan condition mein "completed" bhi add kar diya hai */}
{(prop.status === "accepted" || prop.status === "completed") && (
  <>
    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-400">
      <span className="flex items-center gap-2 font-medium">
        <Phone className="w-3.5 h-3.5" />
        Direct Contact: {prop.freelancerId?.phone || "Available"}
      </span>

      <span className="bg-emerald-500 text-black px-2 py-0.5 rounded font-bold text-[10px]">
        HIRED
      </span>
    </div>

    <div className="bg-[#0a0f1d] border border-gray-800/80 p-3 rounded-xl flex items-center justify-between text-xs mt-3">
      <span className="text-gray-400">
        Amount to pay:{" "}
        <strong className="text-white">
          Rs {Number(prop.bidAmount).toLocaleString()}
        </strong>
      </span>

      {paymentStatus[prop._id] === "paid" ? (
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          Paid
        </span>
      ) : (
        <button
          onClick={() => handlePayNow(prop._id)}
          disabled={payingId === prop._id}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          {payingId === prop._id ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CreditCard className="w-3.5 h-3.5" />
          )}
          {payingId === prop._id ? "Redirecting..." : "Pay Now"}
        </button>
      )}
    </div>
  </>
)}
                        {/* {prop.status === "accepted" && (
                          <>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-400">
                              <span className="flex items-center gap-2 font-medium">
                                <Phone className="w-3.5 h-3.5" />
                                Direct Contact:{" "}
                                {prop.freelancerId?.phone || "Available"}
                              </span>

                              <span className="bg-emerald-500 text-black px-2 py-0.5 rounded font-bold text-[10px]">
                                HIRED
                              </span>
                            </div>

                            <div className="bg-[#0a0f1d] border border-gray-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
                              <span className="text-gray-400">
                                Amount to pay:{" "}
                                <strong className="text-white">
                                  Rs {Number(prop.bidAmount).toLocaleString()}
                                </strong>
                              </span>

                              {paymentStatus[prop._id] === "paid" ? (
                                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Paid
                                </span>
                              ) : (
                                <button
                                  onClick={() => handlePayNow(prop._id)}
                                  disabled={payingId === prop._id}
                                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                                >
                                  {payingId === prop._id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CreditCard className="w-3.5 h-3.5" />
                                  )}
                                  {payingId === prop._id
                                    ? "Redirecting..."
                                    : "Pay Now"}
                                </button>
                              )}
                            </div>
                          </>
                        )} */}

                        {/* <div className="flex items-center justify-between pt-2">
                          <span className="text-xs text-gray-400">
                            Delivery Time:{" "}
                            <strong className="text-gray-200">
                              {prop.deliveryTime}
                            </strong>
                          </span>

                          <div className="flex items-center gap-2">
                            {prop.status !== "accepted" ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateProposalStatus(
                                      prop._id,
                                      "rejected"
                                    )
                                  }
                                  className="px-4 py-2 rounded-xl text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
                                >
                                  Reject
                                </button>

                                <button
                                  onClick={() =>
                                    handleUpdateProposalStatus(
                                      prop._id,
                                      "accepted"
                                    )
                                  }
                                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
                                >
                                  Accept & Hire
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                Accepted
                              </span>
                            )}
                          </div>
                        </div> */}
                        {/* Naya code jo sabhi statuses (pending, accepted, completed, rejected) ko properly handle karega */}
<div className="flex items-center justify-between pt-2">
  <span className="text-xs text-gray-400">
    Delivery Time:{" "}
    <strong className="text-gray-200">
      {prop.deliveryTime}
    </strong>
  </span>

  <div className="flex items-center gap-2">
    {prop.status === "pending" ? (
      <>
        <button
          onClick={() =>
            handleUpdateProposalStatus(
              prop._id,
              "rejected"
            )
          }
          className="px-4 py-2 rounded-xl text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
        >
          Reject
        </button>
        <button
          onClick={() =>
            handleUpdateProposalStatus(
              prop._id,
              "accepted"
            )
          }
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
        >
          Accept & Hire
        </button>
      </>
    ) : (
      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 capitalize">
        <CheckCircle2 className="w-4 h-4" />
        {prop.status}
      </span>
    )}
  </div>
</div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* =========================
                POST PROJECT
            ========================= */}

            {activeTab === "post-project" && (
              <motion.div
                key="post-project-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Post a New Project
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    Submit your requirements directly to your backend
                    database schema.
                  </p>
                </div>

                <form
                  onSubmit={handleCreateProject}
                  className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800/90 rounded-2xl p-8 shadow-xl space-y-5"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Project Title
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="e.g. MERN Stack E-Commerce App"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Category
                      </label>

                      <input
                        type="text"
                        required
                        placeholder="e.g. Full Stack"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Budget (Rs)
                      </label>

                      <input
                        type="number"
                        required
                        min="1"
                        step="1"
                        placeholder="e.g. 50000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Skills Required (Comma Separated)
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
                      value={skillsRequired}
                      onChange={(e) => setSkillsRequired(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Experience Level
                      </label>

                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2">
                        Delivery Time
                      </label>

                      <input
                        type="text"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Project Description
                    </label>

                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your project requirements..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3.5 rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Publish Project"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}