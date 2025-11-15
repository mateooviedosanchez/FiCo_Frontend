import React, { createContext, useContext, useEffect, useState } from "react"

type AuthContextType = {
  user: { name: string; email: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Base de datos de usuarios (reemplaza con API real cuando sea necesario)
const DEFAULT_USERS = [
  { email: "admin@gmail.com", password: "123", name: "admin" },
  { email: "mateo@gmail.com", password: "pass123", name: "mateo" },
  { email: "usuario@gmail.com", password: "user456", name: "usuario" },
]

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<{ email: string; password: string; name: string }[]>(
    () => {
      const s = localStorage.getItem("users")
      return s ? JSON.parse(s) : DEFAULT_USERS
    }
  )

  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const s = localStorage.getItem("auth_user")
    return s ? JSON.parse(s) : null
  })

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users))
  }, [users])

  const login = async (email: string, password: string) => {
    const validUser = users.find((u) => u.email === email && u.password === password)

    if (!validUser) throw new Error("Credenciales inválidas")

    const u = { name: validUser.name ?? email.split("@")[0], email }
    setUser(u)
    localStorage.setItem("auth_user", JSON.stringify(u))
    // Aquí podrías llamar a un API real y guardar token
  }

  const register = async (name: string, email: string, password: string) => {
    // TODO: Simula creación de cuenta localmente, Cambia por llamada a API
    const exists = users.find((u) => u.email === email)
    if (exists) throw new Error("El correo ya está registrado")
    const newUser = { name, email, password }
    const next = [...users, newUser]
    setUsers(next)
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