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
        if (!store.loggedWaiter.waiter.id) {
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

    const sortedTables = [...store.tables].sort((a, b) => a.number - b.number)

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

    function renderTableTile(table) {
        const isFree = table.status === "free"
        return (
            <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                type="button"
                className={`waiter-table-tile ${isFree ? "waiter-table-tile-free" : "waiter-table-tile-occupied"}`}
            >
                <span className="waiter-table-illustration">
                    <svg viewBox="0 0 100 100" className="waiter-table-svg" aria-hidden="true">
                        <rect x="38" y="2" width="24" height="16" rx="6" />
                        <rect x="82" y="38" width="16" height="24" rx="6" />
                        <rect x="38" y="82" width="24" height="16" rx="6" />
                        <rect x="2" y="38" width="16" height="24" rx="6" />
                        <circle cx="50" cy="50" r="26" />
                    </svg>
                    <span className="waiter-table-number">{table.number}</span>
                </span>
                <span className="waiter-table-status-pill">
                    <span className="waiter-table-status-dot"></span>
                    {isFree ? "Disponible" : "Ocupada"}
                </span>
            </button>
        )
    }

    return (
        <div className="waiter-dashboard">

            <div className="waiter-page-header">
                <div>
                    <h1 className="dashboard-welcome-title">Bienvenido, {currentWaiter.name}</h1>
                    <div className="dashboard-welcome-subtitle">
                        <i className="fa-solid fa-store"></i>
                        Restaurante: {currentWaiter.restaurant_name}
                    </div>
                </div>
            </div>

            <div className="waiter-tables-header">
                <h2 className="waiter-section-title">
                    <i className="fa-solid fa-chair"></i>Mesas
                </h2>
                <div className="d-flex gap-3 align-items-center">
                    {nextFixedNumber ? (
                        <button onClick={handleCreateTableClick} className="btn waiter-create-table-btn">
                            <i className="fa-solid fa-plus me-2"></i>Crear mesa
                        </button>
                    ) : (
                        <Link to={`/restaurants/${currentWaiter.restaurant_id}/waiter_tables/create`} className="btn waiter-create-table-btn">
                            <i className="fa-solid fa-plus me-2"></i>Crear mesa
                        </Link>
                    )}
                </div>
            </div>
            <hr className="waiter-tables-divider" />

            <div className="waiter-table-grid">
                {sortedTables.map(renderTableTile)}
            </div>

            {selectedTable && (
                <div className="waiter-order-form-card">
                    <h3 className="waiter-order-form-title">Nueva comanda — Mesa #{selectedTable.number}</h3>
                    <form onSubmit={handleCreateOrder}>
                        <div className="auth-field mb-3">
                            <label className="auth-label" htmlFor="people">Número de personas</label>
                            <input className="form-control" type="number" min="1" required
                                id="people" value={people}
                                onChange={(e) => setPeople(e.target.value)} />
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn waiter-create-table-btn">Crear comanda</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedTable(null)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}
        </div>

    )
}

export default WaiterDashboard;
