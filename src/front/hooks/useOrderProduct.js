// Services imports
import { useNavigate } from "react-router-dom";
import { getOrderProductsService, getSingleOrderProductService, createOrderProductService, deleteOrderProductService, editOrderProductService, getProductsOfAnOrderService } from "../services/orderProductService";
import useGlobalReducer from "./useGlobalReducer";

export function useOrderProduct() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET order-products
    async function getOrderProducts() {
        try {
            const data = await getOrderProductsService()
            dispatch({type: "set_order_products", payload: data})
        } catch (error) {console.log(error)}
    }

    // GET single order-product
    async function getSingleOrderProduct(orderProductId) {
        try {
            const orderProduct = await getSingleOrderProductService(orderProductId)
            dispatch({type: "set_single_order_product", payload: orderProduct})
        } catch (error) {console.log(error)}
    }

    // Get all products of an order
    async function getProductsOfAnOrder(orderId) {
        try {
            const data = await getProductsOfAnOrderService(orderId)
            dispatch({type: "set_order_products", payload: data})
            console.log(data)
        } catch (error) {console.log(error)}
    }

    // Create order-product
    async function createOrderProduct(orderProductData) {
        try {
            const response = await createOrderProductService(orderProductData)
            const data = await response.json()
            console.log(data)
        } catch(error) {console.log(error)}
    }

    // Delete order-product
    async function deleteOrderProduct(orderProductId, orderId) {
        try {
            const message = await deleteOrderProductService(orderProductId)
            console.log(message)
            getProductsOfAnOrder(orderId)
        } catch(error) {console.log(error)}
    }

    // Edit order-product
    async function editOrderProduct(orderProductId, orderProductData) {
        try {
            const response = await editOrderProductService(orderProductId, orderProductData)
            const data = await response.json()
            console.log(data)
            navigate("/order_products")
        } catch (error) {console.log(error)}
    }

    return {
        getOrderProducts,
        deleteOrderProduct,
        getSingleOrderProduct,
        createOrderProduct,
        editOrderProduct,
        getProductsOfAnOrder
    }
}
