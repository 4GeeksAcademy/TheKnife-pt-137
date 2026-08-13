import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useClientReservation } from "../../hooks/useClientReservation"

const BookingHistory = () => {

    const { store } = useGlobalReducer()
    const { fetchMyReservations } = useClientReservation()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchMyReservations().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const allReservations = [...store.myReservations].sort((a, b) =>
        new Date(b.reservation_time || b.created_at) - new Date(a.reservation_time || a.created_at)
    )

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Booking history</h1>

            {allReservations.length === 0 ? (
                <p className="text-muted">Todavía no has realizado ninguna reserva.</p>
            ) : (
                <div className="row g-3">
                    {allReservations.map((reservation) => (
                        <div key={reservation.id} className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h3 className="h6">{reservation.restaurant_name}</h3>
                                    <p className="card-text mb-1">{reservation.customer_name} · {reservation.phone}</p>
                                    <p className="card-text mb-1">{reservation.party_size} personas</p>
                                    <p className="card-text mb-2">{reservation.reservation_time ? new Date(reservation.reservation_time).toLocaleString() : ""}</p>
                                    <span className="badge bg-secondary">{reservation.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Link to="/client_reservations" className="d-inline-block mt-4">Back to my reservations</Link>
        </div>
    )
}

export default BookingHistory
