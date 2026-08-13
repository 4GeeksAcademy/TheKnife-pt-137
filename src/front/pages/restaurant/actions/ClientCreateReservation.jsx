import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import { useClientReservation } from "../../../hooks/useClientReservation"

const ClientCreateReservation = () => {

    const { restaurant_id } = useParams()
    const { store } = useGlobalReducer()
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
        <div className="container py-4" style={{ maxWidth: "500px" }}>
            <h1 className="h4 mb-3">Reservar mesa</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="customer_name">Nombre</label>
                    <input
                        className="form-control"
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        value={reservationData.customer_name}
                        onChange={(e) => setReservationData({ ...reservationData, customer_name: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="phone">Teléfono</label>
                    <input
                        className="form-control"
                        type="text"
                        id="phone"
                        name="phone"
                        value={reservationData.phone}
                        onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="party_size">Número de personas</label>
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

                <div className="mb-3">
                    <label className="form-label" htmlFor="reservation_time">Fecha y hora</label>
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

                <button type="submit" className="btn btn-primary">Confirm reservation</button>
                <Link to="/restaurants/nearby_search" className="d-inline-block mt-3 ms-3">Cancel</Link>
            </form>
        </div>
    )
}

export default ClientCreateReservation
