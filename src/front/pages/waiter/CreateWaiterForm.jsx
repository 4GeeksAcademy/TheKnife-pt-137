import React, { useState } from "react";
import { useWaiter } from "../../hooks/useWaiter";
import { Link } from "react-router-dom";

const CreateWaiterForm = () => {

    const [waiterData, setWaiterData] = useState({name: "", email: "", password: ""})
    const { createWaiter } = useWaiter()

    return (
        <div className="waiter_form d-flex flex-column align-items-center gap-3">
            <h1>Create new waiter</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setWaiterData({...waiterData, name: e.target.value})} value={waiterData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e)=>setWaiterData({...waiterData, email: e.target.value})} value={waiterData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input onChange={(e)=>setWaiterData({...waiterData, password: e.target.value})} value={waiterData.password} type="password" name="password" id="password" />
            </div>
            <button onClick={()=>createWaiter(waiterData)} className="btn btn-primary">Create new waiter</button>
            <Link to="/waiters">Back to waiters</Link>
        </div>
    )
}

export default CreateWaiterForm;