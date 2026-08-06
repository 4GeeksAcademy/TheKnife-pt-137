import { useEffect } from "react"
import { useProduct } from "../../hooks/useProduct"
import { useParams, Link } from "react-router-dom"
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
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <img src={store.singleProduct.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.singleProduct.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Description:</strong> {store.singleProduct.description}</li>
                        <li className="list-group-item"><strong>Price:</strong> {store.singleProduct.sell_price}€</li>
                    </ul>
                    <Link to="/products" className="btn btn-outline-secondary">Back to products</Link>
                </div>
            </div>

        </div>
    )
}

export default SingleProduct;