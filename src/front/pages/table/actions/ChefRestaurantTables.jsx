import React, { useEffect, useState } from "react";
import { useTable } from "../../../hooks/useTable";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent";

const ChefRestaurantTables = () => {

    const { getAllRestaurantTables, deactivateRestaurantTable } = useTable()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getAllRestaurantTables(restaurant_id).finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const sortedTables = [...store.tables].sort((a, b) => a.number - b.number)

    const tablesList = sortedTables.map((table) => {
        const isFree = table.status === "free"
        const menuId = `table-menu-${table.id}`
        return (
            <div className="product-row" key={table.id}>
                <div className={`order-icon ${isFree ? "table-icon-free" : "table-icon-occupied"}`}>
                    <i className="fa-solid fa-chair"></i>
                </div>
                <div className="product-row-info">
                    <div className="product-row-title">
                        <span className="product-row-name">Mesa #{table.number}</span>
                        <span className={`product-badge ${isFree ? "table-badge-free" : "table-badge-occupied"}`}>
                            {isFree ? "Disponible" : "Ocupada"}
                        </span>
                    </div>
                    <div className="order-row-meta">
                        <span><i className="fa-solid fa-location-dot"></i>{table.location}</span>
                    </div>
                </div>
                <div className="dropdown">
                    <button id={menuId} type="button" className="recipe-menu-btn recipe-menu-btn-inline" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={menuId}>
                        <li>
                            <Link className="dropdown-item" to={`/restaurants/${restaurant_id}/tables/edit/${table.id}`}>
                                <i className="fa-solid fa-pen me-2"></i>Editar mesa
                            </Link>
                        </li>
                        <li>
                            <button type="button" className="dropdown-item text-danger" onClick={() => deactivateRestaurantTable(restaurant_id, table.id)}>
                                <i className="fa-solid fa-ban me-2"></i>Desactivar mesa
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    })

    return (
        <div className="table_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Mesas</h1>
                <div className="d-flex gap-2">
                    <Link to={`/restaurants/${restaurant_id}/tables/inactive`} className="btn btn-outline-primary">Inactivas</Link>
                    <Link to={`/restaurants/${restaurant_id}/tables/create`} className="btn btn-primary">Añadir mesa</Link>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    {sortedTables.length > 0 ? (
                        <div className="product-list">
                            {tablesList}
                        </div>
                    ) : (
                        <p className="text-muted text-center py-3 mb-0">No hay mesas activas.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChefRestaurantTables;
