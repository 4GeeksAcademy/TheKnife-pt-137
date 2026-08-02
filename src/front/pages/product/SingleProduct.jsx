import { useEffect } from "react"
import { useProduct } from "../../hooks/useProduct"
import { useParams } from "react-router-dom"
import storeReducer from "../../store"
import useGlobalReducer from "../../hooks/useGlobalReducer"


const SingleProduct = () => {

    const { store } = useGlobalReducer()
    const { getSingleProduct } = useProduct()
    const { product_id } = useParams()

    useEffect(() => {
        getSingleProduct(product_id)
    }, [store.singleProduct])

    return (
        <div className="single_product">
            <h1>name: {store.singleProduct.name}</h1>
            <h2>Description: {store.singleProduct.description}</h2>
            <h2>Price: {store.singleProduct.sell_price}</h2>
            <img src={store.singleProduct.img_url} height="300" width="350" />
        </div>
    )
}

export default SingleProduct;