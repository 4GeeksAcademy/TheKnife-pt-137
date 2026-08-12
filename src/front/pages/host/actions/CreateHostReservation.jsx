import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { useReservation } from "../../../hooks/useReservation";
import { useHost } from "../../../hooks/useHost";

const CreateHostReservation = () => {

    const { store } = useGlobalReducer();
    const navigate = useNavigate();
    const { createHostReservation } = useReservation();
    const { rehydrateHost } = useHost();

    const [reservationData, setReservationData] = useState({
        customer_name: "",
        phone: "",
        party_size: "",
        reservation_time: "",
        status: "waiting"
    });

    useEffect(() => {
        const hostLogged = !!localStorage.getItem("hosttoken");
        if (!hostLogged) {
            navigate("/host_login");
            return;
        }
        if (!store.loggedHost.host.id) {
            rehydrateHost();
        }
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

                    <div className="mb-3">
                        <label className="form-label" htmlFor="reservation_time">Date & time (optional)</label>
                        <input className="form-control" type="datetime-local" name="reservation_time" id="reservation_time"
                            value={reservationData.reservation_time}
                            onChange={(e) => setReservationData({ ...reservationData, reservation_time: e.target.value })} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="status">Status</label>
                        <select className="form-select" name="status" id="status"
                            value={reservationData.status}
                            onChange={(e) => setReservationData({ ...reservationData, status: e.target.value })}>
                            <option value="waiting">Waiting</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="seated">Seated</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <button onClick={() => createHostReservation(reservationData)} className="btn btn-primary w-100 mb-3">
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
