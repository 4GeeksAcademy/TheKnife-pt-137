// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import {
  getTablesService,
  getSingleTableService,
  createTableService,
  deleteTableService,
  editTableService,
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

  return {
    getTables,
    deleteTable,
    getSingleTable,
    createTable,
    editTable,
  };
}