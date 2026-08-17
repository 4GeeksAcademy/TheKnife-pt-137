import React, { useState } from "react";
import { useHost } from "../../../hooks/useHost";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCloudinary } from "../../../hooks/useCloudinary";

const RegisterHost = () => {

    const { restaurant_id } = useParams();
    const navigate = useNavigate();
    const { hostRegister } = useHost();
    const [hostData, setHostData] = useState({ name: "", email: "", password: "", img_url: "" });
    const [error, setError] = useState("");
    const { uploadImage } = useCloudinary()

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
        <div className="simple-form-page">
            <div className="simple-form-wrap">
                <Link to="/chef_dashboard" className="page-back-link">
                    <i className="fa-solid fa-arrow-left"></i>Volver al panel
                </Link>
                <div className="simple-form-card">
                    <div className="simple-form-icon">
                        <i className="fa-solid fa-door-open"></i>
                    </div>
                    <h1 className="simple-form-title">Registrar host</h1>
                    <p className="simple-form-subtitle">Da de alta al host del restaurante.</p>

                    {error && <div className="alert alert-danger text-start">{error}</div>}

                    <div className="simple-form-field mb-3">
                        <label className="simple-form-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, name: e.target.value })} value={hostData.name} type="text" name="name" id="name" placeholder="Nombre del host" />
                    </div>

                    <div className="simple-form-field mb-3">
                        <label className="simple-form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, email: e.target.value })} value={hostData.email} type="text" name="email" id="email" placeholder="host@restaurante.com" />
                    </div>

                    <div className="simple-form-field mb-4">
                        <label className="simple-form-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, password: e.target.value })} value={hostData.password} type="password" name="password" id="password" placeholder="Contraseña" />
                    </div>

                    <div className="simple-form-field mb-4">
                        <label className="simple-form-label" htmlFor="image">Foto</label>
                        <input type="file" className="form-control" name="image" id="image" onChange={(e) => uploadImage(e, "cocinapp_images", setHostData, hostData)} />
                    </div>

                    <button onClick={handleRegister} className="btn simple-form-submit-btn">
                        <i className="fa-solid fa-user-plus me-2"></i>Registrar host
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterHost;
