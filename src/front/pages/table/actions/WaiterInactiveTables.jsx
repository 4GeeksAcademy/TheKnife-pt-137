import React, { useEffect } from "react"
import { useTable } from "../../../hooks/useTable"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { Link, useParams } from "react-router-dom"

const WaiterInactiveTables = () => {
    const { fetchInactiveRestaurantTables, activateRestaurantTable } = useTable()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    useEffect(() => {
        fetchInactiveRestaurantTables(restaurant_id)
    }, [])

    const tablesList = store.inactiveTables.map((t) => (
        <div key={t.id} className="col-md-4">
            <div className="card h-100">
                <div className="card-body d-flex flex-column">
                    <h2 className="h5">Table #{t.number}</h2>
                    <p className="mb-1"><strong>Status:</strong> {t.status}</p>
                    <p className="mb-3"><strong>Location:</strong> {t.location}</p>
                    <button className="btn btn-success btn-sm mt-auto" onClick={() => activateRestaurantTable(restaurant_id, t)}>Activate</button>
                </div>
            </div>
        </div>
    ))

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Inactive tables</h1>

            {store.inactiveTables.length > 0 ? (
                <div className="row g-3">
                    {tablesList}
                </div>
            ) : (
                <p className="text-muted">No hay mesas desactivadas.</p>
            )}

            <Link to={`/restaurants/${restaurant_id}/waiter_tables`} className="d-inline-block mt-3">Back to active tables</Link>
        </div>
    )
}

export default WaiterInactiveTables
