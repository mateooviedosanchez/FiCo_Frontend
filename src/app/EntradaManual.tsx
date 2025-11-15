import { FormEntradaManual } from "@/components/FormEntradaManual"

const EntradaManual = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-10 px-4"> 
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Añadir gasto</h1>
      </div>
      <div className="w-full ">
        <FormEntradaManual />
      </div>
    </div>
  )
}

export default EntradaManual
