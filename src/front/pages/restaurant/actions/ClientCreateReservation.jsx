import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { useClientReservation } from "../../../hooks/useClientReservation"

const ClientCreateReservation = () => {

    const { restaurant_id } = useParams()
    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { createMyReservation } = useClientReservation()
    const currentClient = store.loggedClient.client

    const [reservationData, setReservationData] = useState({
        customer_name: currentClient.name || "",
        phone: currentClient.phone || "",
        party_size: "",
        reservation_time: ""
    })

    function handleSubmit(e) {
        e.preventDefault()
        createMyReservation(restaurant_id, reservationData)
    }

    return (
        <div className="simple-form-page">
            <div className="simple-form-wrap">
                <button
                    type="button"
                    className="page-back-link"
                    style={{ background: "none", border: "none", padding: 0 }}
                    onClick={() => navigate(-1)}
                >
                    <i className="fa-solid fa-arrow-left"></i>Volver
                </button>
                <div className="simple-form-card">
                    <div className="simple-form-icon">
                        <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <h1 className="simple-form-title">Reservar mesa</h1>
                    <p className="simple-form-subtitle">Completa tus datos para reservar una mesa.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="simple-form-field mb-3">
                            <label className="simple-form-label" htmlFor="customer_name">Nombre</label>
                            <input
                                className="form-control"
                                type="text"
                                id="customer_name"
                                name="customer_name"
                                value={reservationData.customer_name}
                                onChange={(e) => setReservationData({ ...reservationData, customer_name: e.target.value })}
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

                        <div className="simple-form-field mb-3">
                            <label className="simple-form-label" htmlFor="phone">Teléfono</label>
                            <input
                                className="form-control"
                                type="text"
                                id="phone"
                                name="phone"
                                value={reservationData.phone}
                                onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                                placeholder="Teléfono de contacto"
                            />
                        </div>

                        <div className="simple-form-field mb-3">
                            <label className="simple-form-label" htmlFor="party_size">Número de personas</label>
                            <input
                                className="form-control"
                                type="number"
                                min="1"
                                id="party_size"
                                name="party_size"
                                value={reservationData.party_size}
                                onChange={(e) => setReservationData({ ...reservationData, party_size: e.target.value })}
                                required
                            />
                        </div>

                        <div className="simple-form-field mb-4">
                            <label className="simple-form-label" htmlFor="reservation_time">Fecha y hora</label>
                            <input
                                className="form-control"
                                type="datetime-local"
                                id="reservation_time"
                                name="reservation_time"
                                value={reservationData.reservation_time}
                                onChange={(e) => setReservationData({ ...reservationData, reservation_time: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn simple-form-submit-btn">
                            <i className="fa-solid fa-calendar-check me-2"></i>Confirmar reserva
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ClientCreateReservation
