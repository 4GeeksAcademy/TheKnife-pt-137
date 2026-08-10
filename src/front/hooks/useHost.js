import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import {
  getHostsService,
  getSingleHostService,
  hostLoginService,
  deleteHostService,
  editHostService,
  hostRegisterService,
  getRestaurantHostService,
} from "../services/hostService";

export function useHost() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // GET hosts (manager)
  async function getHosts() {
    try {
      const data = await getHostsService();
      dispatch({ type: "set_hosts", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // GET single host (manager)
  async function getSingleHost(hostId) {
    try {
      const host = await getSingleHostService(hostId);
      dispatch({ type: "set_single_host", payload: host });
    } catch (error) {
      console.log(error);
    }
  }

  // Host login
  async function hostLogin(hostLoginData) {
    try {
      const data = await hostLoginService(hostLoginData);
      localStorage.setItem("hosttoken", data.token);
      localStorage.setItem("hostData", JSON.stringify(data.host));
      localStorage.setItem("hostRestaurant", data.host_restaurant);
      dispatch({ type: "host_login", payload: data });
      navigate("/host_dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  // Host logout
  function hostLogout() {
    localStorage.removeItem("hosttoken");
    localStorage.removeItem("hostData");
    localStorage.removeItem("hostRestaurant");
    dispatch({ type: "host_logout" });
    navigate("/host_login");
  }

  // Rehydrate the logged host into the store after a page refresh
  function rehydrateHost() {
    const hostToken = localStorage.getItem("hosttoken");
    const hostData = localStorage.getItem("hostData");
    const hostRestaurant = localStorage.getItem("hostRestaurant");
    if (hostToken && hostData) {
      dispatch({
        type: "host_login",
        payload: { host: JSON.parse(hostData), host_restaurant: hostRestaurant },
      });
    }
  }

  // Delete host (manager)
  async function deleteHost(hostId) {
    try {
      const message = await deleteHostService(hostId);
      console.log(message);
      getHosts();
    } catch (error) {
      console.log(error);
    }
  }

  // Edit host (manager)
  async function editHost(hostId, hostData) {
    try {
      const response = await editHostService(hostId, hostData);
      const data = await response.json();
      console.log(data);
      navigate("/hosts");
    } catch (error) {
      console.log(error);
    }
  }

  // Chef registers a host (returns created host, throws on error)
  async function hostRegister(restaurant_id, hostData) {
    const data = await hostRegisterService(restaurant_id, hostData);
    return data;
  }

  // Chef gets the host of his restaurant
  async function getRestaurantHost(restaurant_id) {
    try {
      const host = await getRestaurantHostService(restaurant_id);
      dispatch({ type: "set_restaurant_host", payload: host });
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getHosts,
    getSingleHost,
    hostLogin,
    hostLogout,
    rehydrateHost,
    deleteHost,
    editHost,
    hostRegister,
    getRestaurantHost,
  };
}
