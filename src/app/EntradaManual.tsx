import { AppSidebar } from "@/components/app-sidebar"
import { FormEntradaManual } from "@/components/FormEntradaManual"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const EntradaManual = () => {
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
        <div className="min-h-screen flex flex-col items-center pt-10 px-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold">Añadir gasto</h1>
          </div>
          <div className="w-full ">
            <FormEntradaManual />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default EntradaManual
