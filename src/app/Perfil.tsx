import { AppSidebar } from "@/components/components-sidebar/app-sidebar"
import FormEditarCuenta from "@/components/forms/FormEditarCuenta"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const Perfil = () => {
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
                    <div className="w-full ">
                        <FormEditarCuenta />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Perfil


