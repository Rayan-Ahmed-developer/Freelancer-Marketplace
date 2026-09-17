"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setMobileMenuOpen(false);

    router.push("/");
    router.refresh();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Hydration issue avoid karne ke liye
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/80 border-b border-slate-800/80 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Workly Enterprise
            </span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/90 border-b border-slate-800/80">

      {/* Main Navbar */}
      <div className="px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Workly Enterprise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">

            {/* Find Work */}
            <Link
              href="/projects"
              className="hover:text-cyan-400 transition"
            >
              Find Work
            </Link>

            {/* Client Only */}
            {user?.role === "client" && (
              <Link
                href="/projects/create"
                className="hover:text-cyan-400 transition"
              >
                Post Project
              </Link>
            )}

            {/* Client Dashboard */}
            {user?.role === "client" && (
              <Link
                href="/dashboard/"
                className="hover:text-cyan-400 transition"
              >
                Dashboard
              </Link>
            )}

            {/* Freelancer Dashboard */}
            {user?.role === "freelancer" && (
              <Link
                href="/dashboard/freelancer"
                className="hover:text-cyan-400 transition"
              >
                Dashboard
              </Link>
            )}

            {/* Admin Dashboard */}
            {user?.role === "admin" && (
              <Link
                href="/dashboard/admin"
                className="hover:text-cyan-400 transition"
              >
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">

          {/* Guest */}
          {!user && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 transition"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/20"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Logged In */}
          {user && (
            <>
              <span className="text-sm text-slate-400">
                {user.role === "client" ? "Client" : "Freelancer"}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-300 hover:text-red-400 px-4 py-2 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F19]/95 px-6 py-5">

          <nav className="flex flex-col space-y-2">

            {/* Find Work */}
            <Link
              href="/projects"
              onClick={closeMobileMenu}
              className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition"
            >
              Find Work
            </Link>

            {/* Client - Post Project */}
            {user?.role === "client" && (
              <Link
                href="/projects/create"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition"
              >
                Post Project
              </Link>
            )}

            {/* Client Dashboard */}
            {user?.role === "client" && (
              <Link
                href="/dashboard/"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition"
              >
                Dashboard
              </Link>
            )}

            {/* Freelancer Dashboard */}
            {user?.role === "freelancer" && (
              <Link
                href="/dashboard/freelancer"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition"
              >
                Dashboard
              </Link>
            )}

            {/* Admin Dashboard */}
            {user?.role === "admin" && (
              <Link
                href="/dashboard/admin"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition"
              >
                Admin Dashboard
              </Link>
            )}

            {/* Divider */}
            <div className="border-t border-slate-800 my-2" />

            {/* Guest Mobile */}
            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="text-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm px-5 py-3 rounded-xl transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Logged In Mobile */}
            {user && (
              <>
                <div className="px-4 py-2 text-sm text-slate-500">
                  Logged in as{" "}
                  <span className="text-slate-300 font-medium">
                    {user.role === "client" ? "Client" : "Freelancer"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800/60 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}