import React, { useEffect, useState } from "react";
import { useWaiter } from "../../hooks/useWaiter";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const EditWaiterForm = () => {

    const { store } = useGlobalReducer()
    const [waiterData, setWaiterData] = useState({name: "", email: "", password: ""})
    const { getSingleWaiter, editWaiter } = useWaiter()
    const { waiter_id } = useParams()

    useEffect(() => {
        getSingleWaiter(waiter_id)
    }, [])
    useEffect(() => {
        if (store.singleWaiter.id) {
            setWaiterData({
                name: store.singleWaiter.name,
                email: store.singleWaiter.email,
                password: ""
            })
        }
    }, [store.singleWaiter])
    
    return (
        <div className="waiter_form d-flex flex-column align-items-center gap-3">
            <h1>Edit waiter</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setWaiterData({...waiterData, name: e.target.value})} value={waiterData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e)=>setWaiterData({...waiterData, email: e.target.value})} value={waiterData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="phone">Password</label>
                <input onChange={(e)=>setWaiterData({...waiterData, password: e.target.value})} value={waiterData.password} type="password" name="password" id="password" />
            </div>
            <button onClick={()=>editWaiter(waiter_id, waiterData)} className="btn btn-primary">Edit waiter</button>
            <Link to="/waiters">Back to waiters</Link>
        </div>
    )
}

export default EditWaiterForm;