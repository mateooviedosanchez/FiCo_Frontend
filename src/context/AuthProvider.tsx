import React, { createContext, useContext, useState } from "react"

type AuthContextType = {
  user: { id: number; name: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(() => {
    const s = localStorage.getItem("auth_user")
    return s ? JSON.parse(s) : null
  })

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Credenciales inválidas")
      }

      const data = await response.json()
      const u = { id: data.id, name: data.name || email.split("@")[0], email }
      setUser(u)
      localStorage.setItem("auth_user", JSON.stringify(u))
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        throw new Error("No se puede conectar al servidor. Verifica que el backend esté corriendo y tenga CORS configurado.")
      }
      throw new Error(error.message || "Error al conectar con el servidor")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al crear la cuenta")
      }

    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        throw new Error("No se puede conectar al servidor. Verifica que el backend esté corriendo y tenga CORS configurado.")
      }
      throw new Error(error.message || "Error al conectar con el servidor")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_user")
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}