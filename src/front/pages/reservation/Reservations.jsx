import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useReservation } from "../../hooks/useReservation";

const Reservations = () => {

    const { getReservations, deleteReservation } = useReservation()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getReservations().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const reservationsList = store.reservations.map((reservation) => {
        return <tr key={reservation.id}>
            <td>{reservation.customer_name}</td>
            <td>{reservation.phone}</td>
            <td>{reservation.party_size}</td>
            <td>{reservation.reservation_time ? new Date(reservation.reservation_time).toLocaleString() : "Waitlist"}</td>
            <td>{reservation.status}</td>
            <td>{reservation.restaurant_name}</td>
            <td>{reservation.table_number ?? "-"}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteReservation(reservation.id)}>Delete</button>
                <Link to={`/edit_reservation/${reservation.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_reservation/${reservation.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="reservation_page container py-4">
            <Link to="/create_reservation"><button className="btn btn-primary mb-4">Add reservation</button></Link>
            <h1 className="h4 mb-3">Reservations</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Party size</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Restaurant</th>
                        <th>Table</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {reservationsList}
                </tbody>
            </table>
        </div>
    )
}

export default Reservations;
