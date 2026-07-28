// Services imports
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";
import { getOrdersService, getSingleOrderService, createOrderService, deleteOrderService, editOrderService } from "../services/orderService";

export function useOrder() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET orders
    async function getOrders() {
        try {
            const data = await getOrdersService()
            dispatch({type: "set_orders", payload: data})
        } catch (error) {console.log(error)}
    }

    // GET single order
    async function getSingleOrder(orderId) {
        try {
            const order = await getSingleOrderService(orderId)
            dispatch({type: "set_single_order", payload: order})

        } catch (error) {console.log(error)}
    }

    // Create order
    async function createOrder(orderData) {
        try {
            const response = await createOrderService(orderData)
            const data = await response.json()
            console.log(data)
            navigate("/orders")
        } catch(error) {console.log(error)}
    }

    // Delete order
    async function deleteOrder(orderId) {
        try {
            const message = await deleteOrderService(orderId)
            console.log(message)
            getOrders()
        } catch(error) {console.log(error)}
    }

    // Edit order
    async function editOrder(orderId, orderData) {
        try {
            const response = await editOrderService(orderId, orderData)
            const data = await response.json()
            console.log(data)
            navigate("/orders")
        } catch (error) {console.log(error)}
    }

    
    return {
        getOrders,
        deleteOrder,
        getSingleOrder,
        createOrder,
        editOrder
    }
}