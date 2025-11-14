import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./app/Dashboard"
import { NavBar } from "./components/NavBar"
import Login from "./app/Login"
import EntradaManual from "./app/EntradaManual"
import VerRecibos from "./app/VerRecibos"
import Reporte from "./app/Reporte"

const FiCoApp = () => {
    return (
        <>
            <div className="fixed top-0 left-0 w-full bg-white shadow py-4 flex justify-center z-10">
                <NavBar />
            </div>
            <div className="container mx-auto mt-20 px-4 flex justify-center"> 
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/entrada-manual" element={<EntradaManual />} />
                    <Route path="/recibos" element={<VerRecibos />} />
                    <Route path="/reportes" element={<Reporte />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </>
    )
}

export default FiCoApp
