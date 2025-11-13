import { FormEntradaManual } from "@/components/FormEntradaManual"

const EntradaManual = () => {
  return (
    <div className="container py-2">
      <h1 className="text-header">Añadir gasto manualmente</h1>
      <p className="text-base-regular">Informacion Basica</p>
      <div className="w-full">
        <FormEntradaManual />
      </div>
    </div>
  )
}

export default EntradaManual
