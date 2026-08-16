import React, { useState } from "react";
import { useTable } from "../../../hooks/useTable";
import { Link, useParams, useNavigate } from "react-router-dom";

const ChefCreateTable = () => {

    const { restaurant_id } = useParams()
    const navigate = useNavigate()
    const { createRestaurantTable } = useTable()
    const [tableData, setTableData] = useState({ number: "", location: "" })

    async function handleSubmit(e) {
        e.preventDefault()
        await createRestaurantTable(restaurant_id, { ...tableData, status: "free" })
        navigate(`/restaurants/${restaurant_id}/tables`)
    }

    return (
        <div className="simple-form-page">
            <div className="simple-form-wrap">
                <Link to={`/restaurants/${restaurant_id}/tables`} className="page-back-link">
                    <i className="fa-solid fa-arrow-left"></i>Volver a mesas
                </Link>
                <div className="simple-form-card">
                    <div className="simple-form-icon">
                        <i className="fa-solid fa-chair"></i>
                    </div>
                    <h1 className="simple-form-title">Añadir mesa</h1>
                    <p className="simple-form-subtitle">Da de alta una nueva mesa para el restaurante.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="simple-form-field mb-3">
                            <label className="simple-form-label" htmlFor="number">Número</label>
                            <input className="form-control" type="number" min="1" required
                                id="number" value={tableData.number}
                                onChange={(e) => setTableData({ ...tableData, number: e.target.value })}
                                placeholder="Número de mesa" />
                        </div>

                        <div className="simple-form-field mb-4">
                            <label className="simple-form-label" htmlFor="location">Ubicación</label>
                            <input className="form-control" required
                                id="location" value={tableData.location}
                                onChange={(e) => setTableData({ ...tableData, location: e.target.value })}
                                placeholder="p. ej. terraza, salón principal..." />
                        </div>

                        <button type="submit" className="btn simple-form-submit-btn">
                            <i className="fa-solid fa-plus me-2"></i>Añadir mesa
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChefCreateTable;
