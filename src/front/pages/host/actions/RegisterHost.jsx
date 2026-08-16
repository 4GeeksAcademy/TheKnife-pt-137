import React, { useState } from "react";
import { useHost } from "../../../hooks/useHost";
import { Link, useParams, useNavigate } from "react-router-dom";

const RegisterHost = () => {

    const { restaurant_id } = useParams();
    const navigate = useNavigate();
    const { hostRegister } = useHost();
    const [hostData, setHostData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const noRestaurant = !restaurant_id || restaurant_id === "undefined";

    async function handleRegister() {
        setError("");
        if (noRestaurant) {
            setError("No tienes un restaurante asignado. Crea tu restaurante primero desde el dashboard.");
            return;
        }
        try {
            await hostRegister(restaurant_id, hostData);
            navigate("/chef_dashboard");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card-wrap">
                <Link to="/chef_dashboard" className="page-back-link">
                    <i className="fa-solid fa-arrow-left"></i>Volver al panel
                </Link>
                <div className="auth-card">
                    <div className="auth-icon">
                        <i className="fa-solid fa-door-open"></i>
                    </div>
                    <h1 className="auth-title">Registrar host</h1>
                    <p className="auth-subtitle">Da de alta al host del restaurante.</p>

                    {error && <div className="alert alert-danger text-start">{error}</div>}

                    <div className="auth-field mb-3">
                        <label className="auth-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, name: e.target.value })} value={hostData.name} type="text" name="name" id="name" placeholder="Nombre del host" />
                    </div>

                    <div className="auth-field mb-3">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, email: e.target.value })} value={hostData.email} type="text" name="email" id="email" placeholder="host@restaurante.com" />
                    </div>

                    <div className="auth-field mb-4">
                        <label className="auth-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, password: e.target.value })} value={hostData.password} type="password" name="password" id="password" placeholder="Contraseña" />
                    </div>

                    <button onClick={handleRegister} className="btn auth-submit-btn">
                        <i className="fa-solid fa-user-plus me-2"></i>Registrar host
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterHost;
