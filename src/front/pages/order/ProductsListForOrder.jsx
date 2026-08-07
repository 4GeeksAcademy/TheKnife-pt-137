import { useEffect, useState } from "react";
import { useProduct } from "../../hooks/useProduct";
import { Link, useParams } from "react-router-dom";
import { useOrderProduct } from "../../hooks/useOrderProduct";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const ProductsListForOrder = () => {

    const { store } = useGlobalReducer()
    const { getProducts } = useProduct()
    const { createOrderProduct } = useOrderProduct()
    const { order_id } = useParams()
    const [amounts, setAmounts] = useState({})

    useEffect(() => {
        getProducts()
    }, [])

    const dishesProductList = store.products.filter(dish => dish.type === "dish")
    const drinksProductList = store.products.filter(drink => drink.type === "drink")

    const getAmount = (productId) => {
        return amounts[productId] ?? 1
    }
    const increaseAmount = (productId) => {
        setAmounts({
            ...amounts,
            [productId]: getAmount(productId) + 1
        })
    }
    const decreaseAmount = (productId) => {
        setAmounts({
            ...amounts,
            [productId]: Math.max(1, getAmount(productId) - 1)
        })
    }

    const dishes = dishesProductList.map((dish) => {
        const dishAmount = getAmount(dish.id)
        return <tr key={dish.id}>
            <td>{dish.name}</td>
            <td>
                <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-outline-secondary" onClick={()=>decreaseAmount(dish.id)}>-</button>
                    <span className="btn btn-outline-secondary disabled">{dishAmount}</span>
                    <button className="btn btn-outline-secondary" onClick={()=>increaseAmount(dish.id)}>+</button>
                </div>
            </td>
            <td className="d-flex gap-2">
                <Link to={`/single_product/${dish.id}`}><button className="btn btn-secondary btn-sm">View</button></Link>
                <button onClick={()=>{
                    createOrderProduct({order_id: order_id, product_id: dish.id, amount: dishAmount})
                    }} className="btn btn-primary btn-sm">Add to order</button>
            </td>
        </tr>
    })

    const drinks = drinksProductList.map((drink) => {
        const drinkAmount = getAmount(drink.id)
        return <tr key={drink.id}>
            <td>{drink.name}</td>
            <td>
                <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-outline-secondary" onClick={()=>decreaseAmount(drink.id)}>-</button>
                    <span className="btn btn-outline-secondary disabled">{drinkAmount}</span>
                    <button className="btn btn-outline-secondary" onClick={()=>increaseAmount(drink.id)}>+</button>
                </div>
            </td>
            <td className="d-flex gap-2">
                <Link to={`/single_product/${drink.id}`}><button className="btn btn-secondary btn-sm">View</button></Link>
                <button onClick={()=>{
                    createOrderProduct({order_id: order_id, product_id: drink.id})}} className="btn btn-primary btn-sm">Add to order
                </button>
            </td>
        </tr>
    })

    return (
        <div className="products container py-4">
            <h1 className="h4 mb-3">Add products to order #{order_id}</h1>
            <div className="row g-4">
                <div className="dishes col-md-6">
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
                            {dishes}
                        </tbody>
                    </table>
                </div>
                <div className="drinks col-md-6">
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
                            {drinks}
                        </tbody>
                    </table>
                </div>
            </div>
            <Link to={`/single_order/${order_id}`} className="d-inline-block mt-3">Back to order</Link>
        </div>
    )
}

export default ProductsListForOrder;