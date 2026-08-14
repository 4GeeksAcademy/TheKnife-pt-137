import React, { useEffect, useState } from "react";
import { useCook } from "../../../hooks/useCook";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";


const RegisterCook = () => {

    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [cookData, setCookData] = useState({name: "", email: "", password: ""})
    const { cookRegister } = useCook()

    return (
        <div className="mx-auto" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new cook</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setCookData({...cookData, name: e.target.value})} value={cookData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setCookData({...cookData, email: e.target.value})} value={cookData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e)=>setCookData({...cookData, password: e.target.value})} value={cookData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={()=>cookRegister(restaurant_id, cookData)} className="btn btn-primary w-100 mb-3">Create new cook</button>

                </div>
            </div>

        </div>
    )
}

export default RegisterCook;