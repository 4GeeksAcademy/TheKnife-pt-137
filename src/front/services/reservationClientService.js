const backendURL = import.meta.env.VITE_BACKEND_URL

// POST create a reservation as a logged-in client
export async function createClientReservationService(restaurant_id, reservationData) {
    const clientToken = localStorage.getItem("clienttoken")
    const response = await fetch(`${backendURL}/restaurants/${restaurant_id}/reservations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${clientToken}`
        },
        body: JSON.stringify(reservationData)
    })
    if (!response.ok) throw new Error("Some error has ocurred");
    const data = await response.json()
    return data;
}

// GET reservations belonging to the logged-in client
export async function getMyReservationsService() {
    const clientToken = localStorage.getItem("clienttoken")
    const response = await fetch(`${backendURL}/reservations/mine`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${clientToken}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred");
    const data = await response.json()
    return data;
}

// PUT edit a reservation belonging to the logged-in client
export async function editMyReservationService(reservation_id, reservationData) {
    const clientToken = localStorage.getItem("clienttoken")
    const response = await fetch(`${backendURL}/reservations/${reservation_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${clientToken}`
        },
        body: JSON.stringify(reservationData)
    })
    if (!response.ok) throw new Error("Some error has ocurred");
    const data = await response.json()
    return data;
}

// PUT cancel a reservation belonging to the logged-in client
export async function cancelMyReservationService(reservation_id) {
    const clientToken = localStorage.getItem("clienttoken")
    const response = await fetch(`${backendURL}/reservations/${reservation_id}/cancel`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${clientToken}`
        }
    })
    if (!response.ok) throw new Error("Some error has ocurred");
    const data = await response.json()
    return data;
}
