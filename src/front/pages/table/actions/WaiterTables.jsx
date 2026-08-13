import React, { useEffect, useState } from "react"
import { useTable } from "../../../hooks/useTable"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { Link, useParams } from "react-router-dom"

const WaiterTables = () => {
    const { getAllRestaurantTables, editRestaurantTable, deactivateRestaurantTable } = useTable()
    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()

    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({ number: "", status: "", location: "" })

    useEffect(() => {
        getAllRestaurantTables(restaurant_id)
    }, [])

    function startEditing(table) {
        setEditingId(table.id)
        setEditData({ number: table.number, status: table.status, location: table.location })
    }

    function handleEditSubmit(e, table_id) {
        e.preventDefault()
        editRestaurantTable(restaurant_id, table_id, editData)
        setEditingId(null)
    }

    const tablesList = store.tables.map((t) => {
        if (editingId === t.id) {
            return (
                <div key={t.id} className="col-md-4">
                    <form className="card h-100 p-3" onSubmit={(e) => handleEditSubmit(e, t.id)}>
                        <input className="form-control mb-2" type="number" value={editData.number}
                            onChange={(e) => setEditData({ ...editData, number: e.target.value })} placeholder="Number" required />
                        <select className="form-select mb-2" value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
                            <option value="free">Free</option>
                            <option value="occupied">Occupied</option>
                        </select>
                        <input className="form-control mb-2" value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })} placeholder="Location" required />
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success btn-sm">Save</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )
        }
        return (
            <div key={t.id} className="col-md-4">
                <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                        <h2 className="h5">Table #{t.number}</h2>
                        <p className="mb-1"><strong>Status:</strong> {t.status}</p>
                        <p className="mb-3"><strong>Location:</strong> {t.location}</p>
                        <div className="d-flex gap-2 mt-auto">
                            <button className="btn btn-warning btn-sm" onClick={() => startEditing(t)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => deactivateRestaurantTable(restaurant_id, t.id)}>Deactivate</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="container py-4">
            <Link to={`/restaurants/${restaurant_id}/waiter_tables/inactive`}>
                <button className="btn btn-outline-secondary mb-4">View inactive tables</button>
            </Link>
            <h1 className="h4 mb-3">Tables</h1>

            <div className="row g-3">
                {tablesList}
            </div>

            <Link to="/waiter_dashboard" className="d-inline-block mt-3">Back to dashboard</Link>
        </div>
    )
}

export default WaiterTables