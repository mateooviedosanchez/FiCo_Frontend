import { AppSidebar } from "@/components/components-sidebar/app-sidebar"
import { FormEditarRecibo } from "@/components/forms/FormEditarRecibo"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import recibosData from "./dashboard/data.json"

const EditarEntradaManual = () => {
  const { id } = useParams()
  const [reciboData, setReciboData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecibo = async () => {
      try {
        const recibo = recibosData.find((r) => r.id === Number(id))
        
        if (recibo) {
          // Convertir la fecha del formato "dd/mm/yyyy" a objeto Date
          const [day, month, year] = recibo.fecha.split("/")
          const fechaDate = new Date(Number(year), Number(month) - 1, Number(day))
          
          const datosFormateados = {
            nombre: recibo.nombre,
            fecha: fechaDate,
            productos: [
              { 
                nombre: "", 
                precio: 0, 
                cantidad: 1, 
                categoria: "", 
                subCategoria: "" 
              }
            ],
            total: recibo.total
          }
          
          setReciboData(datosFormateados)
        } else {
          setReciboData(null)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar el recibo:", error)
        setLoading(false)
      }
    }

    if (id) {
      fetchRecibo()
    }
  }, [id])

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
            <h1 className="text-4xl font-bold">Editar Recibo</h1>
          </div>
          <div className="w-full ">
            {loading ? (
              <div className="text-center py-10">Cargando...</div>
            ) : reciboData ? (
              <FormEditarRecibo initialData={reciboData} />
            ) : (
              <div className="text-center py-10">No se encontró el recibo</div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default EditarEntradaManual
