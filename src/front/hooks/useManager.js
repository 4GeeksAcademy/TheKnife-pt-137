// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import { getManagersService, createManagerService, deleteManagerService, editManagerService, managerLoginService } from "../services/managerService";

export function useManager() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET managers
    async function getManagers() {
        try {
            const data = await getManagersService()
            dispatch({type: "set_managers", payload: data})
        } catch (error) {console.log(error)}
    }

    // Create manager
    async function createManager(managerData) {
        try {
            const response = await createManagerService(managerData)
            const data = await response.json()
            console.log(data)
            navigate("/managers")
        } catch(error) {console.log(error)}
    }

    // Manager login
    async function managerLogin(managerLoginData) {
        try {
            const data = await managerLoginService(managerLoginData)
            const managerToken = data.token
            localStorage.setItem("managertoken", managerToken)
            localStorage.setItem("managerData", JSON.stringify(data.manager))
            dispatch({type: "manager_login", payload: data})
            navigate("/manager_dashboard")
        } catch (error) {console.log(error)}
    }

    // Manager logout
    function managerLogout() {
        localStorage.removeItem("managertoken")
        localStorage.removeItem("managerData")
        dispatch({type: "manager_logout"})
        navigate("/manager_login")
    }

    // Rehydrate the logged manager into the store after a page refresh
    function rehydrateManager() {
        const managerToken = localStorage.getItem("managertoken")
        const managerData = localStorage.getItem("managerData")
        if (managerToken && managerData) {
            dispatch({type: "manager_login", payload: {manager: JSON.parse(managerData)}})
        }
    }

    // Delete manager
    async function deleteManager(managerId) {
        try {
            const message = await deleteManagerService(managerId)
            console.log(message)
            getManagers()
        } catch(error) {console.log(error)}
    }

    // Edit manager
    async function editManager(managerId, managerData) {
        try {
            const response = await editManagerService(managerId, managerData)
            const data = await response.json()
            console.log(data)
            navigate("/managers")
        } catch (error) {console.log(error)}
    }

    return {
        getManagers,
        deleteManager,
        createManager,
        editManager,
        managerLogin,
        managerLogout,
        rehydrateManager
    }
}