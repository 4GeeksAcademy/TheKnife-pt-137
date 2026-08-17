import { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link, useNavigate } from "react-router-dom";
import { useWaiter } from "../../hooks/useWaiter";
import { useTable } from "../../hooks/useTable";
import { useOrder } from "../../hooks/useOrder";
import { useInterval } from "../../hooks/useInterval";

const FIXED_TABLE_COUNT = 7
const POLL_INTERVAL_MS = 5000

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

    // Show/hide the order modal in sync with selectedTable, and clear it back to null
    // whenever the modal closes via the backdrop, Esc or the close/cancel buttons.
    useEffect(() => {
        const el = document.getElementById("waiterOrderModal")
        if (!el || !window.bootstrap) return
        const modal = window.bootstrap.Modal.getOrCreateInstance(el)
        if (selectedTable) {
            modal.show()
        } else {
            modal.hide()
        }
        const handleHidden = () => setSelectedTable(null)
        el.addEventListener("hidden.bs.modal", handleHidden)
        return () => el.removeEventListener("hidden.bs.modal", handleHidden)
    }, [selectedTable])

    const currentWaiter = store.loggedWaiter.waiter

    useEffect(() => {
        if (currentWaiter.restaurant_id) {
            getAllRestaurantTables(currentWaiter.restaurant_id)
        }
    }, [currentWaiter.restaurant_id])

    // Refresca en segundo plano para que sala vea las mesas ocupadas/liberadas en tiempo real.
    useInterval(() => {
        if (currentWaiter.restaurant_id) {
            getAllRestaurantTables(currentWaiter.restaurant_id)
        }
    }, POLL_INTERVAL_MS)

    function handleTableClick(table) {
        if (table.status === "occupied" && table.current_order_id) {
            navigate(`/restaurants/${currentWaiter.restaurant_id}/orders/${table.current_order_id}`)
        } else if (table.status === "free" || table.status === "occupied") {
            // "free" (walk-in) or "occupied" with no order yet (host already sat a reservation here,
            // in which case the party size is already known from the reservation)
            setSelectedTable(table)
            setPeople(table.seated_reservation ? String(table.seated_reservation.party_size) : "")
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
        const isSeatedWithoutOrder = table.status === "occupied" && !table.current_order_id
        const isReserved = isFree && !!table.next_reservation

        let tileModifier = "free"
        let statusLabel = "Disponible"
        if (!isFree) {
            tileModifier = "occupied"
            statusLabel = isSeatedWithoutOrder ? "Sentados — tomar comanda" : "Ocupada"
        } else if (isReserved) {
            tileModifier = "reserved"
            const reservedAt = new Date(table.next_reservation.reservation_time)
            statusLabel = `Reservada ${reservedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        }

        return (
            <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                type="button"
                className={`waiter-table-tile waiter-table-tile-${tileModifier}`}
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
                    {statusLabel}
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

            <div className="modal fade" id="waiterOrderModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedTable ? `Nueva comanda — Mesa #${selectedTable.number}` : "Nueva comanda"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <form onSubmit={handleCreateOrder}>
                            <div className="modal-body">
                                <div className="auth-field mb-0">
                                    <label className="auth-label" htmlFor="people">Número de personas</label>
                                    <input className="form-control" type="number" min="1" required
                                        id="people" value={people}
                                        onChange={(e) => setPeople(e.target.value)} />
                                    {selectedTable?.seated_reservation && (
                                        <div className="form-text">
                                            Según la reserva de {selectedTable.seated_reservation.customer_name}. Ajusta el número si hace falta.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn waiter-create-table-btn">Crear comanda</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default WaiterDashboard;
