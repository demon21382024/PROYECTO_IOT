// API client utility for frontend calls

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (userId) {
    headers["x-user-id"] = userId
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      return {
        success: false,
        error: error.error || "API call failed",
      }
    }

    const data = await response.json()
    return {
      success: data.success,
      data: data.data || data,
    }
  } catch (error) {
    console.error("API call failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Specific API methods
export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  // Cats
  getCats: () => apiCall("/cats"),

  createCat: (name: string, breed?: string, dateOfBirth?: string) =>
    apiCall("/cats", {
      method: "POST",
      body: JSON.stringify({ name, breed, dateOfBirth }),
    }),

  // Litter Visits
  getVisits: (catId: string, days = 7) => apiCall(`/litter-visits?catId=${catId}&days=${days}`),

  recordVisit: (catId: string, duration: number, weight: number, deviceToken: string) =>
    apiCall("/litter-visits", {
      method: "POST",
      body: JSON.stringify({ catId, duration, weight, deviceToken }),
    }),

  // Health Alerts
  getAlerts: (catId: string, unreadOnly = false) => apiCall(`/health-alerts?catId=${catId}&unread=${unreadOnly}`),

  markAlertAsRead: (alertId: string) =>
    apiCall("/health-alerts", {
      method: "PATCH",
      body: JSON.stringify({ alertId }),
    }),

  // Subscriptions
  getSubscription: () => apiCall("/subscriptions"),

  upgradeSubscription: (planId: string, stripePaymentMethodId: string) =>
    apiCall("/subscriptions", {
      method: "POST",
      body: JSON.stringify({ planId, stripePaymentMethodId }),
    }),
}
