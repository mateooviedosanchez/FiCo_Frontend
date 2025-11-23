import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./app/Dashboard"
import EntradaManual from "./app/EntradaManual"
import CrearCuenta from "./app/CrearCuenta"
import { AuthProvider } from "./context/AuthProvider"
import { RequireAuth } from "./components/RequireAuth"
import Login from "./app/Login"
import EditarEntradaManual from "./app/EditarEntradaManual"
import Perfil from "./app/Perfil"

const FiCoApp = () => {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={
                            <div className="container mx-auto px-4 flex justify-center">
                                <Login />
                            </div>
                        } />
                        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                        <Route path="/editar-recibo/:id" element={<EditarEntradaManual />} />
                        <Route path="/crear-cuenta" element={
                            <div className="container mx-auto px-4 flex justify-center">
                                <CrearCuenta />
                            </div>
                        } />
                        <Route path="/entrada-manual" element={<RequireAuth><EntradaManual /></RequireAuth>} />
                        <Route path="/perfil" element={<RequireAuth><Perfil /></RequireAuth>} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}

export default FiCoApp
