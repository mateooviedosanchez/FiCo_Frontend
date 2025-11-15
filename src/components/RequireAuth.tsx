import { type JSX } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthProvider"

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />
  return children
}