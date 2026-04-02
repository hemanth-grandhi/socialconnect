const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:4000";

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export function imageUrl(path: string | null | undefined) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BACKEND_BASE_URL}${path}`;
}
