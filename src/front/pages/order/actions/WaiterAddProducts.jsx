import { useEffect, useState } from "react"
import { useOrderProduct } from "../../../hooks/useOrderProduct"
import { useProduct } from "../../../hooks/useProduct"
import { useParams } from "react-router-dom"
import useGlobalReducer from "../../../hooks/useGlobalReducer"
import LoadingComponent from "../../../components/LoadingComponent"

const formatPrice = (price) =>
    `${Number(price).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`

const WaiterAddProducts = () => {

    const { store } = useGlobalReducer()
    const { createOrderProduct, getProductsOfAnOrder } = useOrderProduct()
    const { getAllRestaurantProducts } = useProduct()
    const { restaurant_id, order_id } = useParams()
    const [loading, setLoading] = useState(true)
    const [addAmounts, setAddAmounts] = useState({})
    const [addedProducts, setAddedProducts] = useState({})
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")

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

    if (loading) return <LoadingComponent />

    const term = search.trim().toLowerCase()
    const matchesSearch = (product) => !term || product.name.toLowerCase().includes(term)

    const dishesProductList = store.products.filter((product) => product.type === "dish" && matchesSearch(product))
    const drinksProductList = store.products.filter((product) => product.type === "drink" && matchesSearch(product))

    const showDishes = filter !== "drink"
    const showDrinks = filter !== "dish"

    function renderProductRow(product, badgeClass, badgeLabel) {
        const amount = getAddAmount(product.id)
        const justAdded = !!addedProducts[product.id]
        return (
            <div className="product-row" key={product.id}>
                {product.img_url ? (
                    <img src={product.img_url} className="product-row-img" alt={product.name} />
                ) : (
                    <div className="product-row-img product-row-img-placeholder">
                        <i className="fa-solid fa-utensils"></i>
                    </div>
                )}
                <div className="product-row-info">
                    <div className="product-row-title">
                        <span className="product-row-name">{product.name}</span>
                        <span className={`product-badge ${badgeClass}`}>{badgeLabel}</span>
                    </div>
                    {product.description && <p className="product-row-desc">{product.description}</p>}
                    {product.ingredients_count != null && (
                        <div className="product-row-ingredients">
                            <i className="fa-solid fa-basket-shopping"></i>{product.ingredients_count} ingredientes
                        </div>
                    )}
                </div>
                <div className="product-row-price">{formatPrice(product.sell_price)}</div>
                <div className="product-row-order-controls">
                    <div className="btn-group btn-group-sm" role="group">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => changeAddAmount(product.id, -1)}>-</button>
                        <span className="btn btn-outline-secondary disabled">{amount}</span>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => changeAddAmount(product.id, 1)}>+</button>
                    </div>
                    <button
                        type="button"
                        className={`btn btn-sm ${justAdded ? "btn-success" : "btn-primary"}`}
                        style={{ minWidth: "110px" }}
                        onClick={() => handleAddProduct(product.id)}
                        disabled={justAdded}
                    >
                        {justAdded ? "✓ Añadido" : "Añadir"}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="product_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Añadir productos a la comanda #{order_id}</h1>
            </div>

            <div className="product-toolbar">
                <div className="product-filter-tabs">
                    <button type="button" className={`product-filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>Todos</button>
                    <button type="button" className={`product-filter-btn ${filter === "dish" ? "active" : ""}`} onClick={() => setFilter("dish")}>Platos</button>
                    <button type="button" className={`product-filter-btn ${filter === "drink" ? "active" : ""}`} onClick={() => setFilter("drink")}>Bebidas</button>
                </div>
                <div className="product-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    {showDishes && (
                        <div className="product-section">
                            <div className="product-section-header">
                                <i className="fa-solid fa-utensils"></i>
                                <span>PLATOS</span>
                                <span className="product-section-line"></span>
                            </div>
                            {dishesProductList.length > 0 ? (
                                <div className="product-list">
                                    {dishesProductList.map((dish) => renderProductRow(dish, "product-badge-dish", "Plato"))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-3 mb-0">No hay platos.</p>
                            )}
                        </div>
                    )}

                    {showDrinks && (
                        <div className="product-section">
                            <div className="product-section-header">
                                <i className="fa-solid fa-martini-glass-citrus"></i>
                                <span>BEBIDAS</span>
                                <span className="product-section-line"></span>
                            </div>
                            {drinksProductList.length > 0 ? (
                                <div className="product-list">
                                    {drinksProductList.map((drink) => renderProductRow(drink, "product-badge-drink", "Bebida"))}
                                </div>
                            ) : (
                                <p className="text-muted text-center py-3 mb-0">No hay bebidas.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WaiterAddProducts
