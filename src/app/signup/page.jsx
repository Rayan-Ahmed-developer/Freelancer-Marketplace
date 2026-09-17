"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "freelancer",
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUserTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      role: type,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.agreedToTerms) {
    setError("Please agree to Terms of Service");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role,
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    console.log("Signup response:", data);

    // ✅ Correct variable: res
    if (!res.ok) {
      throw new Error(
        data.error || data.message || "Signup failed"
      );
    }

    // Signup successful
    console.log("Account created successfully");

    router.push("/login");

  } catch (error) {
    console.error("Signup error:", error);
    setError(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[80vh]">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 mb-8 cursor-pointer"
      >
        <div className="p-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
          <Briefcase className="w-5 h-5" />
        </div>

        <span className="text-xl font-bold tracking-tight text-white">
          Workly
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-xl bg-[#111827]/90 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
      >

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Join as a client or freelancer
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          {/* Client */}
          <div
            onClick={() => handleUserTypeSelect("client")}
            className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col items-center text-center relative ${
              formData.role === "client"
                ? "bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-600/10"
                : "bg-[#161f33]/50 border-gray-800 hover:border-gray-700"
            }`}
          >
            <div
              className={`p-3 rounded-xl mb-3 ${
                formData.role === "client"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              <Briefcase className="w-5 h-5" />
            </div>

            <h4 className="font-semibold text-white text-sm mb-1">
              I am a Client
            </h4>

            <p className="text-xs text-gray-400 leading-relaxed">
              Post projects and find talent
            </p>

            {formData.role === "client" && (
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </div>

          {/* Freelancer */}
          <div
            onClick={() => handleUserTypeSelect("freelancer")}
            className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col items-center text-center relative ${
              formData.role === "freelancer"
                ? "bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-600/10"
                : "bg-[#161f33]/50 border-gray-800 hover:border-gray-700"
            }`}
          >
            <div
              className={`p-3 rounded-xl mb-3 ${
                formData.role === "freelancer"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              <UserIcon className="w-5 h-5" />
            </div>

            <h4 className="font-semibold text-white text-sm mb-1">
              I am a Freelancer
            </h4>

            <p className="text-xs text-gray-400 leading-relaxed">
              Find work and earn
            </p>

            {formData.role === "freelancer" && (
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </div>
        </div>

        <div className="h-[1px] bg-gray-800/80 w-full mb-8" />

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
              className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              required
              className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-start gap-3 pt-2">

            <input
              type="checkbox"
              id="terms"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded bg-[#0a0f1d] border-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
            />

            <label
              htmlFor="terms"
              className="text-xs text-gray-400 leading-relaxed cursor-pointer"
            >
              I understand and agree to the Workly{" "}
              <span className="text-indigo-400 hover:underline">
                Terms of Service
              </span>
              , including the{" "}
              <span className="text-indigo-400 hover:underline">
                User Agreement
              </span>{" "}
              and{" "}
              <span className="text-indigo-400 hover:underline">
                Privacy Policy
              </span>
              .
            </label>

          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 mt-4 text-sm"
          >
            {loading ? "Creating account..." : "Create my account"}
          </motion.button>

        </form>

        <div className="h-[1px] bg-gray-800/80 w-full my-8" />

        <div className="text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 font-medium hover:underline"
          >
            Log In
          </Link>
        </div>

      </motion.div>
    </div>
  );
}