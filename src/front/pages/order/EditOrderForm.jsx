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
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit order</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="tableid">Table ID</label>
                        <input className="form-control" onChange={(e)=>setOrderData({...orderData, table_id: e.target.value})} value={orderData.table_id} type="number" name="tableid" id="tableid" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="waiterid">Waiter ID</label>
                        <input className="form-control" onChange={(e)=>setOrderData({...orderData, waiter_id: e.target.value})} value={orderData.waiter_id} type="number" name="waiterid" id="waiterid" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="state">State</label>
                        <select className="form-select" onChange={(e)=>setOrderData({...orderData, state: e.target.value})} value={orderData.state} name="state" id="state">
                            <option value="">Select a state</option>
                            <option value="pending">Pending</option>
                            <option value="doing">Doing</option>
                            <option value="ready">Ready</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="people">People</label>
                        <input className="form-control" onChange={(e)=>setOrderData({...orderData, people: e.target.value})} value={orderData.people} type="number" name="people" id="people" />
                    </div>

                    <button onClick={()=>editOrder(order_id, orderData)} className="btn btn-primary w-100 mb-3">Edit order</button>

                    <div className="text-center">
                        <Link to="/orders">Back to orders</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default EditOrderForm;