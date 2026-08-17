import React, { useEffect, useState } from "react";
import { useWaiter } from "../../hooks/useWaiter";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useCloudinary } from "../../hooks/useCloudinary";

const EditWaiterForm = () => {

    const { store } = useGlobalReducer()
    const [waiterData, setWaiterData] = useState({name: "", email: "", password: "", img_url: ""})
    const { getSingleWaiter, editWaiter } = useWaiter()
    const { waiter_id } = useParams()
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getSingleWaiter(waiter_id)
    }, [])
    useEffect(() => {
        if (store.singleWaiter.id) {
            setWaiterData({
                name: store.singleWaiter.name,
                email: store.singleWaiter.email,
                password: "",
                img_url: store.singleWaiter.img_url || ""
            })
        }
    }, [store.singleWaiter])
    
    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit waiter</div>
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

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e)=>uploadImage(e,"cocinapp_images",setWaiterData,waiterData)} />
                    </div>

                    <button onClick={()=>editWaiter(waiter_id, waiterData)} className="btn btn-primary w-100 mb-3">Edit waiter</button>

                    <div className="text-center">
                        <Link to="/waiters">Back to waiters</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default EditWaiterForm;