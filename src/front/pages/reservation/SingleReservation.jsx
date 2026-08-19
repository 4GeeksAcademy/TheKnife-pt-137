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
                    <h1 className="h4">Reserva de {reservation?.customer_name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Teléfono:</strong> {reservation?.phone || "-"}</li>
                        <li className="list-group-item"><strong>Número de personas:</strong> {reservation?.party_size}</li>
                        <li className="list-group-item"><strong>Hora:</strong> {reservation?.reservation_time ? new Date(reservation.reservation_time).toLocaleString() : "Lista de espera"}</li>
                        <li className="list-group-item"><strong>Estado:</strong> {reservation?.status}</li>
                        <li className="list-group-item"><strong>Restaurante:</strong> {reservation?.restaurant_name}</li>
                        <li className="list-group-item"><strong>Mesa:</strong> {reservation?.table_number ?? "Sin asignar"}</li>
                    </ul>
                    <Link to="/reservations" className="btn btn-outline-secondary">Volver a reservas</Link>
                </div>
            </div>

        </div>
    );
};

export default SingleReservation;
