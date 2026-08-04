import React, { useEffect, useState } from "react";
import { useCook } from "../../../hooks/useCook";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../../../hooks/useGlobalReducer";


const RegisterCook = () => {

    const { store } = useGlobalReducer()
    const { restaurant_id } = useParams()
    const [cookData, setCookData] = useState({name: "", email: "", password: ""})
    const { cookRegister } = useCook()

    return (
        <div className="cook-form d-flex flex-column align-items-center gap-3">
            <h1>Create new Cook</h1>
            <div>
                <label htmlFor="name">Name</label>
                <input onChange={(e)=>setCookData({...cookData, name: e.target.value})} value={cookData.name} type="text" name="name" id="name" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input onChange={(e)=>setCookData({...cookData, email: e.target.value})} value={cookData.email} type="text" name="email" id="email" />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input onChange={(e)=>setCookData({...cookData, password: e.target.value})} value={cookData.password} type="password" name="password" id="password" />
            </div>
            <button onClick={()=>cookRegister(restaurant_id, cookData)} className="btn btn-primary">Create new cook</button>
        </div>
    )
}

export default RegisterCook;