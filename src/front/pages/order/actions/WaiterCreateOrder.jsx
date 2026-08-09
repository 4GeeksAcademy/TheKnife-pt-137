import React, { useEffect, useState } from "react";
import { useOrder } from "../../../hooks/useOrder";
import { useTable } from "../../../hooks/useTable";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";

const WaiterCreateOrder = () => {

    const { store } = useGlobalReducer()
    const { waiterCreateOrder } = useOrder()
    const { getAllRestaurantTables } = useTable()
    const { restaurant_id } = useParams()

    const [orderData, setOrderData] = useState({ table_id: "", people: "" })

    useEffect(() => {
        getAllRestaurantTables(restaurant_id)
    }, [])

    const tables = store.tables
        .filter((table) => table.status === "free")
        .map((table) => (
            <option value={table.id} key={table.id}>Table #{table.number} — {table.location}</option>
        ))

    function handleSubmit(e) {
        e.preventDefault()
        waiterCreateOrder(
            restaurant_id,
            orderData,
            `/restaurants/${restaurant_id}/waiter_orders`
        )
    }

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>
            <div className="card">
                <div className="card-header text-center">Create new order</div>
                <div className="card-body">

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="tableid">Table</label>
                            <select className="form-select" required
                                onChange={(e) => setOrderData({ ...orderData, table_id: e.target.value })}
                                value={orderData.table_id} id="tableid">
                                <option value="">Select one</option>
                                {tables}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="people">People</label>
                            <input className="form-control" required type="number" min="1"
                                onChange={(e) => setOrderData({ ...orderData, people: e.target.value })}
                                value={orderData.people} id="people" />
                        </div>

                        <button className="btn btn-primary w-100 mb-3" type="submit">Create new order</button>
                    </form>

                    <div className="text-center">
                        <Link to={`/restaurants/${restaurant_id}/waiter_orders`}>Back to orders</Link>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default WaiterCreateOrder;