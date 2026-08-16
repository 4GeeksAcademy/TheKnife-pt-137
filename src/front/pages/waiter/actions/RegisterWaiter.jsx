import React, { useState } from "react";
import { useWaiter } from "../../../hooks/useWaiter";
import { Link, useParams } from "react-router-dom";

const RegisterWaiter = () => {

    const { restaurant_id } = useParams()
    const [waiterData, setWaiterData] = useState({ name: "", email: "", password: "" })
    const { waiterRegister } = useWaiter()

    return (
        <div className="auth-page">
            <div className="auth-card-wrap">
                <Link to={`/restaurants/${restaurant_id}/waiters`} className="page-back-link">
                    <i className="fa-solid fa-arrow-left"></i>Volver a camareros
                </Link>
                <div className="auth-card">
                    <div className="auth-icon">
                        <i className="fa-solid fa-bell-concierge"></i>
                    </div>
                    <h1 className="auth-title">Registrar camarero</h1>
                    <p className="auth-subtitle">Da de alta a un nuevo camarero.</p>

                    <div className="auth-field mb-3">
                        <label className="auth-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e) => setWaiterData({ ...waiterData, name: e.target.value })} value={waiterData.name} type="text" name="name" id="name" placeholder="Nombre del camarero" />
                    </div>

                    <div className="auth-field mb-3">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setWaiterData({ ...waiterData, email: e.target.value })} value={waiterData.email} type="text" name="email" id="email" placeholder="camarero@restaurante.com" />
                    </div>

                    <div className="auth-field mb-4">
                        <label className="auth-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e) => setWaiterData({ ...waiterData, password: e.target.value })} value={waiterData.password} type="password" name="password" id="password" placeholder="Contraseña" />
                    </div>

                    <button onClick={() => waiterRegister(restaurant_id, waiterData)} className="btn auth-submit-btn">
                        <i className="fa-solid fa-user-plus me-2"></i>Registrar camarero
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegisterWaiter;
