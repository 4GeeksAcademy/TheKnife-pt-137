import { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import { useWaiter } from "../../hooks/useWaiter";
import { useTable } from "../../hooks/useTable";
import { useOrder } from "../../hooks/useOrder";

const FIXED_TABLE_COUNT = 7

const WaiterDashboard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { waiterLogout, rehydrateWaiter } = useWaiter()
    const { getAllRestaurantTables, createRestaurantTable } = useTable()
    const { waiterCreateOrder } = useOrder()

    const [selectedTable, setSelectedTable] = useState(null)
    const [people, setPeople] = useState("")

    useEffect(() => {
        const waiterLogged = !!localStorage.getItem("waitertoken")
        if (!waiterLogged) {
            navigate("/waiter_login")
        } else if (!store.loggedWaiter.waiter.id) {
            rehydrateWaiter()
        }
    }, [])

    const currentWaiter = store.loggedWaiter.waiter

    useEffect(() => {
        if (currentWaiter.restaurant_id) {
            getAllRestaurantTables(currentWaiter.restaurant_id)
        }
    }, [currentWaiter.restaurant_id])

    function handleTableClick(table) {
        if (table.status === "free") {
            setSelectedTable(table)
            setPeople("")
        } else if (table.status === "occupied" && table.current_order_id) {
            navigate(`/restaurants/${currentWaiter.restaurant_id}/orders/${table.current_order_id}`)
        }
    }

    function handleCreateOrder(e) {
        e.preventDefault()
        waiterCreateOrder(currentWaiter.restaurant_id, { table_id: selectedTable.id, people })
    }

    const freeTables = store.tables.filter((table) => table.status === "free")
    const occupiedTables = store.tables.filter((table) => table.status === "occupied")

    const usedNumbers = store.tables.map((table) => table.number)
    let nextFixedNumber = null
    for (let n = 1; n <= FIXED_TABLE_COUNT; n++) {
        if (!usedNumbers.includes(n)) {
            nextFixedNumber = n
            break
        }
    }

    function handleCreateTableClick() {
        createRestaurantTable(currentWaiter.restaurant_id, {
            number: nextFixedNumber,
            location: "Main hall",
            status: "free"
        })
    }

    function renderTableCircle(table) {
        const isFree = table.status === "free"
        return (
            <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className="d-flex align-items-center justify-content-center border-0"
                style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    backgroundColor: isFree ? "#d4f7dc" : "#fbd5d5",
                    border: `3px solid ${isFree ? "#28a745" : "#dc3545"}`,
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: isFree ? "#1e7e34" : "#a71d2a",
                    cursor: "pointer"
                }}
            >
                {table.number}
            </button>
        )
    }

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="mb-1">Welcome back, {currentWaiter.name}</h1>
                    <h2 className="h5 text-muted mb-0">Restaurant: {store.loggedWaiter.restaurant}</h2>
                </div>
                <button onClick={waiterLogout} className="btn btn-primary">Log out</button>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">Tables</h3>
                <div className="d-flex gap-3 align-items-center">
                    <Link to={`/restaurants/${currentWaiter.restaurant_id}/waiter_tables`} className="small">Manage tables</Link>
                    {nextFixedNumber ? (
                        <button onClick={handleCreateTableClick} className="btn btn-primary btn-sm">Crear Mesa</button>
                    ) : (
                        <Link to={`/restaurants/${currentWaiter.restaurant_id}/waiter_tables/create`} className="btn btn-primary btn-sm">Crear Mesa</Link>
                    )}
                </div>
            </div>

            <h4 className="h6 text-muted">Free</h4>
            <div className="d-flex flex-wrap gap-4 mb-4">
                {freeTables.map(renderTableCircle)}
            </div>

            <h4 className="h6 text-muted">Occupied</h4>
            <div className="d-flex flex-wrap gap-4">
                {occupiedTables.map(renderTableCircle)}
            </div>

            {selectedTable && (
                <div className="card mt-4" style={{ maxWidth: "350px" }}>
                    <div className="card-body">
                        <h4 className="h6">New order — Table #{selectedTable.number}</h4>
                        <form onSubmit={handleCreateOrder}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="people">People</label>
                                <input className="form-control" type="number" min="1" required
                                    id="people" value={people}
                                    onChange={(e) => setPeople(e.target.value)} />
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">Crear comanda</button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedTable(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}

export default WaiterDashboard;
