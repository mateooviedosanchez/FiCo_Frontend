import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const presupuesto = 6200.00
  const totalGastado = 4250.75
  const promedioRecibo = 75.34
  const totalAcumulado = 45678

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle >
            Presupuesto
          </CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${presupuesto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </CardTitle>
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
