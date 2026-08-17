import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useReservation } from "../../../hooks/useReservation";
import { useHost } from "../../../hooks/useHost";
import { useTable } from "../../../hooks/useTable";

const CreateHostReservation = () => {

    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const { createHostReservation } = useReservation();
    const { rehydrateHost } = useHost();
    const { getHostTables } = useTable();

    const [reservationData, setReservationData] = useState({
        customer_name: "",
        phone: "",
        party_size: "",
        table_id: "",
        status: "waiting"
    });
    const [reservationDate, setReservationDate] = useState("");
    const [reservationTime, setReservationTime] = useState("");

    function handleCreate() {
        createHostReservation({
            ...reservationData,
            reservation_time: reservationDate && reservationTime ? `${reservationDate}T${reservationTime}` : ""
        });
    }

    useEffect(() => {
        const hostLogged = !!localStorage.getItem("hosttoken");
        if (!hostLogged) {
            navigate("/host_login");
            return;
        }
        if (!store.loggedHost.host.id) {
            rehydrateHost();
        }
        getHostTables();
    }, []);

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">New reservation (walk-in / guest)</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="customer_name">Customer name</label>
                        <input className="form-control" type="text" name="customer_name" id="customer_name"
                            value={reservationData.customer_name}
                            onChange={(e) => setReservationData({ ...reservationData, customer_name: e.target.value })} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="phone">Phone (optional)</label>
                        <input className="form-control" type="text" name="phone" id="phone"
                            value={reservationData.phone}
                            onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="party_size">Party size</label>
                        <input className="form-control" type="number" min="1" name="party_size" id="party_size"
                            value={reservationData.party_size}
                            onChange={(e) => setReservationData({ ...reservationData, party_size: e.target.value })} />
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label className="form-label" htmlFor="reservation_date">Date (optional)</label>
                            <input className="form-control" type="date" name="reservation_date" id="reservation_date"
                                value={reservationDate}
                                onChange={(e) => setReservationDate(e.target.value)} />
                        </div>
                        <div className="col">
                            <label className="form-label" htmlFor="reservation_time">Time (optional)</label>
                            <input className="form-control" type="time" name="reservation_time" id="reservation_time"
                                value={reservationTime}
                                onChange={(e) => setReservationTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="table_id">Table (optional)</label>
                        <select className="form-select" name="table_id" id="table_id"
                            value={reservationData.table_id}
                            onChange={(e) => setReservationData({ ...reservationData, table_id: e.target.value })}>
                            <option value="">No table assigned</option>
                            {store.tables.map((table) => (
                                <option key={table.id} value={table.id}>
                                    Table {table.number} — {table.location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="status">Status</label>
                        <select className="form-select" name="status" id="status"
                            value={reservationData.status}
                            onChange={(e) => setReservationData({ ...reservationData, status: e.target.value })}>
                            <option value="waiting">Waiting</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="seated">Seated</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <button onClick={handleCreate} className="btn btn-primary w-100 mb-3">
                        Create reservation
                    </button>

                    <div className="text-center">
                        <Link to="/host_reservations">Back to reservations</Link>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default CreateHostReservation;
