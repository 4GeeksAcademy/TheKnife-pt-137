import { useNavigate } from "react-router-dom";
import {
  createClientReservationService,
  getMyReservationsService,
  editMyReservationService,
  cancelMyReservationService
} from "../services/reservationClientService";
import useGlobalReducer from "./useGlobalReducer";

export function useClientReservation() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  async function createMyReservation(restaurant_id, reservationData) {
    try {
      await createClientReservationService(restaurant_id, reservationData);
      navigate("/client_reservations");
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMyReservations() {
    try {
      const data = await getMyReservationsService();
      dispatch({ type: "set_my_reservations", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  async function editMyReservation(reservation_id, reservationData) {
    try {
      await editMyReservationService(reservation_id, reservationData);
      navigate("/client_reservations");
    } catch (error) {
      console.log(error);
    }
  }

  async function cancelMyReservation(reservation_id) {
    try {
      const updatedReservation = await cancelMyReservationService(reservation_id);
      dispatch({ type: "set_my_reservations", payload: store.myReservations.map((reservation) => reservation.id === updatedReservation.id ? updatedReservation : reservation) });
    } catch (error) {
      console.log(error);
    }
  }

  return { createMyReservation, fetchMyReservations, editMyReservation, cancelMyReservation };
}
