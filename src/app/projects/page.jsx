"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  ArrowRight,
  Plus,
  User,
  RefreshCw,
} from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Web Development",
  "Mobile Development",
  "Software Development",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Graphic Design",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Analysis",
  "Cybersecurity",
  "Blockchain & Web3",
  "DevOps & Cloud",
  "Database Development",
  "Game Development",
  "QA & Testing",
  "Digital Marketing",
  "SEO",
  "Content Writing",
  "Copywriting",
  "Video & Animation",
  "Business & Consulting",
  "Virtual Assistant",
  "Translation",
  "Other",
];

export default function ProjectsMarketplace() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // GET ALL PROJECTS
  // =========================
 const fetchProjects = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch("/api/projects", {
      method: "GET",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Failed to fetch projects"
      );
    }

    setProjects(
      Array.isArray(data.projects)
        ? data.projects
        : []
    );
  } catch (error) {
    console.error("Get Projects Error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // SEARCH + CATEGORY FILTER
  // =========================
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        project.title?.toLowerCase().includes(searchText) ||
        project.description
          ?.toLowerCase()
          .includes(searchText) ||
        project.category
          ?.toLowerCase()
          .includes(searchText) ||
        project.skillsRequired?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesCategory =
        selectedCategory === "All Categories" ||
        project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, selectedCategory]);

  // =========================
  // FORMAT PKR
  // =========================
  const formatPKR = (amount) => {
    if (!amount && amount !== 0) {
      return "PKR 0";
    }

    return `PKR ${Number(amount).toLocaleString("en-PK")}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-12 px-6 md:px-16">

      {/* =========================
          HEADER
      ========================= */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mb-10"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Explore{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>

            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              Discover projects posted by clients and find
              opportunities that match your skills and expertise.
            </p>
          </div>

          {/* CREATE PROJECT BUTTON */}
          <Link
            href="/projects/create"
            className="inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 text-sm"
          >
            <Plus size={18} />
            Post a Project
          </Link>

        </div>
      </motion.div>

      {/* =========================
          SEARCH + FILTER
      ========================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto mb-10 grid grid-cols-1 lg:grid-cols-4 gap-4"
      >

        {/* SEARCH */}
        <div className="lg:col-span-3 bg-[#131B2E] border border-slate-800 rounded-2xl p-2 flex items-center shadow-lg">

          <Search
            className="text-slate-400 ml-3 flex-shrink-0"
            size={20}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, skills, or categories..."
            className="w-full bg-transparent px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-slate-400 hover:text-white px-3"
            >
              Clear
            </button>
          )}

        </div>

        {/* CATEGORY */}
        <div className="bg-[#131B2E] border border-slate-800 rounded-2xl px-4 py-2 flex items-center gap-3">

          <Filter
            size={16}
            className="text-cyan-400 flex-shrink-0"
          />

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
            className="w-full bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer"
          >
            {CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
                className="bg-[#131B2E]"
              >
                {category}
              </option>
            ))}
          </select>

        </div>
      </motion.div>

      {/* =========================
          PROJECT COUNT
      ========================= */}
      <div className="max-w-7xl mx-auto mb-5 flex items-center justify-between">

        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="text-white font-semibold">
            {filteredProjects.length}
          </span>{" "}
          project
          {filteredProjects.length !== 1 ? "s" : ""}
        </p>

        <button
          onClick={fetchProjects}
          disabled={loading}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>

      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* =========================
          LOADING
      ========================= */}
      {loading && (
        <div className="max-w-7xl mx-auto space-y-5">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-[#131B2E] border border-slate-800 rounded-2xl p-7 animate-pulse"
            >
              <div className="h-4 bg-slate-800 rounded w-32 mb-5" />
              <div className="h-6 bg-slate-800 rounded w-2/3 mb-4" />
              <div className="h-4 bg-slate-800 rounded w-full mb-2" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
            </div>
          ))}

        </div>
      )}

      {/* =========================
          NO PROJECTS
      ========================= */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#131B2E] border border-slate-800 rounded-2xl py-20 text-center">

            <Briefcase
              size={45}
              className="mx-auto text-slate-600 mb-5"
            />

            <h3 className="text-xl font-bold text-white mb-2">
              No Projects Found
            </h3>

            <p className="text-sm text-slate-500 mb-6">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All Categories");
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl text-sm transition"
            >
              Clear Filters
            </button>

          </div>
        </div>
      )}

      {/* =========================
          PROJECT LIST
      ========================= */}
      {!loading && filteredProjects.length > 0 && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5">

          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              whileHover={{
                y: -3,
              }}
              className="bg-[#131B2E] border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-6 md:p-8 shadow-xl transition-all"
            >

              <div className="flex flex-col lg:flex-row justify-between gap-7">

                {/* =========================
                    LEFT CONTENT
                ========================= */}
                <div className="flex-1">

                  {/* CATEGORY + STATUS */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">

                    <span className="text-[10px] bg-cyan-950/70 text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded-md font-semibold uppercase tracking-wider">
                      {project.category}
                    </span>

                    <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 px-2.5 py-1 rounded-md font-semibold uppercase">
                      Open
                    </span>

                  </div>

                  {/* TITLE */}
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {project.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-slate-400 leading-relaxed max-w-4xl line-clamp-3 mb-5">
                    {project.description}
                  </p>

                  {/* =========================
                      SKILLS
                  ========================= */}
                  {project.skillsRequired?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">

                      {project.skillsRequired.map(
                        (skill, skillIndex) => (
                          <span
                            key={`${skill}-${skillIndex}`}
                            className="text-[11px] bg-slate-800/80 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>
                  )}

                  {/* CLIENT */}
                  {project.client && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">

                      <User size={14} />

                      <span>
                        Posted by{" "}
                        <span className="text-slate-300">
                          {project.client.firstName || ""}{" "}
                          {project.client.lastName || ""}
                        </span>
                      </span>

                    </div>
                  )}

                </div>

                {/* =========================
                    RIGHT SIDE
                ========================= */}
                <div className="lg:w-[230px] flex flex-col justify-between lg:items-end gap-6 border-t lg:border-t-0 lg:border-l border-slate-800 pt-5 lg:pt-0 lg:pl-7">

                  <div className="lg:text-right">

                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                      Project Budget
                    </p>

                    <p className="text-xl md:text-2xl font-extrabold text-white">
                      {formatPKR(project.budget)}
                    </p>

                    <div className="flex lg:justify-end items-center gap-2 mt-2 text-xs text-slate-400">

                      <Clock
                        size={13}
                        className="text-cyan-400"
                      />

                      <span>
                        {project.deliveryTime ||
                          "1 to 4 months"}
                      </span>

                    </div>

                  </div>

                  {/* VIEW PROJECT */}
                  <Link
                    href={`/projects/${project._id}`}
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 font-semibold text-xs px-5 py-3 rounded-xl border border-cyan-500/30 transition-all duration-300"
                  >
                    View Project
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                </div>

              </div>

            </motion.div>
          ))}

        </div>
      )}

    </div>
  );
}