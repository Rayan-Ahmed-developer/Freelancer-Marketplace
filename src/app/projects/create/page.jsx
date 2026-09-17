"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Banknote,
  Tag,
  FileText,
  ChevronRight,
  Layers,
  Clock,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "Web Development",
  "Mobile App Development",
  "Software Development",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Graphic Design",
  "Logo & Brand Identity",
  "Video & Animation",
  "Writing & Content",
  "Copywriting",
  "Translation",
  "Data Science",
  "Data Analysis",
  "Machine Learning",
  "Artificial Intelligence",
  "DevOps & Cloud",
  "Cybersecurity",
  "Database Management",
  "Digital Marketing",
  "SEO",
  "Social Media Marketing",
  "Business & Consulting",
  "Accounting & Finance",
  "Legal Services",
  "Customer Support",
  "Virtual Assistant",
  "Project Management",
  "Game Development",
  "E-Commerce",
  "Other",
];

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "expert",
    label: "Expert",
  },
];

const DELIVERY_OPTIONS = [
  "Less than 1 week",
  "1 to 2 weeks",
  "2 to 4 weeks",
  "1 to 2 months",
  "2 to 4 months",
  "4 to 6 months",
  "More than 6 months",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  budget: "",
  category: "Web Development",
  skillsRequired: "",
  experienceLevel: "intermediate",
  deliveryTime: "2 to 4 weeks",
};

export default function PostProject() {
  const router = useRouter();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // AUTH CHECK
    // =========================

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login as a client before posting a project.");
      return;
    }

    // =========================
    // FORM VALIDATION
    // =========================

    const title = formData.title.trim();
    const description = formData.description.trim();
    const skillsText = formData.skillsRequired.trim();

    const budget = Number(formData.budget);

    if (!title) {
      setError("Project title is required.");
      return;
    }

    if (title.length < 5) {
      setError("Project title must contain at least 5 characters.");
      return;
    }

    if (!description) {
      setError("Project description is required.");
      return;
    }

    if (description.length < 20) {
      setError(
        "Project description must contain at least 20 characters."
      );
      return;
    }

    if (!formData.budget || !Number.isFinite(budget) || budget <= 0) {
      setError("Please enter a valid project budget.");
      return;
    }

    if (!formData.category) {
      setError("Please select a project category.");
      return;
    }

    if (!formData.experienceLevel) {
      setError("Please select an experience level.");
      return;
    }

    if (!formData.deliveryTime.trim()) {
      setError("Please select a delivery time.");
      return;
    }

    // =========================
    // SKILLS ARRAY
    // =========================

    const skillsArray = skillsText
      ? skillsText
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

    // Remove duplicate skills
    const uniqueSkills = [...new Set(skillsArray)];

    // =========================
    // PROJECT PAYLOAD
    // =========================

    const projectData = {
      title,
      description,
      budget,
      category: formData.category,
      skillsRequired: uniqueSkills,
      experienceLevel: formData.experienceLevel,
      deliveryTime: formData.deliveryTime.trim(),
    };

    try {
      setLoading(true);

      console.log("Creating Project:", projectData);

      // =========================
      // CREATE PROJECT
      // =========================

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      // =========================
      // SAFE RESPONSE HANDLING
      // =========================

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to create project. Please try again."
        );
      }

      // =========================
      // SUCCESS
      // =========================

      setSuccess("Project posted successfully!");

      setFormData(INITIAL_FORM);

      setTimeout(() => {
        router.push("/projects");
      }, 1000);
    } catch (error) {
      console.error("Create Project Error:", error);

      setError(
        error?.message ||
          "Something went wrong while creating the project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] py-16 px-6 md:px-16 selection:bg-cyan-500 selection:text-slate-950">
      <div className="max-w-3xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-10">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
            Client Marketplace
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
            Post a New Project
          </h1>

          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Describe your project requirements and find the right
            freelancer for your work.
          </p>
        </div>

        {/* =========================
            FORM CARD
        ========================= */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#131B2E] border border-slate-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl"
        >

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =========================
                PROJECT TITLE
            ========================= */}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Project Title
                <span className="text-red-400 ml-1">*</span>
              </label>

              <div className="relative flex items-center">
                <Briefcase
                  size={18}
                  className="absolute left-4 text-slate-500"
                />

                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g. Build a modern e-commerce website"
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <p className="text-[10px] text-slate-500 mt-1.5">
                Give your project a clear and specific title.
              </p>
            </div>

            {/* =========================
                DESCRIPTION
            ========================= */}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Project Description
                <span className="text-red-400 ml-1">*</span>
              </label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-4 top-4 text-slate-500"
                />

                <textarea
                  name="description"
                  rows="6"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Describe the project scope, requirements, features and expected deliverables..."
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <p className="text-[10px] text-slate-500 mt-1.5">
                Provide enough details so freelancers clearly understand
                your requirements.
              </p>
            </div>

            {/* =========================
                BUDGET + CATEGORY
            ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* BUDGET */}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Estimated Budget (PKR)
                  <span className="text-red-400 ml-1">*</span>
                </label>

                <div className="relative flex items-center">
                  <Banknote
                    size={18}
                    className="absolute left-4 text-slate-500"
                  />

                  <input
                    type="number"
                    name="budget"
                    required
                    min="1"
                    step="1"
                    value={formData.budget}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="50000"
                    className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors disabled:opacity-50"
                  />
                </div>

                <p className="text-[10px] text-slate-500 mt-1.5">
                  Enter your total project budget in Pakistani Rupees.
                </p>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Project Category
                  <span className="text-red-400 ml-1">*</span>
                </label>

                <div className="relative flex items-center">
                  <Tag
                    size={18}
                    className="absolute left-4 text-slate-500 z-10 pointer-events-none"
                  />

                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors appearance-none disabled:opacity-50"
                  >
                    {CATEGORIES.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-[#0B0F19] text-white"
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-[10px] text-slate-500 mt-1.5">
                  Select the category that best matches your project.
                </p>
              </div>

            </div>

            {/* =========================
                SKILLS
            ========================= */}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Skills Required
                <span className="text-slate-500 ml-1">(Optional)</span>
              </label>

              <div className="relative flex items-center">
                <Layers
                  size={18}
                  className="absolute left-4 text-slate-500"
                />

                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="React, Next.js, Node.js, MongoDB"
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <span className="text-[10px] text-slate-500 mt-1.5 block">
                Add multiple skills separated by commas.
              </span>
            </div>

            {/* =========================
                EXPERIENCE + DELIVERY
            ========================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* EXPERIENCE */}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Experience Level
                  <span className="text-red-400 ml-1">*</span>
                </label>

                <div className="relative flex items-center">
                  <Award
                    size={18}
                    className="absolute left-4 text-slate-500 z-10 pointer-events-none"
                  />

                  <select
                    name="experienceLevel"
                    required
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors appearance-none disabled:opacity-50"
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option
                        key={level.value}
                        value={level.value}
                        className="bg-[#0B0F19] text-white"
                      >
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DELIVERY */}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Delivery Time
                  <span className="text-red-400 ml-1">*</span>
                </label>

                <div className="relative flex items-center">
                  <Clock
                    size={18}
                    className="absolute left-4 text-slate-500 z-10 pointer-events-none"
                  />

                  <select
                    name="deliveryTime"
                    required
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors appearance-none disabled:opacity-50"
                  >
                    {DELIVERY_OPTIONS.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-[#0B0F19] text-white"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* =========================
                SUBMIT
            ========================= */}

            <div className="pt-4">

              <motion.button
                whileHover={{
                  scale: loading ? 1 : 1.01,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.99,
                }}
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center transition shadow-lg shadow-cyan-500/20 text-sm"
              >
                {loading ? (
                  "Publishing Project..."
                ) : (
                  <>
                    Publish Project
                    <ChevronRight
                      size={18}
                      className="ml-1"
                    />
                  </>
                )}
              </motion.button>

            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}