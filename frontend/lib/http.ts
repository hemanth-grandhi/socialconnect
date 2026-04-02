import { apiUrl } from "@/lib/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  isFormData?: boolean;
};

/**
 * Makes an authenticated API request to the backend
 * @param path - The API endpoint path (e.g., "/auth/login")
 * @param options - Request options including method, body, token, etc.
 * @returns The response data
 * @throws ApiError if the request fails
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, isFormData } = options;
  const headers: Record<string, string> = {};

  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const response = await fetch(apiUrl(path), {
    method,
    headers,
    body: isFormData ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(payload.error || "Request failed.", response.status);
  }

  return (payload?.data ?? payload) as T;
}
