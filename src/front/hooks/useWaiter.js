// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import { getWaitersService, getSingleWaiterService, createWaiterService, deleteWaiterService, editWaiterService, waiterLoginService, waiterRegisterService, getRestaurantWaitersService, deleteRestaurantWaiterService } from "../services/waiterService";

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

    // Waiter login
    async function waiterLogin(waiterLoginData) {
        try {
            const data = await waiterLoginService(waiterLoginData)
            const waiterToken = data.token
            localStorage.setItem("waitertoken", waiterToken)
            localStorage.setItem("waiterData", JSON.stringify(data.waiter))
            console.log(data)
            dispatch({type: "waiter_login", payload: data})
            navigate("/waiter_dashboard")
        } catch (error) {console.log(error)}
    }

    // Waiter logout
    function waiterLogout() {
        localStorage.removeItem("waitertoken")
        localStorage.removeItem("waiterData")
        dispatch({type: "waiter_logout"})
        navigate("/waiter_login")
    }

    // Rehydrate the logged waiter into the store after a page refresh
    function rehydrateWaiter() {
        const waiterToken = localStorage.getItem("waitertoken")
        const waiterData = localStorage.getItem("waiterData")
        if (waiterToken && waiterData) {
            dispatch({type: "waiter_login", payload: {waiter: JSON.parse(waiterData)}})
        }
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

    //////////////////////////////////////////////////////////////////
    // Chef registers a waiter
    async function waiterRegister(restaurant_id, waiterData) {
        try {
            const data = await waiterRegisterService(restaurant_id, waiterData)
            console.log(data)
            navigate("/chef_dashboard")
        } catch (error) {console.log(error)}
    }

      // Chef get waiters of his restaurant
      async function getRestaurantWaiters(restaurant_id) {
        try {
          const data = await getRestaurantWaitersService(restaurant_id)
          console.log(data)
          dispatch({type: "set_waiters", payload: data})
        } catch (error) {console.log(error)}
      }
    
      // Chef deletes a waiter of his restaurant
      async function deleteRestaurantWaiter(restaurant_id, waiter_id) {
        try {
          const data = await deleteRestaurantWaiterService(restaurant_id, waiter_id)
          console.log(data)
          getRestaurantWaiters(restaurant_id)
        } catch (error) {console.log(error)}
      }
    

    
    return {
        getWaiters,
        deleteWaiter,
        getSingleWaiter,
        createWaiter,
        editWaiter,
        waiterLogin,
        waiterLogout,
        rehydrateWaiter,
        waiterRegister,
        getRestaurantWaiters,
        deleteRestaurantWaiter
    }
}