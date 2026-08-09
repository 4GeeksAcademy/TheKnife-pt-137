import React, { useEffect, useState } from "react";
import { useChef } from "../../hooks/useChef";
import { Link } from "react-router-dom";
import storeReducer from "../../store";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useRestaurant } from "../../hooks/useRestaurant";

const RegisterChef = () => {

    const { store } = useGlobalReducer()
    const [chefData, setChefData] = useState({name: "", email: "", password: ""})
    const { registerChef } = useChef()

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Register new chef</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, name: e.target.value})} value={chefData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, email: e.target.value})} value={chefData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e)=>setChefData({...chefData, password: e.target.value})} value={chefData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={()=>registerChef(chefData)} className="btn btn-primary w-100 mb-3">Register new chef</button>

                    <div className="text-center">
                        <Link to="/">Back to home</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default RegisterChef;