import React, { useEffect, useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";

const Product = () => {

    const { getProducts, deleteProduct } = useProduct()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getProducts().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const dishes = store.products.filter((product) => product.type === "dish")
    const drinks = store.products.filter((product) => product.type === "drink")

    const buildRow = (product) => {
        return <tr key={product.id}>
            <td><img src={product.img_url} height="50" width="50" style={{ objectFit: "cover" }} /></td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>{product.sell_price}€</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id)}>Delete</button>
                <Link to={`/edit_product/${product.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_product/${product.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    }

    const dishList = dishes.map(buildRow)
    const drinkList = drinks.map(buildRow)

    return (
        <div className="product_page container py-4">
            <Link to="/create_product"><button className="btn btn-primary mb-4">Add product</button></Link>
            <div className="row g-4">
                <div className="dishes col-md-6">
                    <h2 className="h5">Dishes</h2>
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dishList}
                        </tbody>
                    </table>
                </div>
                <div className="drinks col-md-6">
                    <h2 className="h5">Drinks</h2>
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {drinkList}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Product;