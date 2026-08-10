import { useEffect, useState } from "react"
import { useOrderProduct } from "../../../hooks/useOrderProduct"
import { useProduct } from "../../../hooks/useProduct"
import { useParams, Link } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"

const WaiterAddProducts = () => {

    const { store } = useGlobalReducer()
    const { createOrderProduct, getProductsOfAnOrder } = useOrderProduct()
    const { getAllRestaurantProducts } = useProduct()
    const { restaurant_id, order_id } = useParams()
    const [loading, setLoading] = useState(true)
    const [addAmounts, setAddAmounts] = useState({})
    const [addedProducts, setAddedProducts] = useState({})

    useEffect(() => {
        setLoading(true)
        Promise.all([
            getAllRestaurantProducts(restaurant_id),
            getProductsOfAnOrder(order_id)
        ]).finally(() => setLoading(false))
    }, [restaurant_id, order_id])

    function getAddAmount(productId) {
        return addAmounts[productId] ?? 1
    }
    function changeAddAmount(productId, delta) {
        setAddAmounts({
            ...addAmounts,
            [productId]: Math.max(1, getAddAmount(productId) + delta)
        })
    }
    async function handleAddProduct(productId) {
        const success = await createOrderProduct({
            order_id,
            product_id: productId,
            amount: getAddAmount(productId)
        })
        if (success) {
            setAddedProducts((prev) => ({ ...prev, [productId]: true }))
            setTimeout(() => {
                setAddedProducts((prev) => {
                    const { [productId]: _removed, ...rest } = prev
                    return rest
                })
            }, 1200)
        }
    }

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const dishesProductList = store.products.filter((product) => product.type === "dish")
    const drinksProductList = store.products.filter((product) => product.type === "drink")

    function renderProductRow(product) {
        const amount = getAddAmount(product.id)
        const justAdded = !!addedProducts[product.id]
        return (
            <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                    <div className="btn-group btn-group-sm" role="group">
                        <button className="btn btn-outline-secondary" onClick={() => changeAddAmount(product.id, -1)}>-</button>
                        <span className="btn btn-outline-secondary disabled">{amount}</span>
                        <button className="btn btn-outline-secondary" onClick={() => changeAddAmount(product.id, 1)}>+</button>
                    </div>
                </td>
                <td>
                    <button
                        className={`btn btn-sm ${justAdded ? "btn-success" : "btn-primary"}`}
                        style={{ minWidth: "110px" }}
                        onClick={() => handleAddProduct(product.id)}
                        disabled={justAdded}
                    >
                        {justAdded ? "✓ Added" : "Add to order"}
                    </button>
                </td>
            </tr>
        )
    }

    return (
        <div className="container py-4">
            <h1 className="h4 mb-3">Add products to order #{order_id}</h1>
            <div className="row g-4">
                <div className="col-md-6">
                    <h2 className="h5">Dishes</h2>
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dishesProductList.map(renderProductRow)}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6">
                    <h2 className="h5">Drinks</h2>
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Amount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {drinksProductList.map(renderProductRow)}
                        </tbody>
                    </table>
                </div>
            </div>
            <Link to={`/restaurants/${restaurant_id}/orders/${order_id}`} className="d-inline-block mt-3">
                Back to order {store.orderProducts.length > 0 && `(${store.orderProducts.length})`}
            </Link>
        </div>
    )
}

export default WaiterAddProducts
