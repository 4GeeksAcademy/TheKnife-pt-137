import React, { useEffect, useState } from "react";
import { useReservation } from "../../hooks/useReservation";
import { useParams, Link } from "react-router-dom";
import { useRestaurant } from "../../hooks/useRestaurant";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EditReservationForm = () => {

    const { store } = useGlobalReducer();
    const [reservationData, setReservationData] = useState({
        restaurant_id: "",
        customer_name: "",
        phone: "",
        party_size: 1,
        reservation_time: "",
        status: "waiting"
    });
    const { getSingleReservation, editReservation } = useReservation();
    const { getRestaurants } = useRestaurant();
    const { reservation_id } = useParams();

    useEffect(() => {
        getRestaurants()
        if (reservation_id) {
            getSingleReservation(reservation_id);
        }
    }, [reservation_id]);

    useEffect(() => {
        if (store.singleReservation?.id) {
            setReservationData({
                restaurant_id: store.singleReservation.restaurant_id || "",
                customer_name: store.singleReservation.customer_name || "",
                phone: store.singleReservation.phone || "",
                party_size: store.singleReservation.party_size || 1,
                reservation_time: store.singleReservation.reservation_time ? store.singleReservation.reservation_time.slice(0, 16) : "",
                status: store.singleReservation.status || "waiting"
            });
        }
    }, [store.singleReservation]);

    const restaurantsList = store.restaurants.map((restaurant) => {
        return <option value={restaurant.id} key={restaurant.id}>{restaurant.name}</option>
    })

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit reservation</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="restaurantid">Restaurant</label>
                        <select className="form-select" onChange={(e) => setReservationData({ ...reservationData, restaurant_id: e.target.value })} value={reservationData.restaurant_id} name="restaurantid" id="restaurantid">
                            <option value="">Select a restaurant</option>
                            {restaurantsList}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="customer_name">Customer name</label>
                        <input
                            className="form-control"
                            onChange={(e) => setReservationData({ ...reservationData, customer_name: e.target.value })}
                            value={reservationData.customer_name}
                            type="text"
                            name="customer_name"
                            id="customer_name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="phone">Phone</label>
                        <input
                            className="form-control"
                            onChange={(e) => setReservationData({ ...reservationData, phone: e.target.value })}
                            value={reservationData.phone}
                            type="text"
                            name="phone"
                            id="phone"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="party_size">Party size</label>
                        <input
                            className="form-control"
                            onChange={(e) => setReservationData({ ...reservationData, party_size: e.target.value })}
                            value={reservationData.party_size}
                            type="number"
                            min="1"
                            name="party_size"
                            id="party_size"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="reservation_time">Reservation time (leave empty for waitlist)</label>
                        <input
                            className="form-control"
                            onChange={(e) => setReservationData({ ...reservationData, reservation_time: e.target.value })}
                            value={reservationData.reservation_time}
                            type="datetime-local"
                            name="reservation_time"
                            id="reservation_time"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="status">Status</label>
                        <select
                            className="form-select"
                            onChange={(e) => setReservationData({ ...reservationData, status: e.target.value })}
                            value={reservationData.status}
                            name="status"
                            id="status"
                        >
                            <option value="waiting">waiting</option>
                            <option value="notified">notified</option>
                            <option value="checked_in">checked_in</option>
                            <option value="seated">seated</option>
                            <option value="cancelled">cancelled</option>
                        </select>
                    </div>

                    <button onClick={() => editReservation(reservation_id, reservationData)} className="btn btn-primary w-100 mb-3">Edit reservation</button>

                    <div className="text-center">
                        <Link to="/reservations">Back to reservations</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default EditReservationForm;
