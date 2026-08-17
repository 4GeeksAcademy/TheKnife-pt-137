import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useClientReservation } from "../../hooks/useClientReservation"
import LoadingComponent from "../../components/LoadingComponent"

const STATUS_INFO = {
    waiting: { label: "En espera", badgeClass: "order-badge-pending", icon: "fa-hourglass-half" },
    confirmed: { label: "Confirmada", badgeClass: "order-badge-done", icon: "fa-circle-check" },
    seated: { label: "En mesa", badgeClass: "order-badge-doing", icon: "fa-chair" },
    completed: { label: "Completada", badgeClass: "order-badge-closed", icon: "fa-flag-checkered" },
    cancelled: { label: "Cancelada", badgeClass: "table-badge-occupied", icon: "fa-xmark" },
}

const formatDateTime = (value) =>
    value ? new Date(value).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" }) : "Sin hora"

const ClientReservations = () => {

    const { store } = useGlobalReducer()
    const { fetchMyReservations, cancelMyReservation } = useClientReservation()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchMyReservations().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

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
        <div className="reservations_page">
            <div className="client-page-header">
                <h1 className="client-page-title">Mis reservas</h1>
            </div>

            <div className="card">
                <div className="card-body">
                    {upcoming.length > 0 ? (
                        <div className="product-list">
                            {upcoming.map((reservation) => {
                                const info = STATUS_INFO[reservation.status] || STATUS_INFO.waiting
                                return (
                                    <div className="product-row" key={reservation.id}>
                                        <div className={`order-icon ${info.badgeClass}`}>
                                            <i className={`fa-solid ${info.icon}`}></i>
                                        </div>
                                        <div className="product-row-info">
                                            <div className="product-row-title">
                                                <span className="product-row-name">{reservation.restaurant_name}</span>
                                                <span className={`product-badge ${info.badgeClass}`}>{info.label}</span>
                                            </div>
                                            <div className="order-row-meta">
                                                <span><i className="fa-solid fa-users"></i>{reservation.party_size} personas</span>
                                                <span><i className="fa-solid fa-phone"></i>{reservation.phone || "Sin teléfono"}</span>
                                                <span><i className="fa-solid fa-clock"></i>{formatDateTime(reservation.reservation_time)}</span>
                                            </div>
                                        </div>
                                        <div className="order-row-actions">
                                            <Link to={`/edit_my_reservation/${reservation.id}`} className="recipe-view-link">
                                                Editar <i className="fa-solid fa-pen"></i>
                                            </Link>
                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(reservation.id)}>
                                                <i className="fa-solid fa-xmark me-1"></i>Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="text-muted text-center py-4 mb-0">No tienes reservas próximas.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ClientReservations
