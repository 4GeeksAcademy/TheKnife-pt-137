import React, { useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import { Link } from "react-router-dom";

const CreateOrderForm = () => {

    const [orderData, setOrderData] = useState({table_id: "", waiter_id: "", date_time: "", people: 0})
    const { createOrder } = useOrder()

    return (
        <div className="order_form d-flex flex-column align-items-center gap-3">
            <h1>Create new order</h1>
            <div>
                <label htmlFor="tableid">table id</label>
                <input onChange={(e)=>setOrderData({...orderData, table_id: e.target.value})} value={orderData.table_id} type="number" name="tableid" id="tableid" />
            </div>
            <div>
                <label htmlFor="waiterid">waiter id</label>
                <input onChange={(e)=>setOrderData({...orderData, waiter_id: e.target.value})} value={orderData.waiter_id} type="number" name="waiterid" id="waiterid" />
            </div>
            <div>
                <label htmlFor="people">People</label>
                <input onChange={(e)=>setOrderData({...orderData, people: e.target.value})} value={orderData.people} type="number" name="people" id="people" />
            </div>
            <button onClick={()=>createOrder(orderData)} className="btn btn-primary">Create new order</button>
            <Link to="/orders">Back to orders</Link>
        </div>
    )
}

export default CreateOrderForm;