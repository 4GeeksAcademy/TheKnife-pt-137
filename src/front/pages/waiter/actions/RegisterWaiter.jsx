import React, { useEffect, useState } from "react";
import { useWaiter } from "../../../hooks/useWaiter";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";


const RegisterWaiter = () => {

    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [waiterData, setWaiterData] = useState({name: "", email: "", password: ""})
    const { waiterRegister } = useWaiter()

    return (
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new waiter</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setWaiterData({...waiterData, name: e.target.value})} value={waiterData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setWaiterData({...waiterData, email: e.target.value})} value={waiterData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e)=>setWaiterData({...waiterData, password: e.target.value})} value={waiterData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={()=>waiterRegister(restaurant_id, waiterData)} className="btn btn-primary w-100 mb-3">Create new waiter</button>

                </div>
            </div>

        </div>
    )
}

export default RegisterWaiter;