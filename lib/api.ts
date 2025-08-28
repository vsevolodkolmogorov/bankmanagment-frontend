// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api"

export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: UserResponse
}

export interface UserResponse {
  id: number
  email: string
  roleName: string
  isEnabled: boolean
  isNonLocked: boolean
  cards: CardResponse[]
}

export interface CardResponse {
  id: number
  maskedCardNumber: string
  ownerEmail: string
  expiryDate: string
  statusName: string
  balance: number
}

export interface CardBlockResponse {
  id: number
  requestDate: string
  cardId: number
  userId: number
  status: string
  adminComment?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {"Content-Type": "application/json", ...this.getAuthHeaders(), ...options.headers},
      ...options,
    })

    let data: any = null
    if (response.status !== 204) {
      try {
        data = await response.json() // читаем только один раз
      } catch {
        data = null
      }
    }

    if (!response.ok) {
      const message = data?.message || `Request failed with status ${response.status}`
      throw new Error(message)
    }

    return data as T
  }

  // Auth endpoints
  async register(data: AuthRequest): Promise<AuthResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.request("/auth/me")
  }

  // User endpoints
  async getUsers(page = 0, size = 10): Promise<PageResponse<UserResponse>> {
    return this.request(`/user?page=${page}&size=${size}`)
  }

  async getUser(id: number): Promise<UserResponse> {
    return this.request(`/user/${id}`)
  }

  async createUser(data: { email: string; password: string; role: string }): Promise<UserResponse> {
    return this.request("/user", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateUserRole(id: number, role: string): Promise<UserResponse> {
    return this.request(`/user/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    })
  }

  async toggleUserLock(id: number): Promise<UserResponse> {
    return this.request(`/user/${id}/toggleLock`, { method: "PATCH" })
  }

  async toggleUserEnable(id: number): Promise<UserResponse> {
    return this.request(`/user/${id}/toggleEnable`, { method: "PATCH" })
  }

  async deleteUser(id: number): Promise<void> {
    return this.request(`/user/${id}`, { method: "DELETE" })
  }

  // Card endpoints
  async getUserCards(page = 0, size = 10, filters: any = {}): Promise<PageResponse<CardResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
    })
    return this.request(`/card/my?${params}`)
  }

  async getAllCards(page = 0, size = 10, filters: any = {}): Promise<PageResponse<CardResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
    })
    return this.request(`/card?${params}`)
  }

  async getCard(id: number): Promise<CardResponse> {
    return this.request(`/card/${id}`)
  }

  async getUserCard(id: number): Promise<CardResponse> {
    return this.request(`/card/${id}/my`)
  }

  async createCard(data: {
    userId: number
    expiryDate: string
    status: string
    balance: number
  }): Promise<CardResponse> {
    return this.request("/card", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async transferBetweenCards(data: { fromCardId: number; toCardId: number; amount: number }): Promise<string> {
    return this.request("/card/transfer", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCardExpiry(id: number, expiryDate: string): Promise<CardResponse> {
    return this.request(`/card/${id}/expiry`, {
      method: "PATCH",
      body: JSON.stringify({ expiryDate }),
    })
  }

  async updateCardStatus(id: number, status: string): Promise<CardResponse> {
    return this.request(`/card/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  async deleteCard(id: number): Promise<void> {
    return this.request(`/card/${id}`, { method: "DELETE" })
  }

  // Card Block endpoints
  async getUserCardBlocks(page = 0, size = 10): Promise<PageResponse<CardBlockResponse>> {
    return this.request(`/cardBlock/my?page=${page}&size=${size}`)
  }

  async getAllCardBlocks(page = 0, size = 10): Promise<PageResponse<CardBlockResponse>> {
    return this.request(`/cardBlock?page=${page}&size=${size}`)
  }

  async getCardBlock(id: number): Promise<CardBlockResponse> {
    return this.request(`/cardBlock/${id}`)
  }

  async getUserCardBlock(id: number): Promise<CardBlockResponse> {
    return this.request(`/cardBlock/${id}/my`)
  }

  async createCardBlock(cardId: number): Promise<CardBlockResponse> {
    return this.request("/cardBlock", {
      method: "POST",
      body: JSON.stringify({ cardId }),
    })
  }

  async approveCardBlock(id: number, comment: string): Promise<CardBlockResponse> {
    return this.request(`/cardBlock/${id}/approve?comment=${encodeURIComponent(comment)}`, {
      method: "PATCH",
    })
  }

  async rejectCardBlock(id: number, comment: string): Promise<CardBlockResponse> {
    return this.request(`/cardBlock/${id}/reject?comment=${encodeURIComponent(comment)}`, {
      method: "PATCH",
    })
  }

  async deleteCardBlock(id: number): Promise<void> {
    return this.request(`/cardBlock/${id}`, { method: "DELETE" })
  }
}

export const api = new ApiClient()
