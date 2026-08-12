// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import {
  getReservationsService,
  getSingleReservationService,
  createReservationService,
  deleteReservationService,
  editReservationService,
  getHostReservationsService,
  createHostReservationService,
} from "../services/reservationService";

export function useReservation() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // GET reservations
  async function getReservations() {
    try {
      const data = await getReservationsService();
      dispatch({ type: "set_reservations", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // GET single reservation
  async function getSingleReservation(reservationId) {
    try {
      const reservation = await getSingleReservationService(reservationId);
      dispatch({ type: "set_single_reservation", payload: reservation });
    } catch (error) {
      console.log(error);
    }
  }

  // Create reservation
  async function createReservation(reservationData) {
    try {
      const data = await createReservationService(reservationData);
      console.log(data);
      navigate("/reservations");
    } catch (error) {
      console.log(error);
    }
  }

  // Delete reservation
  async function deleteReservation(reservationId) {
    try {
      const message = await deleteReservationService(reservationId);
      console.log(message);
      getReservations();
    } catch (error) {
      console.log(error);
    }
  }

  // Edit reservation
  async function editReservation(reservationId, reservationData) {
    try {
      const data = await editReservationService(reservationId, reservationData);
      console.log(data);
      navigate("/reservations");
    } catch (error) {
      console.log(error);
    }
  }

  // HOST: get reservations of the logged host's restaurant (optional name/date filters)
  async function getHostReservations(filters = {}) {
    try {
      const data = await getHostReservationsService(filters);
      dispatch({ type: "set_reservations", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // HOST: create a manual reservation for a walk-in / unregistered client
  async function createHostReservation(reservationData) {
    try {
      const data = await createHostReservationService(reservationData);
      console.log(data);
      navigate("/host_reservations");
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getReservations,
    getSingleReservation,
    createReservation,
    deleteReservation,
    editReservation,
    getHostReservations,
    createHostReservation,
  };
}
