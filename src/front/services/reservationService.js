const backendURL = import.meta.env.VITE_BACKEND_URL;

// GET all reservations (manager)
export async function getReservationsService() {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/reservations`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (!response.ok) throw new Error("Error fetching reservations");
    return await response.json();
}

// GET single reservation (manager)
export async function getSingleReservationService(reservationId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/reservations/${reservationId}`, {
        headers: {
            "Authorization": `Bearer ${managerToken}`
        }
    });
    if (!response.ok) throw new Error("Reservation not found");
    return await response.json();
}

// Create new reservation (manager)
export async function createReservationService(reservationData) {
    const managerToken = localStorage.getItem("managertoken")
    const newReservation = {
        restaurant_id: reservationData.restaurant_id,
        table_id: reservationData.table_id || null,
        customer_name: reservationData.customer_name,
        phone: reservationData.phone,
        party_size: reservationData.party_size,
        reservation_time: reservationData.reservation_time || null,
        status: reservationData.status
    };

    const response = await fetch(`${backendURL}/reservations`, {
        method: "POST",
        body: JSON.stringify(newReservation),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });

    if (!response.ok) throw new Error("Error creating reservation");
    return await response.json();
}

// Delete reservation (manager)
export async function deleteReservationService(reservationId) {
    const managerToken = localStorage.getItem("managertoken")
    const response = await fetch(`${backendURL}/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });

    if (!response.ok) throw new Error("Reservation not found");
    const data = await response.json();
    return data.message;
}

// Edit reservation (manager)
export async function editReservationService(reservationId, reservationData) {
    const managerToken = localStorage.getItem("managertoken")
    const editedReservation = {
        restaurant_id: reservationData.restaurant_id,
        table_id: reservationData.table_id || null,
        customer_name: reservationData.customer_name,
        phone: reservationData.phone,
        party_size: reservationData.party_size,
        reservation_time: reservationData.reservation_time || null,
        status: reservationData.status
    };

    const response = await fetch(`${backendURL}/reservations/${reservationId}`, {
        method: "PUT",
        body: JSON.stringify(editedReservation),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${managerToken}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error editing reservation");
    }

    return await response.json();
}

/////////////////////////////////////////////////////////////////////////////
// GET reservations of the logged host's restaurant (optional name/date filters)
export async function getHostReservationsService(filters = {}) {
    const hostToken = localStorage.getItem("hosttoken");
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.date) params.append("date", filters.date);
    const queryString = params.toString();
    const url = `${backendURL}/host/reservations${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${hostToken}`
        }
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error fetching reservations");
    }
    return await response.json();
}

// Host creates a manual reservation for a walk-in / unregistered client
export async function createHostReservationService(reservationData) {
    const hostToken = localStorage.getItem("hosttoken");
    const newReservation = {
        table_id: reservationData.table_id || null,
        customer_name: reservationData.customer_name,
        phone: reservationData.phone,
        party_size: reservationData.party_size,
        reservation_time: reservationData.reservation_time || null,
        status: reservationData.status
    };

    const response = await fetch(`${backendURL}/host/reservations`, {
        method: "POST",
        body: JSON.stringify(newReservation),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hostToken}`
        }
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error creating reservation");
    }
    return await response.json();
}
