import React, { useState } from "react";
import { useManager } from "../../hooks/useManager";
import { Link } from "react-router-dom";

const CreateManagerForm = () => {

    const [managerData, setManagerData] = useState({name: "", email: "", password: ""})
    const { createManager } = useManager()

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new manager</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e)=>setManagerData({...managerData, name: e.target.value})} value={managerData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e)=>setManagerData({...managerData, email: e.target.value})} value={managerData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e)=>setManagerData({...managerData, password: e.target.value})} value={managerData.password} type="password" name="password" id="password" />
                    </div>

                    <button onClick={()=>createManager(managerData)} className="btn btn-primary w-100 mb-3">Create new manager</button>

                    <div className="text-center">
                        <Link to="/managers">Back to managers</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateManagerForm;