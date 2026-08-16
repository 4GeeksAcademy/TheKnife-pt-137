import React, { useEffect, useState } from "react";
import { useCook } from "../../../hooks/useCook";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";


const RegisterCook = () => {

    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [cookData, setCookData] = useState({name: "", email: "", password: ""})
    const { cookRegister } = useCook()

    return (
        <div
            className="auth-page"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="auth-card">
                <div className="auth-form-panel">
                    <p className="brand">The Knife 🔪</p>
                    <p className="subtitle">Crear cuenta de Cocinero</p>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e)=>setCookData({...cookData, name: e.target.value})} value={cookData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setCookData({...cookData, email: e.target.value})} value={cookData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e)=>setCookData({...cookData, password: e.target.value})} value={cookData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={()=>cookRegister(restaurant_id, cookData)} className="btn btn-cocin w-100 mb-3">Crear cocinero</button>

                    <div className="text-center">
                        <Link to="/chef_dashboard" className="text-muted">Volver al dashboard</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterCook;
