// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import {
  getCooksService,
  getSingleCookService,
  createCookService,
  deleteCookService,
  editCookService,
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

  return {
    getCooks,
    deleteCook,
    getSingleCook,
    createCook,
    editCook,
  };
}
