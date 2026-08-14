import React, { useState } from "react";
import { useHost } from "../../../hooks/useHost";
import { useParams, useNavigate } from "react-router-dom";

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
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Register host</div>
                <div className="card-body">

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, name: e.target.value })} value={hostData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, email: e.target.value })} value={hostData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, password: e.target.value })} value={hostData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={handleRegister} className="btn btn-primary w-100 mb-3">Register host</button>

                </div>
            </div>

        </div>
    );
};

export default RegisterHost;
