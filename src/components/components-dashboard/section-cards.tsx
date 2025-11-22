import { useState, useEffect } from "react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type SectionCardsProps = {
  data: {
    budget: number
    totalOfMonth: number
    average: number
    total: number
  } | null
}

export function SectionCards({ data }: SectionCardsProps) {
  const [presupuesto, setPresupuesto] = useState(0)
  const totalGastado = data?.totalOfMonth || 0
  const promedioRecibo = data?.average || 0
  const totalAcumulado = data?.total || 0

  useEffect(() => {
    if (data?.budget) {
      setPresupuesto(data.budget)
    }
  }, [data])

  const handlePresupuestoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (inputValue === '') {
      setPresupuesto(0)
      return
    }

    const value = parseFloat(inputValue)
    if (!isNaN(value) && value >= 0) {
      setPresupuesto(value)
    }
  }

  const handlePresupuestoFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle >
            Presupuesto
          </CardTitle>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-semibold">$</span>
            <Input
              type="number"
              value={presupuesto}
              onChange={handlePresupuestoChange}
              onFocus={handlePresupuestoFocus}
              className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              step="1"
              min="0"
            />
          </div>
          <CardDescription >
            Selecciona tu presupuesto mensual
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle >
            Total gastado
          </CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalGastado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardDescription >
            de lo que va del mes
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="flex-col items-start gap-1.5 text-sm">Promedio por Recibo</CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${promedioRecibo.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
          <CardDescription>
            Por compra
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="flex-col items-start gap-1.5 text-sm">Total gastado</CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalAcumulado.toLocaleString('es-MX')}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
