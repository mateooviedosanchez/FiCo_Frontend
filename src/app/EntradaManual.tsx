import { FormEntradaManual } from "@/components/FormEntradaManual"

const EntradaManual = () => {
  return (
    <div className="min-h-screen flex flex-col items-center pt-10 px-4"> 
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Añadir gasto manualmente</h1>
        <p className="text-gray-600 text-lg mt-2">Información Básica</p>
      </div>
      <div className="w-full max-w-2xl mb-10">
        <FormEntradaManual />
      </div>
    </div>
  )
}

export default EntradaManual
