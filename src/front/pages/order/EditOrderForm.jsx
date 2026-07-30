import React, { useEffect, useState } from "react";
import { useOrder } from "../../hooks/useOrder";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const EditOrderForm = () => {

    const { store } = useGlobalReducer()
    const [orderData, setOrderData] = useState({table_id: "", waiter_id: "", state: "", people: 0})
    const { getSingleOrder, editOrder } = useOrder()
    const { order_id } = useParams()

    useEffect(() => {
        getSingleOrder(order_id)
    }, [])
    useEffect(() => {
        if (store.singleOrder.id) {
            setOrderData({
                table_id: store.singleOrder.table_id,
                waiter_id: store.singleOrder.waiter_id,
                state: store.singleOrder.state,
                people: store.singleOrder.people
            })
        }
    }, [store.singleOrder])
    
    return (
        <div className="order_form d-flex flex-column align-items-center gap-3">
            <h1>Edit order</h1>
            <div>
                <label htmlFor="name">table id</label>
                <input onChange={(e)=>setOrderData({...orderData, table_id: e.target.value})} value={orderData.table_id} type="number" name="tableid" id="tableid" />
            </div>
            <div>
                <label htmlFor="email">waiter id</label>
                <input onChange={(e)=>setOrderData({...orderData, waiter_id: e.target.value})} value={orderData.waiter_id} type="number" name="waiterid" id="waiterid" />
            </div>
            <div>
                <label htmlFor="phone">state</label>
                <select onChange={(e)=>setOrderData({...orderData, state: e.target.value})} value={orderData.state} name="state" id="state">
                    <option value="">Select a state</option>
                    <option value="pending">Pending</option>
                    <option value="doing">Doing</option>
                    <option value="ready">Ready</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            <div>
                <label htmlFor="people">people</label>
                <input onChange={(e)=>setOrderData({...orderData, people: e.target.value})} value={orderData.people} type="number" name="people" id="people" />
            </div>
            <button onClick={()=>editOrder(order_id, orderData)} className="btn btn-primary">Edit order</button>
            <Link to="/orders">Back to orders</Link>
        </div>
    )
}

export default EditOrderForm;