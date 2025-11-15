import { AppSidebar } from "@/components/app-sidebar"
import { FormCrearCuenta } from "@/components/FormCrearCuenta"
import { SidebarProvider } from "@/components/ui/sidebar"

const CrearCuenta = () => {
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
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <FormCrearCuenta />
        </div>
      </div>
    </SidebarProvider>
  )
}

export default CrearCuenta
