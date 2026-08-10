import { useState } from "react"
import { useTable } from "../../../hooks/useTable"
import { Link, useParams, useNavigate } from "react-router-dom"

const WaiterCreateTable = () => {
    const { createRestaurantTable } = useTable()
    const { restaurant_id } = useParams()
    const navigate = useNavigate()

    const [newTable, setNewTable] = useState({ number: "", location: "" })

    async function handleSubmit(e) {
        e.preventDefault()
        await createRestaurantTable(restaurant_id, { ...newTable, status: "free" })
        navigate("/waiter_dashboard")
    }

    return (
        <div className="container py-5" style={{ maxWidth: "400px" }}>
            <div className="card">
                <div className="card-header text-center">Create table</div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="number">Number</label>
                            <input className="form-control" type="number" min="1" required
                                id="number" value={newTable.number}
                                onChange={(e) => setNewTable({ ...newTable, number: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="location">Location</label>
                            <input className="form-control" required
                                id="location" value={newTable.location}
                                onChange={(e) => setNewTable({ ...newTable, location: e.target.value })} />
                        </div>
                        <button className="btn btn-primary w-100 mb-3" type="submit">Create table</button>
                    </form>
                    <div className="text-center">
                        <Link to="/waiter_dashboard">Back to dashboard</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaiterCreateTable
