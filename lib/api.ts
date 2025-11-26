export const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const isClient = typeof window !== "undefined";

  const token = isClient ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Handle expired JWT
  if (res.status === 401) {
    if (isClient) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized. Token expired.");
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Invalid JSON response from server");
  }

  // Check if response contains an error
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}
