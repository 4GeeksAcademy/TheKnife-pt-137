import React, { useEffect, useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import { useTable } from "../../hooks/useTable";
import { useWaiter } from "../../hooks/useWaiter";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const CreateOrderForm = () => {

    const [orderData, setOrderData] = useState({table_id: "", waiter_id: "", date_time: "", people: 0})
    const { createOrder } = useOrder()
    const { getTables } = useTable()
    const { getWaiters } = useWaiter()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getTables()
        getWaiters()
    }, [])

    const tables = store.tables.map((table) => {
        return <option value={table.id} key={table.id}>id: {table.id} restaurant: {table.restaurant_name}</option>
    })

    const waiters = store.waiters.map((waiter) => {
        return <option value={waiter.id} key={waiter.id}>name: {waiter.name} restaurant: {waiter.restaurant_name}</option>
    })

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new order</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="tableid">Table</label>
                        <select className="form-select" onChange={(e)=>setOrderData({...orderData, table_id: e.target.value})} value={orderData.table_id} name="tableid" id="tableid">
                            <option value="">Select one</option>
                            {tables}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="waiterid">Waiter</label>
                        <select className="form-select" onChange={(e)=>setOrderData({...orderData, waiter_id: e.target.value})} value={orderData.waiter_id} name="waiterid" id="waiterid">
                            <option value="">Select one</option>
                            {waiters}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="people">People</label>
                        <input className="form-control" onChange={(e)=>setOrderData({...orderData, people: e.target.value})} value={orderData.people} type="number" name="people" id="people" />
                    </div>

                    <button className="btn btn-primary w-100 mb-3" onClick={()=>createOrder(orderData)}>Create new order</button>

                    <div className="text-center">
                        <Link to="/orders">Back to orders</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateOrderForm;