import { AppSidebar } from "@/components/components-sidebar/app-sidebar"
import { ChartAreaInteractive } from "@/components/components-dashboard/chart-area-interactive"
import { DataTable } from "@/components/components-dashboard/data-table"
import { SectionCards } from "@/components/components-dashboard/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthProvider"

type DashboardData = {
  name: string
  email: string
  budget: number
  totalOfMonth: number
  average: number
  total: number
  receiptsDto: {
    id: number
    name: string
    date: string
    total: number
    paymentMethod: string
  }[]
  categoriesDto: {
    name: string
    total: number
  }[]
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return
      
      try {
        setError(null)
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/dashboard/${user.id}`)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Error ${response.status}: ${errorText || 'Error al cargar dashboard'}`)
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error:", error)
        setError(error instanceof Error ? error.message : "Error desconocido al cargar el dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [user])

  if (loading) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center">
            <p>Cargando...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !dashboardData) {
    return (
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
            <p className="text-red-500 font-semibold">Error al cargar el dashboard</p>
            {error && <p className="text-sm text-gray-600">{error}</p>}
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Recargar página
            </button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards data={dashboardData} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive categoriesData={dashboardData?.categoriesDto} />
              </div>
              <DataTable data={dashboardData?.receiptsDto?.map(r => ({
                id: r.id,
                nombre: r.name,
                fecha: r.date,
                total: r.total
              })) || []} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboard
