import React, { useEffect, useState } from "react";
import { useCook } from "../../hooks/useCook";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useCloudinary } from "../../hooks/useCloudinary";

const EditCookForm = () => {

    const { store } = useGlobalReducer();
    const [cookData, setCookData] = useState({ name: "", email: "", password: "", img_url: "" });
    const { getSingleCook, editCook } = useCook();
    const { cook_id } = useParams();
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getSingleCook(cook_id);
    }, []);
    useEffect(() => {
        if (store.singleCook.id) {
            setCookData({
                name: store.singleCook.name,
                email: store.singleCook.email,
                password: "",
                img_url: store.singleCook.img_url || ""
            });
        }
    }, [store.singleCook]);

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit cook</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, name: e.target.value })} value={cookData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, email: e.target.value })} value={cookData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e) => setCookData({ ...cookData, password: e.target.value })} value={cookData.password} type="password" name="password" id="password" />
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setCookData, cookData)} />
                    </div>

                    <button onClick={() => editCook(cook_id, cookData)} className="btn btn-primary w-100 mb-3">Edit cook</button>

                    <div className="text-center">
                        <Link to="/cooks">Back to cooks</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default EditCookForm;