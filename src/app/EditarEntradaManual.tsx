import { AppSidebar } from "@/components/components-sidebar/app-sidebar"
import { FormEditarRecibo } from "@/components/forms/FormEditarRecibo"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const EditarEntradaManual = () => {
  const { id } = useParams()
  const [reciboData, setReciboData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecibo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND}/editReceipt/${id}/savedData`)
        
        if (!response.ok) {
          throw new Error("Error al cargar el recibo")
        }

        const data = await response.json()
        
        // Convertir la fecha del formato "yyyy-MM-dd" a objeto Date
        const fechaDate = new Date(data.date)
        
        const datosFormateados = {
          nombre: data.name,
          fecha: fechaDate,
          metodoPago: data.paymentMethod,
          s3Key: data.s3Key,
          productos: data.products.map((p: any) => ({
            id: p.id,
            nombre: p.name,
            precio: p.price,
            cantidad: p.quantity,
            categoria: p.category,
            subCategoria: p.subcategory,
            receiptId: p.receiptId
          })),
          total: data.total
        }
        
        setReciboData(datosFormateados)
        setLoading(false)
      } catch (error: any) {
        console.error("Error al cargar el recibo:", error)
        setError(error.message)
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
            ) : error ? (
              <div className="text-center py-10 text-red-600">{error}</div>
            ) : reciboData ? (
              <FormEditarRecibo initialData={reciboData} receiptId={Number(id)} />
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
