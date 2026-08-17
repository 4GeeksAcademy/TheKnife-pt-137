import React, { useEffect, useState } from "react";
import { useTable } from "../../../hooks/useTable";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams, useNavigate } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";

const ChefEditTable = () => {

    const { restaurant_id, table_id } = useParams()
    const navigate = useNavigate()
    const { store } = useGlobalReducer()
    const { getAllRestaurantTables, editRestaurantTable } = useTable()
    const [loading, setLoading] = useState(true)
    const [tableData, setTableData] = useState({ number: "", status: "free", location: "" })

    useEffect(() => {
        setLoading(true)
        getAllRestaurantTables(restaurant_id).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const table = store.tables.find((t) => String(t.id) === table_id)
        if (table) {
            setTableData({ number: table.number, status: table.status, location: table.location })
        }
    }, [store.tables, table_id])

    async function handleSubmit(e) {
        e.preventDefault()
        await editRestaurantTable(restaurant_id, table_id, tableData)
        navigate(`/restaurants/${restaurant_id}/tables`)
    }

    if (loading) return <LoadingComponent />

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
                    <h1 className="simple-form-title">Editar mesa</h1>
                    <p className="simple-form-subtitle">Actualiza el número, la ubicación o el estado de la mesa.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="simple-form-field mb-3">
                            <label className="simple-form-label" htmlFor="number">Número</label>
                            <input className="form-control" type="number" min="1" required
                                id="number" value={tableData.number}
                                onChange={(e) => setTableData({ ...tableData, number: e.target.value })} />
                        </div>

                        <div className="simple-form-field mb-3">
                            <label className="simple-form-label" htmlFor="location">Ubicación</label>
                            <input className="form-control" required
                                id="location" value={tableData.location}
                                onChange={(e) => setTableData({ ...tableData, location: e.target.value })} />
                        </div>

                        <div className="simple-form-field mb-4">
                            <label className="simple-form-label" htmlFor="status">Estado</label>
                            <select className="form-select" id="status" value={tableData.status}
                                onChange={(e) => setTableData({ ...tableData, status: e.target.value })}>
                                <option value="free">Disponible</option>
                                <option value="occupied">Ocupada</option>
                            </select>
                        </div>

                        <button type="submit" className="btn simple-form-submit-btn">
                            <i className="fa-solid fa-check me-2"></i>Guardar cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChefEditTable;
