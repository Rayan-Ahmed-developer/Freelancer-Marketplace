"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.status === "Login successful") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Login successful");
        console.log("User:", data.user);
        console.log("Role:", data.user.role);

        // Abhi temporary home page par bhej rahe hain
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[80vh]">

      {/* Top Brand Logo */}
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

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-xl bg-[#111827]/90 backdrop-blur-xl border border-gray-800/85 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
      >

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Welcome back to Workly
          </h2>

          <p className="text-xs text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
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

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">

              <label className="block text-xs font-medium text-gray-300">
                Password
              </label>

            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-[#0a0f1d] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/30 mt-2 text-sm"
          >
            {loading ? "Logging in..." : "Log In"}
          </motion.button>

        </form>

        <div className="h-[1px] bg-gray-800/80 w-full my-8" />

        {/* Signup Link */}
        <div className="text-center text-xs text-gray-400">
          Do not have an account?{" "}

          <Link
            href="/signup"
            className="text-indigo-400 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </div>

      </motion.div>
    </div>
  );
}