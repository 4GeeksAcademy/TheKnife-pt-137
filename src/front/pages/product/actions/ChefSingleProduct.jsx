import { useEffect } from "react"
import { useProduct } from "../../../hooks/useProduct"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const ChefSingleProduct = () => {

    const { store } = useGlobalReducer()
    const { getOneRestaurantProduct } = useProduct()
    const { restaurant_id, product_id } = useParams()

    useEffect(() => {
        getOneRestaurantProduct(restaurant_id, product_id)
    }, [])

    if (!store.singleProduct.id) return <p className="text-center mt-5">Loading...</p>

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <img src={store.singleProduct.img_url} className="card-img-top" height="300" style={{ objectFit: "cover" }} />
                <div className="card-body">
                    <h1 className="h4">{store.singleProduct.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Description:</strong> {store.singleProduct.description}</li>
                        <li className="list-group-item"><strong>Price:</strong> {store.singleProduct.sell_price}€</li>
                        <li className="list-group-item"><strong>Type:</strong> {store.singleProduct.type}</li>
                        <li className="list-group-item"><strong>Active:</strong> {store.singleProduct.active ? "Yes" : "No"}</li>
                    </ul>
                    <div className="d-flex gap-2">
                        <Link to={`/restaurants/${restaurant_id}/edit_product/${product_id}`} className="btn btn-warning">Edit product</Link>
                        <Link to={`/restaurants/${restaurant_id}/products`} className="btn btn-outline-secondary">Back to products</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ChefSingleProduct;
