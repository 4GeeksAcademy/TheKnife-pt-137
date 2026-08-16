import React, { useEffect, useState } from "react";
import { useChef } from "../../hooks/useChef";
import { Link } from "react-router-dom";
import storeReducer from "../../store";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useRestaurant } from "../../hooks/useRestaurant";

const RegisterChef = () => {

    const { store } = useGlobalReducer()
    const [chefData, setChefData] = useState({name: "", email: "", password: ""})
    const { registerChef } = useChef()

    return (
        <div
            className="auth-page"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="auth-card">
                <div className="auth-form-panel">
                    <p className="brand">The Knife 🔪</p>
                    <p className="subtitle">Crea tu cuenta de Chef</p>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, name: e.target.value})} value={chefData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, email: e.target.value})} value={chefData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, password: e.target.value})} value={chefData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={()=>registerChef(chefData)} className="btn btn-cocin w-100 mb-3">Registrarme</button>

                    <div className="text-center mb-2">
                        <span>¿Ya tienes cuenta? </span>
                        <Link to="/chef_login" className="auth-switch-link">Inicia sesión</Link>
                    </div>

                    <div className="text-center">
                        <Link to="/" className="text-muted">Volver al inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterChef;
