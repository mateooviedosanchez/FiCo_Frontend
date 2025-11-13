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
            <div className="w-full flex justify-center fixed top-0 left-0 py-4 bg-white shadow">
                <NavBar></NavBar>
            </div>
            <div className="container mt-20">
                <Routes>
                    <Route path="/" element={<Dashboard></Dashboard>}></Route>
                    <Route path="/login" element={<Login></Login>}></Route>
                    <Route path="/entrada-manual" element={<EntradaManual></EntradaManual>}></Route>
                    <Route path="/recibos" element={<VerRecibos></VerRecibos>}></Route>
                    <Route path="/reportes" element={<Reporte></Reporte>}></Route>
                    <Route path="/*" element={<Navigate to='/'></Navigate>}></Route>
                </Routes>
            </div>
        </>
    )
}

export default FiCoApp
