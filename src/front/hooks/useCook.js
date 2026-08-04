// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import {
  getCooksService,
  getSingleCookService,
  createCookService,
  deleteCookService,
  editCookService,
  cookLoginService,
  cookRegisterService,
  getRestaurantCooksService,
  deleteRestaurantCookService
} from "../services/cookService";

export function useCook() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // GET cooks
  async function getCooks() {
    try {
      const data = await getCooksService();
      dispatch({ type: "set_cooks", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // GET single cook
  async function getSingleCook(cookId) {
    try {
      const cook = await getSingleCookService(cookId);
      dispatch({ type: "set_single_cook", payload: cook });
    } catch (error) {
      console.log(error);
    }
  }

  // Create cook
  async function createCook(cookData) {
    try {
      const response = await createCookService(cookData);
      const data = await response.json();
      console.log(data);
      navigate("/cooks");
    } catch (error) {
      console.log(error);
    }
  }

  // Delete cook
  async function deleteCook(cookId) {
    try {
      const message = await deleteCookService(cookId);
      console.log(message);
      getCooks();
    } catch (error) {
      console.log(error);
    }
  }

  // Cook login
  async function cookLogin(cookLoginData) {
    try {
      const data = await cookLoginService(cookLoginData);
      const cookToken = data.token;
      localStorage.setItem("cooktoken", cookToken);
      console.log(data);
      dispatch({ type: "cook_login", payload: data });
      navigate("/cook_dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  // Chef logout
  function cookLogout() {
    localStorage.removeItem("cooktoken");
    dispatch({ type: "cook_logout" });
    navigate("/cook_login");
  }

  // Edit cook
  async function editCook(cookId, cookData) {
    try {
      const response = await editCookService(cookId, cookData);
      const data = await response.json();
      console.log(data);
      navigate("/cooks");
    } catch (error) {
      console.log(error);
    }
  }

  //////////////////////////////////////////////////////////////////
  // Chef registers a cook
  async function cookRegister(restaurant_id, cookData) {
    try {
      const data = await cookRegisterService(restaurant_id, cookData);
      console.log(data);
      navigate("/chef_dashboard");
      await getRestaurantCooks(restaurant_id)
    } catch (error) {
      console.log(error);
    }
  }

  // Chef get cooks of his restaurant
  async function getRestaurantCooks(restaurant_id) {
    try {
      const data = await getRestaurantCooksService(restaurant_id)
      console.log(data)
      dispatch({type: "set_cooks", payload: data})
    } catch (error) {console.log(error)}
  }

  // Chef deletes a cook of his restaurant
  async function deleteRestaurantCook(restaurant_id, cook_id) {
    try {
      const data = await deleteRestaurantCookService(restaurant_id, cook_id)
      console.log(data)
      getRestaurantCooks(restaurant_id)
    } catch (error) {console.log(error)}
  }

  return {
    getCooks,
    deleteCook,
    getSingleCook,
    createCook,
    editCook,
    cookLogin,
    cookLogout,
    cookRegister,
    getRestaurantCooks,
    deleteRestaurantCook
  };
}
