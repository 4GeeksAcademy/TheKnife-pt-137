import { useEffect } from "react";
import { useReservation } from "../../hooks/useReservation";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const SingleReservation = () => {

    const { store } = useGlobalReducer();
    const { getSingleReservation } = useReservation();
    const { reservation_id } = useParams();

    useEffect(() => {
        if (reservation_id) {
            getSingleReservation(reservation_id);
        }
    }, [reservation_id]);

    const reservation = store.singleReservation;

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                    <h1 className="h4">Reservation for {reservation?.customer_name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Phone:</strong> {reservation?.phone || "-"}</li>
                        <li className="list-group-item"><strong>Party size:</strong> {reservation?.party_size}</li>
                        <li className="list-group-item"><strong>Time:</strong> {reservation?.reservation_time ? new Date(reservation.reservation_time).toLocaleString() : "Waitlist"}</li>
                        <li className="list-group-item"><strong>Status:</strong> {reservation?.status}</li>
                        <li className="list-group-item"><strong>Restaurant:</strong> {reservation?.restaurant_name}</li>
                        <li className="list-group-item"><strong>Table:</strong> {reservation?.table_number ?? "Not assigned"}</li>
                    </ul>
                    <Link to="/reservations" className="btn btn-outline-secondary">Back to reservations</Link>
                </div>
            </div>

        </div>
    );
};

export default SingleReservation;
