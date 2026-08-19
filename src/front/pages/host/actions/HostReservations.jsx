import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useReservation } from "../../../hooks/useReservation";
import { useHost } from "../../../hooks/useHost";
import { useTable } from "../../../hooks/useTable";

const STATUS_OPTIONS = ["waiting", "confirmed", "seated", "completed", "cancelled"];
const STATUS_LABELS = {
    waiting: "En espera",
    confirmed: "Confirmada",
    seated: "En mesa",
    completed: "Completada",
    cancelled: "Cancelada"
};

const HostReservations = ({ history = false }) => {

    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const { getHostReservations, updateHostReservationStatus, assignReservationTable } = useReservation();
    const { rehydrateHost } = useHost();
    const { getHostTables } = useTable();

    const [filters, setFilters] = useState({ name: "", date: "" });
    // Reservation being marked "seated" that has no table yet: id + the table picked in the inline prompt
    const [seatPrompt, setSeatPrompt] = useState(null);

    // Merge the history flag into whatever filters are active
    const withScope = (extra = {}) => (history ? { ...extra, history: true } : extra);

    useEffect(() => {
        const hostLogged = !!localStorage.getItem("hosttoken");
        if (!hostLogged) {
            navigate("/host_login");
            return;
        }
        if (!store.loggedHost.host.id) {
            rehydrateHost();
        }
        getHostReservations(withScope());
        getHostTables();
    }, [history]);

    const handleSearch = (e) => {
        e.preventDefault();
        getHostReservations(withScope(filters));
    };

    const handleClear = () => {
        setFilters({ name: "", date: "" });
        getHostReservations(withScope());
    };

    const handleStatusChange = async (reservationId, status, tableId = null) => {
        if (status === "seated" && !tableId) {
            const reservation = reservations.find((r) => r.id === reservationId);
            if (!reservation.table_id) {
                // No table on the reservation yet: ask for one instead of calling the API.
                setSeatPrompt({ reservationId, tableId: "" });
                return;
            }
        }
        const ok = await updateHostReservationStatus(reservationId, status, tableId);
        if (ok) {
            setSeatPrompt(null);
            getHostReservations(withScope(filters));
        }
    };

    const handleTableChange = async (reservationId, tableId) => {
        if (!tableId) return;
        const ok = await assignReservationTable(reservationId, tableId);
        if (ok) getHostReservations(withScope(filters));
    };

    const reservations = store.reservations || [];
    const availableTables = store.tables || [];

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">{history ? "Historial de reservas" : "Reservas"}</h1>
                    <h2 className="h6 text-muted mb-0">Restaurante: {store.loggedHost.restaurant}</h2>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/host_dashboard" className="btn btn-outline-secondary">Volver al panel</Link>
                    {history ? (
                        <Link to="/host_reservations" className="btn btn-outline-primary">Reservas activas</Link>
                    ) : (
                        <Link to="/host_reservations_history" className="btn btn-outline-primary">Ver historial</Link>
                    )}
                    <Link to="/host_create_reservation" className="btn btn-primary">Nueva reserva</Link>
                </div>
            </div>

            <form className="card mb-3" onSubmit={handleSearch}>
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label" htmlFor="search_name">Nombre del cliente</label>
                            <input className="form-control" type="text" id="search_name" placeholder="Buscar por nombre"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" htmlFor="search_date">Fecha</label>
                            <input className="form-control" type="date" id="search_date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                        </div>
                        <div className="col-md-3 d-flex gap-2">
                            <button type="submit" className="btn btn-primary flex-grow-1">Buscar</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>Limpiar</button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Teléfono</th>
                                    <th>Personas</th>
                                    <th>Mesa</th>
                                    <th>Hora</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            {history ? "No hay reservas en el historial." : "No hay reservas activas."}
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.map((r) => (
                                        <tr key={r.id}>
                                            <td>{r.customer_name}{!r.client_id && <span className="badge bg-secondary ms-2">Sin reserva</span>}</td>
                                            <td>{r.phone || "—"}</td>
                                            <td>{r.party_size}</td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    style={{ minWidth: "150px" }}
                                                    value={r.table_id ?? ""}
                                                    onChange={(e) => handleTableChange(r.id, e.target.value)}>
                                                    <option value="">Sin mesa asignada</option>
                                                    {availableTables.map((t) => (
                                                        <option key={t.id} value={t.id}>
                                                            Mesa {t.number} — {t.location}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>{r.reservation_time ? new Date(r.reservation_time).toLocaleString() : "—"}</td>
                                            <td>
                                                {seatPrompt?.reservationId === r.id ? (
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <select
                                                            className="form-select form-select-sm"
                                                            style={{ minWidth: "160px" }}
                                                            value={seatPrompt.tableId}
                                                            onChange={(e) => setSeatPrompt({ ...seatPrompt, tableId: e.target.value })}>
                                                            <option value="">Elige una mesa…</option>
                                                            {availableTables.map((t) => (
                                                                <option key={t.id} value={t.id}>
                                                                    Mesa {t.number} — {t.location}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"
                                                            disabled={!seatPrompt.tableId}
                                                            onClick={() => handleStatusChange(r.id, "seated", seatPrompt.tableId)}>
                                                            Confirmar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => setSeatPrompt(null)}>
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{ minWidth: "120px" }}
                                                        value={r.status}
                                                        onChange={(e) => handleStatusChange(r.id, e.target.value)}>
                                                        {STATUS_OPTIONS.map((s) => (
                                                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HostReservations;
