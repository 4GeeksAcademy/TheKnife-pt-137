import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useClientReservation } from "../../hooks/useClientReservation"

const ClientReservations = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { fetchMyReservations, cancelMyReservation } = useClientReservation()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchMyReservations().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const now = new Date()
    const upcoming = store.myReservations.filter((reservation) =>
        reservation.status !== "cancelled" &&
        (!reservation.reservation_time || new Date(reservation.reservation_time) >= now)
    )

    function handleCancel(reservation_id) {
        if (window.confirm("¿Seguro que quieres cancelar esta reserva?")) {
            cancelMyReservation(reservation_id)
        }
    }

    return (
        <div className="container py-4">
            <button onClick={() => navigate(-1)} className="btn btn-link d-inline-block mb-3 ps-0">Back</button>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 mb-0">Mis reservas</h1>
                <Link to="/booking_history" className="btn btn-outline-secondary btn-sm">Booking history</Link>
            </div>

            {upcoming.length === 0 ? (
                <p className="text-muted">No tienes reservas próximas.</p>
            ) : (
                <div className="row g-3">
                    {upcoming.map((reservation) => (
                        <div key={reservation.id} className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h3 className="h6">{reservation.restaurant_name}</h3>
                                    <p className="card-text mb-1">{reservation.customer_name} · {reservation.phone}</p>
                                    <p className="card-text mb-1">{reservation.party_size} personas</p>
                                    <p className="card-text mb-2">{reservation.reservation_time ? new Date(reservation.reservation_time).toLocaleString() : ""}</p>
                                    <span className="badge bg-secondary mb-2">{reservation.status}</span>
                                    <div className="d-flex gap-2">
                                        <Link to={`/edit_my_reservation/${reservation.id}`} className="btn btn-outline-primary btn-sm">Edit</Link>
                                        <button onClick={() => handleCancel(reservation.id)} className="btn btn-outline-danger btn-sm">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ClientReservations
