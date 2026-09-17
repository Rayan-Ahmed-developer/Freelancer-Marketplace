// 'use client';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Search, ArrowRight, Code, Cpu, Sparkles } from 'lucide-react';

// export default function HeroSection() {
//   return (
//     <div className="flex flex-col items-center overflow-hidden">
      
//       {/* --- HERO SECTION WITH ANIMATIONS --- */}
//       <section className="w-full py-24 px-6 text-center relative overflow-hidden bg-gradient-to-b from-[#0B0F19] via-[#0E1626] to-[#0B0F19]">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)] pointer-events-none"></div>
        
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="max-w-4xl mx-auto relative z-10"
//         >
//           {/* Top Badge */}
//           <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-medium mb-6 shadow-inner">
//             <Sparkles size={14} />
//             <span>Next-Gen Enterprise Marketplace</span>
//           </div>

//           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
//             Find Freelance Work. <br />
//             <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
//               Hire Skilled Developers.
//             </span>
//           </h1>
//           <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
//             The elite platform for high-stakes freelance engagements. Connect with top-tier talent and visionary enterprises seamlessly.
//           </p>

//           {/* Search Bar Widget with Hover Glow */}
//           <motion.div 
//             whileHover={{ scale: 1.01 }}
//             className="max-w-2xl mx-auto bg-[#131B2E] p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center mb-6 transition-all focus-within:border-cyan-500"
//           >
//             <div className="pl-4 text-slate-400">
//               <Search size={20} />
//             </div>
//             <input 
//               type="text" 
//               placeholder="Search skills, projects, or experts..." 
//               className="w-full bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
//             />
//             <Link 
//               href="/projects"
//               className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition duration-300 text-sm shadow-lg shadow-cyan-500/20"
//             >
//               Search
//             </Link>
//           </motion.div>

//           {/* Pill Tags */}
//           <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-400 mb-12">
//             <span className="text-slate-500">Popular:</span>
//             {['React', 'Next.js', 'UI/UX', 'Solidity', 'Full-Stack'].map((tag) => (
//               <motion.span 
//                 key={tag} 
//                 whileHover={{ scale: 1.05, borderColor: '#06b6d4' }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 cursor-pointer transition text-slate-300"
//               >
//                 {tag}
//               </motion.span>
//             ))}
//           </div>

//           {/* Dual Action CTA */}
//           <div className="flex justify-center space-x-4">
//             <Link href="/projects" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium px-8 py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
//               Find Work
//             </Link>
//             <Link href="/projects/create" className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-3.5 rounded-xl border border-slate-700 transition">
//               Post a Project
//             </Link>
//           </div>
//         </motion.div>

//         {/* Stats Metrics Bar */}
//         <motion.div 
//           initial={{ opacity: 0, y: 40 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.7, delay: 0.2 }}
//           className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 px-4"
//         >
//           {[
//             { label: 'Active Projects', value: '10K+' },
//             { label: 'Success Rate', value: '98%' },
//             { label: 'Paid to Talent', value: '$50M+' },
//             { label: 'Enterprise Support', value: '24/7' },
//           ].map((stat, i) => (
//             <div key={i} className="bg-[#111827]/80 backdrop-blur border border-slate-800/80 p-6 rounded-2xl text-center shadow-lg hover:border-slate-700 transition">
//               <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</h3>
//               <p className="text-xs md:text-sm text-slate-400">{stat.label}</p>
//             </div>
//           ))}
//         </motion.div>
//       </section>

//       {/* --- EXPLORE EXPERTISE SECTION --- */}
//       <section className="w-full max-w-7xl px-6 py-16">
//         <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Explore Expertise</h2>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <motion.div 
//             whileHover={{ y: -4 }}
//             className="lg:col-span-2 bg-gradient-to-br from-[#131B2E] to-[#0D1322] border border-slate-800 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/50 transition shadow-xl"
//           >
//             <div className="relative z-10 mb-12">
//               <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">Featured Category</span>
//               <h3 className="text-2xl font-bold text-white mt-1">Web Development</h3>
//               <p className="text-sm text-slate-400 mt-2">Full-stack, Frontend, Backend architecture for scalable enterprise applications.</p>
//             </div>
//             <Link href="/projects" className="relative z-15 inline-flex items-center text-cyan-400 text-sm font-semibold hover:underline group-hover:translate-x-1 transition-transform">
//               Explore Category <ArrowRight size={16} className="ml-2" />
//             </Link>
//           </motion.div>

//           <div className="flex flex-col gap-6">
//             <motion.div whileHover={{ y: -4 }} className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition shadow-lg">
//               <Code className="text-cyan-400 mb-3" size={24} />
//               <h3 className="text-lg font-bold text-white">UI/UX Design</h3>
//               <p className="text-xs text-slate-400 mt-1">Product Design, Prototyping, Design Systems.</p>
//             </motion.div>
//             <motion.div whileHover={{ y: -4 }} className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition shadow-lg">
//               <Cpu className="text-cyan-400 mb-3" size={24} />
//               <h3 className="text-lg font-bold text-white">Data Science</h3>
//               <p className="text-xs text-slate-400 mt-1">Machine Learning, Analytics, Predictive Models.</p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* --- TRENDING PROJECTS SECTION --- */}
//       <section className="w-full max-w-7xl px-6 py-12 mb-10">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl md:text-3xl font-bold text-white">Trending Projects</h2>
//           <Link href="/projects" className="text-cyan-400 text-sm font-semibold hover:underline">View All</Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {[
//             {
//               title: 'Build a Decentralized Exchange (DEX) Frontend',
//               badge: 'Verified Enterprise',
//               desc: 'Seeking a senior React developer with Web3 experience to build a high-performance trading interface.',
//               skills: ['React', 'Web3', 'Tailwind'],
//               budget: '$15,000 - $25,000'
//             },
//             {
//               title: 'Refactor Legacy Fintech Dashboard',
//               badge: 'Urgent',
//               desc: 'Need an expert to migrate an outdated dashboard to Next.js 14. Focus on performance optimization.',
//               skills: ['Next.js', 'TypeScript', 'Jest'],
//               budget: '$80 - $120 / hr'
//             },
//             {
//               title: 'AI-Powered Content Generation Microservice',
//               badge: 'Verified Startup',
//               desc: 'Building a backend service to integrate OpenAI API for automated marketing copy. Python/FastAPI required.',
//               skills: ['Python', 'FastAPI', 'OpenAI'],
//               budget: '$5,000'
//             }
//           ].map((proj, i) => (
//             <motion.div 
//               key={i}
//               whileHover={{ y: -6 }}
//               transition={{ duration: 0.2 }}
//               className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition shadow-xl"
//             >
//               <div>
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded-md font-medium">{proj.badge}</span>
//                 </div>
//                 <h3 className="text-base font-bold text-white mb-2">{proj.title}</h3>
//                 <p className="text-xs text-slate-400 mb-4 line-clamp-2">{proj.desc}</p>
//                 <div className="flex flex-wrap gap-1.5 mb-6">
//                   {proj.skills.map(s => (
//                     <span key={s} className="text-[11px] bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700/50">{s}</span>
//                   ))}
//                 </div>
//               </div>
//               <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center">
//                 <span className="text-sm font-semibold text-white">{proj.budget}</span>
//                 <Link href="/projects/1" className="text-xs text-cyan-400 font-medium hover:underline flex items-center">
//                   View Project <ArrowRight size={12} className="ml-1" />
//                 </Link>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  Code,
  Cpu,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function HeroSection() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ==========================================
  // GET PROJECTS FROM DATABASE
  // ==========================================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectError("");

        const response = await fetch("/api/projects", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch projects"
          );
        }

        setProjects(data.projects || []);
      } catch (error) {
        console.error("Get Projects Error:", error);
        setProjectError(error.message);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // ==========================================
  // CATEGORIES FROM DATABASE
  // ==========================================
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        projects
          .map((project) => project.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [projects]);

  // ==========================================
  // SEARCH SUGGESTIONS
  // ==========================================
  const suggestions = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return projects
      .filter((project) => {
        const title =
          project.title?.toLowerCase() || "";

        const category =
          project.category?.toLowerCase() || "";

        const description =
          project.description?.toLowerCase() || "";

        const skills =
          project.skillsRequired
            ?.join(" ")
            .toLowerCase() || "";

        return (
          title.includes(value) ||
          category.includes(value) ||
          description.includes(value) ||
          skills.includes(value)
        );
      })
      .slice(0, 5);
  }, [search, projects]);

  // ==========================================
  // FILTER PROJECTS
  // ==========================================
  const filteredProjects = useMemo(() => {
    const value = search.trim().toLowerCase();

    return projects.filter((project) => {
      // Category filter
      const categoryMatch =
        selectedCategory === "All" ||
        project.category === selectedCategory;

      // Search filter
      if (!value) {
        return categoryMatch;
      }

      const title =
        project.title?.toLowerCase() || "";

      const description =
        project.description?.toLowerCase() || "";

      const category =
        project.category?.toLowerCase() || "";

      const skills =
        project.skillsRequired
          ?.join(" ")
          .toLowerCase() || "";

      const searchMatch =
        title.includes(value) ||
        description.includes(value) ||
        category.includes(value) ||
        skills.includes(value);

      return categoryMatch && searchMatch;
    });
  }, [projects, search, selectedCategory]);

  // ==========================================
  // SELECT SEARCH SUGGESTION
  // ==========================================
  const handleSuggestionClick = (project) => {
    setSearch(project.title);
    setShowSuggestions(false);
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================
  const clearSearch = () => {
    setSearch("");
    setShowSuggestions(false);
  };

  // ==========================================
  // FORMAT BUDGET
  // ==========================================
  const formatBudget = (budget) => {
    if (
      budget === undefined ||
      budget === null
    ) {
      return "Budget not specified";
    }

    return `PKR ${Number(budget).toLocaleString(
      "en-PK"
    )}`;
  };

  return (
    <div className="flex flex-col items-center overflow-hidden">

      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="w-full py-24 px-6 text-center relative overflow-hidden bg-gradient-to-b from-[#0B0F19] via-[#0E1626] to-[#0B0F19]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="max-w-4xl mx-auto relative z-10"
        >

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-medium mb-6 shadow-inner">
            <Sparkles size={14} />
            <span>
              Next-Gen Enterprise Marketplace
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Find Freelance Work. <br />

            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Hire Skilled Developers.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            The elite platform for high-stakes freelance
            engagements. Connect with top-tier talent and
            visionary enterprises seamlessly.
          </p>

          {/* ==========================================
              SEARCH BAR
          ========================================== */}
          <div className="relative max-w-2xl mx-auto">

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-[#131B2E] p-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center mb-6 transition-all focus-within:border-cyan-500"
            >

              <div className="pl-4 text-slate-400">
                <Search size={20} />
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(
                    e.target.value.trim().length > 0
                  );
                }}
                onFocus={() => {
                  if (search.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="Search skills, projects, or experts..."
                className="w-full bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
              />

              {/* Clear */}
              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-slate-500 hover:text-white mr-2 cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}

              <Link
                href="/projects"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition duration-300 text-sm shadow-lg shadow-cyan-500/20"
              >
                Search
              </Link>
            </motion.div>

            {/* ==========================================
                SEARCH SUGGESTIONS
            ========================================== */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-[68px] z-50 bg-[#131B2E] border border-slate-700 rounded-xl shadow-2xl overflow-hidden text-left">

                {suggestions.length > 0 ? (
                  suggestions.map((project) => (
                    <button
                      key={project._id}
                      type="button"
                      onClick={() =>
                        handleSuggestionClick(project)
                      }
                      className="w-full px-4 py-3 hover:bg-slate-800 transition text-left border-b border-slate-800 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Search
                            size={15}
                            className="text-cyan-400"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {project.title}
                          </p>

                          <p className="text-[11px] text-slate-500">
                            {project.category}
                          </p>
                        </div>

                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-4 text-sm text-slate-500">
                    No matching projects found.
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-400 mb-12">

            <span className="text-slate-500">
              Popular:
            </span>

            {[
              "React",
              "Next.js",
              "UI/UX",
              "Solidity",
              "Full-Stack",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearch(tag);
                  setShowSuggestions(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 hover:border-cyan-500 cursor-pointer transition text-slate-300"
              >
                {tag}
              </button>
            ))}

          </div>

          {/* CTA */}
          <div className="flex justify-center space-x-4">

            <Link
              href="/projects"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium px-8 py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
            >
              Find Work
            </Link>

            <Link
              href="/projects/create"
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-3.5 rounded-xl border border-slate-700 transition"
            >
              Post a Project
            </Link>

          </div>

        </motion.div>

        {/* ==========================================
            STATS
        ========================================== */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 px-4"
        >

          {[
            {
              label: "Active Projects",
              value: `${projects.length}+`,
            },
            {
              label: "Success Rate",
              value: "98%",
            },
            {
              label: "Paid to Talent",
              value: "$50M+",
            },
            {
              label: "Enterprise Support",
              value: "24/7",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#111827]/80 backdrop-blur border border-slate-800/80 p-6 rounded-2xl text-center shadow-lg hover:border-slate-700 transition"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </h3>

              <p className="text-xs md:text-sm text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}

        </motion.div>

      </section>

      {/* ==========================================
          EXPLORE EXPERTISE
      ========================================== */}
      <section className="w-full max-w-7xl px-6 py-16">

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
          Explore Expertise
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <motion.div
            whileHover={{ y: -4 }}
            className="lg:col-span-2 bg-gradient-to-br from-[#131B2E] to-[#0D1322] border border-slate-800 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/50 transition shadow-xl"
          >

            <div className="relative z-10 mb-12">

              <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                Featured Category
              </span>

              <h3 className="text-2xl font-bold text-white mt-1">
                Web Development
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Full-stack, Frontend, Backend architecture
                for scalable enterprise applications.
              </p>

            </div>

            <Link
              href="/projects"
              className="relative z-15 inline-flex items-center text-cyan-400 text-sm font-semibold hover:underline group-hover:translate-x-1 transition-transform"
            >
              Explore Category
              <ArrowRight size={16} className="ml-2" />
            </Link>

          </motion.div>

          <div className="flex flex-col gap-6">

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition shadow-lg"
            >
              <Code
                className="text-cyan-400 mb-3"
                size={24}
              />

              <h3 className="text-lg font-bold text-white">
                UI/UX Design
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Product Design, Prototyping, Design Systems.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition shadow-lg"
            >
              <Cpu
                className="text-cyan-400 mb-3"
                size={24}
              />

              <h3 className="text-lg font-bold text-white">
                Data Science
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Machine Learning, Analytics, Predictive Models.
              </p>
            </motion.div>

          </div>

        </div>

      </section>

      {/* ==========================================
          TRENDING PROJECTS
      ========================================== */}
      <section className="w-full max-w-7xl px-6 py-12 mb-10">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Trending Projects
          </h2>

          <Link
            href="/projects"
            className="text-cyan-400 text-sm font-semibold hover:underline"
          >
            View All
          </Link>

        </div>

        {/* ==========================================
            CATEGORY FILTER
        ========================================== */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-7">

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                className={`px-4 py-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  selectedCategory === category
                    ? "bg-cyan-500 text-slate-950 border-cyan-500"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-500"
                }`}
              >
                {category}
              </button>
            ))}

          </div>
        )}

        {/* ==========================================
            LOADING
        ========================================== */}
        {loadingProjects && (
          <div className="flex justify-center items-center py-16">

            <div className="text-center">

              <Loader2
                size={35}
                className="mx-auto mb-3 text-cyan-400 animate-spin"
              />

              <p className="text-sm text-slate-500">
                Loading projects...
              </p>

            </div>

          </div>
        )}

        {/* ==========================================
            ERROR
        ========================================== */}
        {!loadingProjects && projectError && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5 text-center">

            <p className="text-sm text-red-400">
              {projectError}
            </p>

          </div>
        )}

        {/* ==========================================
            PROJECTS
        ========================================== */}
        {!loadingProjects &&
          !projectError &&
          filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {filteredProjects
                .slice(0, 3)
                .map((project) => (
                  <motion.div
                    key={project._id}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#131B2E] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/40 transition shadow-xl"
                  >

                    <div>

                      <div className="flex justify-between items-center mb-4">

                        <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2.5 py-1 rounded-md font-medium uppercase">
                          {project.category}
                        </span>

                      </div>

                      <h3 className="text-base font-bold text-white mb-2 line-clamp-2">
                        {project.title}
                      </h3>

                      <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-6">

                        {project.skillsRequired
                          ?.slice(0, 4)
                          .map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="text-[11px] bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700/50"
                            >
                              {skill}
                            </span>
                          ))}

                      </div>

                    </div>

                    {/* Bottom */}
                    <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center gap-3">

                      <span className="text-sm font-semibold text-white">
                        {formatBudget(project.budget)}
                      </span>

                      <Link
                        href={`/projects/${project._id}`}
                        className="text-xs text-cyan-400 font-medium hover:underline flex items-center whitespace-nowrap"
                      >
                        View Project
                        <ArrowRight
                          size={12}
                          className="ml-1"
                        />
                      </Link>

                    </div>

                  </motion.div>
                ))}

            </div>
          )}

        {/* ==========================================
            NO PROJECTS
        ========================================== */}
        {!loadingProjects &&
          !projectError &&
          filteredProjects.length === 0 && (
            <div className="text-center py-16 bg-[#131B2E] border border-slate-800 rounded-2xl">

              <Search
                size={35}
                className="mx-auto mb-4 text-slate-600"
              />

              <h3 className="text-lg font-semibold text-white mb-2">
                No projects found
              </h3>

              <p className="text-sm text-slate-500">
                Try another search or category.
              </p>

              {(search ||
                selectedCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-sm text-cyan-400 hover:underline"
                >
                  Clear filters
                </button>
              )}

            </div>
          )}

      </section>

    </div>
  );
}