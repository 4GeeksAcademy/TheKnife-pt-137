// Services imports
import { useNavigate } from "react-router-dom";
import { getProductsService, deleteProductService, getSingleProductService, createProductService, editProductService } from "../services/productService";
import useGlobalReducer from "./useGlobalReducer";

export function useProduct() {

    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    // GET products
    async function getProducts() {
        try {
            const data = await getProductsService()
            dispatch({type: "set_products", payload: data})
        } catch (error) {console.log(error)}
    }

    // GET single product
    async function getSingleProduct(productId) {
        try {
            const product = await getSingleProductService(productId)
            dispatch({type: "set_single_product", payload: product})

        } catch (error) {console.log(error)}
    }

    // Create product
    async function createProduct(productData) {
        try {
            const response = await createProductService(productData)
            const data = await response.json()
            console.log(data)
            navigate("/products")
        } catch(error) {console.log(error)}
    }

    // Delete product
    async function deleteProduct(productId) {
        try {
            const message = await deleteProductService(productId)
            console.log(message)
            getProducts()
        } catch(error) {console.log(error)}
    }

    // Edit product
    async function editProduct(productId, productData) {
        try {
            const response = await editProductService(productId, productData)
            const data = await response.json()
            console.log(data)
            navigate("/products")
        } catch (error) {console.log(error)}
    }

    
    return {
        getProducts,
        deleteProduct,
        getSingleProduct,
        createProduct,
        editProduct
    }
}