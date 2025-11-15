import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "./app/Dashboard"
import EntradaManual from "./app/EntradaManual"
import CrearCuenta from "./app/CrearCuenta"
import { AuthProvider } from "./context/AuthProvider"
import { RequireAuth } from "./components/RequireAuth"
import Login from "./app/Login"

const FiCoApp = () => {
    return (
        <>
            <BrowserRouter>
                <AuthProvider>
                    <div className="container mx-auto px-4 flex justify-center">
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                            <Route path="/crear-cuenta" element={<CrearCuenta />} />
                            <Route path="/entrada-manual" element={<RequireAuth><EntradaManual /></RequireAuth>} />
                            <Route path="*" element={<Navigate to="/" replace/>} />
                        </Routes>
                    </div>
                </AuthProvider>
            </BrowserRouter>
        </>
    )
}

export default FiCoApp
