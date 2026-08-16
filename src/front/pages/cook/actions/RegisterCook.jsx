import React, { useState } from "react";
import { useCook } from "../../../hooks/useCook";
import { Link, useParams } from "react-router-dom";

const RegisterCook = () => {

    const { restaurant_id } = useParams()
    const [cookData, setCookData] = useState({ name: "", email: "", password: "" })
    const { cookRegister } = useCook()

    return (
        <div className="auth-page">
            <div className="auth-card-wrap">
                <Link to={`/restaurants/${restaurant_id}/cooks`} className="page-back-link">
                    <i className="fa-solid fa-arrow-left"></i>Volver a cocineros
                </Link>
                <div className="auth-card">
                    <div className="auth-icon">
                        <i className="fa-solid fa-kitchen-set"></i>
                    </div>
                    <h1 className="auth-title">Registrar cocinero</h1>
                    <p className="auth-subtitle">Da de alta a un nuevo cocinero.</p>

                    <div className="auth-field mb-3">
                        <label className="auth-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, name: e.target.value })} value={cookData.name} type="text" name="name" id="name" placeholder="Nombre del cocinero" />
                    </div>

                    <div className="auth-field mb-3">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, email: e.target.value })} value={cookData.email} type="text" name="email" id="email" placeholder="cocinero@restaurante.com" />
                    </div>

                    <div className="auth-field mb-4">
                        <label className="auth-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, password: e.target.value })} value={cookData.password} type="password" name="password" id="password" placeholder="Contraseña" />
                    </div>

                    <button onClick={() => cookRegister(restaurant_id, cookData)} className="btn auth-submit-btn">
                        <i className="fa-solid fa-user-plus me-2"></i>Registrar cocinero
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegisterCook;
