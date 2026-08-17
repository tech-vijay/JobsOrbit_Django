import { cookies } from "next/headers";

const DJANGO_API_BASE = process.env.DJANGO_API_URL || "http://127.0.0.1:8000/api/v1";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
}

export async function fetchDjango<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers = {}, ...rest } = options;

  let url = `${DJANGO_API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Attach JWT Bearer token if required or available
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jobsorbit_jwt_token")?.value;
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // Client-side execution context or cookies not accessible
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    cache: "no-store", // Keep dynamic SSR up-to-date
  });

  if (!response.ok) {
    let errorMessage = `Django API Error: ${response.statusText} (${response.status})`;
    try {
      const errorData = await response.json();
      if (typeof errorData === "object" && errorData !== null) {
        if (errorData.detail) errorMessage = errorData.detail;
        else if (errorData.error) errorMessage = errorData.error;
        else errorMessage = JSON.stringify(errorData);
      }
    } catch {
      // Non-JSON error body
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export function getDjangoBaseUrl(): string {
  return DJANGO_API_BASE;
}
