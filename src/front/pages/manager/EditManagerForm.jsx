import React, { useEffect, useState } from "react";
import { useManager } from "../../hooks/useManager";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EditManagerForm = () => {

    const { store } = useGlobalReducer()
    const [managerData, setManagerData] = useState({name: "", email: "", password: ""})
    const { getManagers, editManager } = useManager()
    const { manager_id } = useParams()

    useEffect(() => {
        getManagers()
    }, [])

    useEffect(() => {
        const currentManager = store.managers.find((manager) => manager.id === Number(manager_id))
        if (currentManager) {
            setManagerData({
                name: currentManager.name,
                email: currentManager.email,
                password: ""
            })
        }
    }, [store.managers])

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit manager</div>
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

                    <button onClick={()=>editManager(manager_id, managerData)} className="btn btn-primary w-100 mb-3">Edit manager</button>

                    <div className="text-center">
                        <Link to="/managers">Back to managers</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default EditManagerForm;