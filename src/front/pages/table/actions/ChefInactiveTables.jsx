import React, { useEffect, useState } from "react";
import { useTable } from "../../../hooks/useTable";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";

const ChefInactiveTables = () => {

    const { fetchInactiveRestaurantTables, activateRestaurantTable } = useTable()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchInactiveRestaurantTables(restaurant_id).finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const sortedTables = [...store.inactiveTables].sort((a, b) => a.number - b.number)

    return (
        <div className="table_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Mesas inactivas</h1>
                <Link to={`/restaurants/${restaurant_id}/tables`} className="btn btn-outline-primary">Ver activas</Link>
            </div>

            <div className="card">
                <div className="card-body">
                    {sortedTables.length > 0 ? (
                        <div className="product-list">
                            {sortedTables.map((table) => (
                                <div className="product-row" key={table.id}>
                                    <div className="order-icon table-icon-inactive">
                                        <i className="fa-solid fa-chair"></i>
                                    </div>
                                    <div className="product-row-info">
                                        <div className="product-row-title">
                                            <span className="product-row-name">Mesa #{table.number}</span>
                                            <span className="product-badge order-badge-pending">Inactiva</span>
                                        </div>
                                        <div className="order-row-meta">
                                            <span><i className="fa-solid fa-location-dot"></i>{table.location}</span>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-outline-success btn-sm" onClick={() => activateRestaurantTable(restaurant_id, table)}>
                                        <i className="fa-solid fa-rotate-left me-1"></i>Reactivar
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted text-center py-3 mb-0">No hay mesas desactivadas.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChefInactiveTables;
