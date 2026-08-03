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
        return <li key={dish.id} className="d-flex gap-2 align-items-center">
            {dish.name}
            <span>{dishAmount}</span>
            <div className="d-flex flex-column">
                <button onClick={()=>increaseAmount(dish.id)}>+</button>
                <button onClick={()=>decreaseAmount(dish.id)}>-</button>
            </div>
            <Link to={`/single_product/${dish.id}`}><button className="btn btn-secondary">View product</button></Link>
            <button onClick={()=>{
                createOrderProduct({order_id: order_id, product_id: dish.id, amount: dishAmount})
                }} className="btn btn-primary">Add to order</button>
        </li>
    })

    const drinks = drinksProductList.map((drink) => {
        const drinkAmount = getAmount(drink.id)
        return <li key={drink.id} className="d-flex align-items-center gap-2">
            {drink.name}
            <span>{drinkAmount}</span>
            <div className="d-flex flex-column">
                <button onClick={()=>increaseAmount(drink.id)}>+</button>
                <button onClick={()=>decreaseAmount(drink.id)}>-</button>
            </div>
            <Link to={`/single_product/${drink.id}`}><button className="btn btn-secondary">View product</button></Link>
            <button onClick={()=>{
                createOrderProduct({order_id: order_id, product_id: drink.id})}} className="btn btn-primary">Add to order
            </button>
        </li>
    })

    return (
        <div className="products d-flex align-items-center justify-content-evenly">
            <div className="dishes">
                <h2>Dishes</h2>
                <ul>
                    {dishes}
                </ul>
            </div>
            <div className="drinks">
                <h2>Drinks</h2>
                <ul>
                    {drinks}
                </ul>
            </div>
        </div>
    )
}

export default ProductsListForOrder;