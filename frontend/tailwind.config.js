/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        pink: {
          500: '#ec4899',
        },
        orange: {
          500: '#f97316',
        },
        cyan: {
          500: '#06b6d4',
        },
        blue: {
          500: '#3b82f6',
        },
        green: {
          500: '#22c55e',
        },
        red: {
          500: '#ef4444',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        slate: {
          500: '#64748b',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        indigo: {
          500: '#6366f1',
        },
        emerald: {
          500: '#10b981',
        },
        yellow: {
          500: '#eab308',
        },
      },
    },
  },
  plugins: [],
}