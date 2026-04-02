import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../lib/theme-context";

export const metadata: Metadata = {
  title: "SocialConnect - Connect & Share",
  description: "A modern social media platform for connecting with friends and sharing moments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="relative">
            {children}
          </main>
          {/* Mobile Bottom Navigation */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-purple-100 dark:border-gray-700 shadow-lg">
            <div className="flex justify-around py-3 px-2">
              <Link
                href="/feed"
                className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Feed</span>
              </Link>
              <Link
                href="/stories"
                className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Stories</span>
              </Link>
              <Link
                href="/explore"
                className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Explore</span>
              </Link>
              <Link
                href="/messages"
                className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Messages</span>
              </Link>
              <Link
                href="/create"
                className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-pink-50 dark:group-hover:bg-pink-900/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Create</span>
              </Link>
              <Link
                href="/profile"
                className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <div className="p-2 rounded-xl group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium">Profile</span>
              </Link>
            </div>
          </nav>
        </ThemeProvider>
      </body>
    </html>
  );
}
