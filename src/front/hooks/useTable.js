// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import {
  getTablesService,
  getSingleTableService,
  createTableService,
  deleteTableService,
  editTableService,
  getAllRestaurantTablesService,
  getInactiveRestaurantTablesService,
  createRestaurantTableService,
  editRestaurantTableService,
  deactivateRestaurantTableService,
  getHostTablesService,
} from "../services/tableService";

export function useTable() {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // GET tables
  async function getTables() {
    try {
      const data = await getTablesService();
      dispatch({ type: "set_tables", payload: data });
    } catch (error) {
      console.log(error);
    }
  }

  // GET single table
  async function getSingleTable(tableId) {
    try {
      const table = await getSingleTableService(tableId);
      dispatch({ type: "set_single_table", payload: table });
    } catch (error) {
      console.log(error);
    }
  }

  // Create table
  async function createTable(tableData) {
    try {
      const data = await createTableService(tableData);
      console.log(data);
      navigate("/tables");
    } catch (error) {
      console.log(error);
    }
  }

  // Delete table
  async function deleteTable(tableId) {
    try {
      const message = await deleteTableService(tableId);
      console.log(message);
      getTables();
    } catch (error) {
      console.log(error);
    }
  }

  // Edit table
  async function editTable(tableId, tableData) {
    try {
      const data = await editTableService(tableId, tableData);
      console.log(data);
      navigate("/tables");
    } catch (error) {
      console.log(error);
    }
  }

  // Get all tables of the restaurant
  async function getAllRestaurantTables(restaurant_id) {
    try {
      const data = await getAllRestaurantTablesService(restaurant_id)
      dispatch({ type: "set_tables", payload: data })
    } catch (error) { console.log(error) }
  }

  // Create a table for the restaurant
  async function createRestaurantTable(restaurant_id, tableData) {
    try {
      const data = await createRestaurantTableService(restaurant_id, tableData)
      console.log(data)
      getAllRestaurantTables(restaurant_id)
    } catch (error) { console.log(error) }
  }

  // Edit a table of the restaurant
  async function editRestaurantTable(restaurant_id, table_id, tableData) {
    try {
      const data = await editRestaurantTableService(restaurant_id, table_id, tableData)
      console.log(data)
      getAllRestaurantTables(restaurant_id)
    } catch (error) { console.log(error) }
  }

  // Get inactive (deactivated) tables of the restaurant
  async function fetchInactiveRestaurantTables(restaurant_id) {
    try {
      const data = await getInactiveRestaurantTablesService(restaurant_id)
      dispatch({ type: "set_inactive_tables", payload: data })
    } catch (error) { console.log(error) }
  }

  // Deactivate a table of the restaurant (soft delete)
  async function deactivateRestaurantTable(restaurant_id, table_id) {
    try {
      const message = await deactivateRestaurantTableService(restaurant_id, table_id)
      console.log(message)
      getAllRestaurantTables(restaurant_id)
    } catch (error) { console.log(error) }
  }

  // Reactivate a previously deactivated table of the restaurant
  async function activateRestaurantTable(restaurant_id, table) {
    try {
      const data = await editRestaurantTableService(restaurant_id, table.id, { ...table, active: true })
      console.log(data)
      fetchInactiveRestaurantTables(restaurant_id)
    } catch (error) { console.log(error) }
  }

  // Host gets the active tables of his restaurant
  async function getHostTables() {
    try {
      const data = await getHostTablesService()
      dispatch({ type: "set_tables", payload: data })
    } catch (error) { console.log(error) }
  }

  return {
    getTables,
    deleteTable,
    getSingleTable,
    createTable,
    editTable,
    getAllRestaurantTables,
    createRestaurantTable,
    editRestaurantTable,
    fetchInactiveRestaurantTables,
    deactivateRestaurantTable,
    activateRestaurantTable,
    getHostTables
  };
}
