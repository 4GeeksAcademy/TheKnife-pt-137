// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import { getClientsService, createClientService, deleteClientService, editClientService, clientLoginService, clientRegisterService } from "../services/clientService";

export function useClient() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET clients
    async function getClients() {
        try {
            const data = await getClientsService()
            dispatch({type: "set_clients", payload: data})
        } catch (error) {console.log(error)}
    }

    // Create client
    async function createClient(clientData) {
        try {
            const response = await createClientService(clientData)
            const data = await response.json()
            console.log(data)
            navigate("/clients")
        } catch(error) {console.log(error)}
    }

    // Public client self-registration (-> POST /client_register, no manager needed)
    async function registerClient(clientData) {
        try {
            const response = await clientRegisterService(clientData)
            const data = await response.json()
            console.log(data)
            navigate("/client_login")
        } catch(error) {console.log(error)}
    }

    // Client login
    async function clientLogin(clientLoginData) {
        try {
            const data = await clientLoginService(clientLoginData)
            const clientToken = data.token
            localStorage.setItem("clienttoken", clientToken)
            localStorage.setItem("clientData", JSON.stringify(data.client))
            dispatch({type: "client_login", payload: data})
            navigate("/client_dashboard")
        } catch (error) {console.log(error)}
    }

    // Client logout
    function clientLogout() {
        localStorage.removeItem("clienttoken")
        localStorage.removeItem("clientData")
        dispatch({type: "client_logout"})
        navigate("/client_login")
    }

    // Rehydrate the logged client into the store after a page refresh
    function rehydrateClient() {
        const clientToken = localStorage.getItem("clienttoken")
        const clientData = localStorage.getItem("clientData")
        if (clientToken && clientData) {
            dispatch({type: "client_login", payload: {client: JSON.parse(clientData)}})
        }
    }

    // Delete client
    async function deleteClient(clientId) {
        try {
            const message = await deleteClientService(clientId)
            console.log(message)
            getClients()
        } catch(error) {console.log(error)}
    }

    // Edit client
    async function editClient(clientId, clientData) {
        try {
            const response = await editClientService(clientId, clientData)
            const data = await response.json()
            console.log(data)
            navigate("/clients")
        } catch (error) {console.log(error)}
    }

    return {
        getClients,
        deleteClient,
        createClient,
        registerClient,
        editClient,
        clientLogin,
        clientLogout,
        rehydrateClient
    }
}
