// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import { getWaitersService, getSingleWaiterService, createWaiterService, deleteWaiterService, editWaiterService } from "../services/waiterService";

export function useWaiter() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET waiters
    async function getWaiters() {
        try {
            const data = await getWaitersService()
            dispatch({type: "set_waiters", payload: data})
        } catch (error) {console.log(error)}
    }

    // GET single waiter
    async function getSingleWaiter(waiterId) {
        try {
            const waiter = await getSingleWaiterService(waiterId)
            dispatch({type: "set_single_waiter", payload: waiter})

        } catch (error) {console.log(error)}
    }

    // Create waiter
    async function createWaiter(waiterData) {
        try {
            const response = await createWaiterService(waiterData)
            const data = await response.json()
            console.log(data)
            navigate("/waiters")
        } catch(error) {console.log(error)}
    }

    // Delete waiter
    async function deleteWaiter(waiterId) {
        try {
            const message = await deleteWaiterService(waiterId)
            console.log(message)
            getWaiters()
        } catch(error) {console.log(error)}
    }

    // Edit waiter
    async function editWaiter(waiterId, waiterData) {
        try {
            const response = await editWaiterService(waiterId, waiterData)
            const data = await response.json()
            console.log(data)
            navigate("/waiters")
        } catch (error) {console.log(error)}
    }

    
    return {
        getWaiters,
        deleteWaiter,
        getSingleWaiter,
        createWaiter,
        editWaiter
    }
}