import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useClientReservation } from "../../hooks/useClientReservation"

function toDatetimeLocal(value) {
    if (!value) return ""
    const date = new Date(value)
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
}

const EditMyReservation = () => {

    const { reservation_id } = useParams()
    const { store } = useGlobalReducer()
    const { fetchMyReservations, editMyReservation } = useClientReservation()
    const [loading, setLoading] = useState(true)
    const [reservationData, setReservationData] = useState({
        customer_name: "",
        phone: "",
        party_size: "",
        reservation_time: ""
    })

    useEffect(() => {
        setLoading(true)
        fetchMyReservations().finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const reservation = store.myReservations.find((item) => item.id === Number(reservation_id))
        if (reservation) {
            setReservationData({
                customer_name: reservation.customer_name || "",
                phone: reservation.phone || "",
                party_size: reservation.party_size || "",
                reservation_time: toDatetimeLocal(reservation.reservation_time)
            })
        }
    }, [store.myReservations, reservation_id])

    function handleSubmit(e) {
        e.preventDefault()
        editMyReservation(reservation_id, reservationData)
    }

    if (loading) return <p className="text-center mt-5">Loading...</p>

    return (
        <div className="container py-4" style={{ maxWidth: "500px" }}>
            <h1 className="h4 mb-3">Editar reserva</h1>

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

                <button type="submit" className="btn btn-primary">Save changes</button>
                <Link to="/client_reservations" className="d-inline-block mt-3 ms-3">Cancel</Link>
            </form>
        </div>
    )
}

export default EditMyReservation
