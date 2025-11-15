import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./app/Dashboard"
import Login from "./app/Login"
import EntradaManual from "./app/EntradaManual"
import CrearCuenta from "./app/CrearCuenta"

const FiCoApp = () => {
    return (
        <>
            <div className="container mx-auto px-4 flex justify-center"> 
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/crear-cuenta" element={<CrearCuenta />} />
                    <Route path="/entrada-manual" element={<EntradaManual />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </>
    )
}

export default FiCoApp
