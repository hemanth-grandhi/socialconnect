"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../lib/theme-context";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always call hook (Rules of Hooks), then guard usage when not mounted yet
  const themeContext = useTheme();
  const theme = mounted ? themeContext.theme : 'light';
  const toggleTheme = mounted ? themeContext.toggleTheme : () => {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Render basic navbar during SSR
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  SocialConnect
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/feed" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg text-sm font-medium">
                Feed
              </Link>
              <Link href="/stories" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg text-sm font-medium">
                Stories
              </Link>
              <Link href="/explore" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-lg text-sm font-medium">
                Explore
              </Link>
              <Link href="/messages" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-lg text-sm font-medium">
                Messages
              </Link>
              <Link href="/create" className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-lg text-sm font-medium">
                Create
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-lg text-sm font-medium">
                Search
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg text-sm font-medium">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-purple-100 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                SocialConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/feed"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              Feed
            </Link>
            <Link
              href="/stories"
              className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-pink-50 dark:hover:bg-pink-900/30"
            >
              Stories
            </Link>
            <Link
              href="/explore"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            >
              Explore
            </Link>
            <Link
              href="/messages"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            >
              Messages
            </Link>
            <Link
              href="/create"
              className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-pink-50 dark:hover:bg-pink-900/30"
            >
              Create
            </Link>
            <Link
              href="/search"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-orange-50 dark:hover:bg-orange-900/30"
            >
              Search
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/30"
            >
              Profile
            </Link>
            <button
              onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/30"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-purple-100 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/feed"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Feed
              </Link>
              <Link
                href="/stories"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Stories
              </Link>
              <Link
                href="/explore"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/messages"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Messages
              </Link>
              <Link
                href="/create"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Create
              </Link>
              <Link
                href="/search"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                href="/profile"
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
              >
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}