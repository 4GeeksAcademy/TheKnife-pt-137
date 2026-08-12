import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useReservation } from "../../../hooks/useReservation";
import { useHost } from "../../../hooks/useHost";

const HostReservations = () => {

    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const { getHostReservations } = useReservation();
    const { rehydrateHost } = useHost();

    const [filters, setFilters] = useState({ name: "", date: "" });

    useEffect(() => {
        const hostLogged = !!localStorage.getItem("hosttoken");
        if (!hostLogged) {
            navigate("/host_login");
            return;
        }
        if (!store.loggedHost.host.id) {
            rehydrateHost();
        }
        getHostReservations();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        getHostReservations(filters);
    };

    const handleClear = () => {
        setFilters({ name: "", date: "" });
        getHostReservations();
    };

    const reservations = store.reservations || [];

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-1">Reservations</h1>
                    <h2 className="h6 text-muted mb-0">Restaurant: {store.loggedHost.restaurant}</h2>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/host_dashboard" className="btn btn-outline-secondary">Back to dashboard</Link>
                    <Link to="/host_create_reservation" className="btn btn-primary">New reservation</Link>
                </div>
            </div>

            <form className="card mb-3" onSubmit={handleSearch}>
                <div className="card-body">
                    <div className="row g-2 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label" htmlFor="search_name">Customer name</label>
                            <input className="form-control" type="text" id="search_name" placeholder="Search by name"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label" htmlFor="search_date">Date</label>
                            <input className="form-control" type="date" id="search_date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                        </div>
                        <div className="col-md-3 d-flex gap-2">
                            <button type="submit" className="btn btn-primary flex-grow-1">Search</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={handleClear}>Clear</button>
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
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th>Party</th>
                                    <th>Table</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            No reservations yet.
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.map((r) => (
                                        <tr key={r.id}>
                                            <td>{r.customer_name}{!r.client_id && <span className="badge bg-secondary ms-2">Walk-in</span>}</td>
                                            <td>{r.phone || "—"}</td>
                                            <td>{r.party_size}</td>
                                            <td>{r.table_number ?? "—"}</td>
                                            <td>{r.reservation_time ? new Date(r.reservation_time).toLocaleString() : "—"}</td>
                                            <td><span className="badge bg-info text-dark">{r.status}</span></td>
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
