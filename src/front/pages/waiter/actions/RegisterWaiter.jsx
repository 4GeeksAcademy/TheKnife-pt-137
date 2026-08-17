import React, { useState } from "react";
import { useWaiter } from "../../../hooks/useWaiter";
import { Link, useParams } from "react-router-dom";
import { useCloudinary } from "../../../hooks/useCloudinary";

const RegisterWaiter = () => {

    const { restaurant_id } = useParams()
    const [waiterData, setWaiterData] = useState({ name: "", email: "", password: "", img_url: "" })
    const { waiterRegister } = useWaiter()
    const { uploadImage } = useCloudinary()

    return (
        <div className="simple-form-page">
            <div className="simple-form-wrap">
                <Link to={`/restaurants/${restaurant_id}/waiters`} className="page-back-link">
                    <i className="fa-solid fa-arrow-left"></i>Volver a camareros
                </Link>
                <div className="simple-form-card">
                    <div className="simple-form-icon">
                        <i className="fa-solid fa-bell-concierge"></i>
                    </div>
                    <h1 className="simple-form-title">Registrar camarero</h1>
                    <p className="simple-form-subtitle">Da de alta a un nuevo camarero.</p>

                    <div className="simple-form-field mb-3">
                        <label className="simple-form-label" htmlFor="name">Nombre</label>
                        <input className="form-control" onChange={(e) => setWaiterData({ ...waiterData, name: e.target.value })} value={waiterData.name} type="text" name="name" id="name" placeholder="Nombre del camarero" />
                    </div>

                    <div className="simple-form-field mb-3">
                        <label className="simple-form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setWaiterData({ ...waiterData, email: e.target.value })} value={waiterData.email} type="text" name="email" id="email" placeholder="camarero@restaurante.com" />
                    </div>

                    <div className="simple-form-field mb-4">
                        <label className="simple-form-label" htmlFor="password">Contraseña</label>
                        <input className="form-control" onChange={(e) => setWaiterData({ ...waiterData, password: e.target.value })} value={waiterData.password} type="password" name="password" id="password" placeholder="Contraseña" />
                    </div>

                    <div className="simple-form-field mb-4">
                        <label className="simple-form-label" htmlFor="image">Foto</label>
                        <input type="file" className="form-control" name="image" id="image" onChange={(e) => uploadImage(e, "cocinapp_images", setWaiterData, waiterData)} />
                    </div>

                    <button onClick={() => waiterRegister(restaurant_id, waiterData)} className="btn simple-form-submit-btn">
                        <i className="fa-solid fa-user-plus me-2"></i>Registrar camarero
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegisterWaiter;
