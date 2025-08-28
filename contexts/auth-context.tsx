"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { api, type UserResponse } from "@/lib/api"

interface AuthContextType {
  user: UserResponse | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.roleName === "ADMIN"

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      setToken(savedToken)
      api
        .getCurrentUser()
        .then((response) => {
          setUser(response.user)
        })
        .catch(() => {
          localStorage.removeItem("token")
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password })
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem("token", response.token)
    } catch (err: any) {
      // пробрасываем конкретное сообщение с бэка
      throw new Error(err?.message || "Something went wrong")
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await api.register({ email, password })
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem("token", response.token)
    } catch (err: any) {
      throw new Error(err?.message || "Something went wrong")
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
