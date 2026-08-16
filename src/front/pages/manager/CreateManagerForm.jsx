import React, { useState } from "react";
import { useManager } from "../../hooks/useManager";
import { Link } from "react-router-dom";

const CreateManagerForm = () => {

    const [managerData, setManagerData] = useState({name: "", email: "", password: ""})
    const { createManager } = useManager()

    return (
        <div
            className="auth-page"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1583394293214-28a5b42f7f3a?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="auth-card">
                <div className="auth-form-panel">
                    <p className="brand">The Knife 🔪</p>
                    <p className="subtitle">Crear cuenta de Manager</p>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e)=>setManagerData({...managerData, name: e.target.value})} value={managerData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setManagerData({...managerData, email: e.target.value})} value={managerData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e)=>setManagerData({...managerData, password: e.target.value})} value={managerData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={()=>createManager(managerData)} className="btn btn-cocin w-100 mb-3">Crear manager</button>

                    <div className="text-center">
                        <Link to="/managers" className="text-muted">Volver a managers</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateManagerForm;
