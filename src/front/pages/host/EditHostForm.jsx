import React, { useEffect, useState } from "react";
import { useHost } from "../../hooks/useHost";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useCloudinary } from "../../hooks/useCloudinary";

const EditHostForm = () => {

    const { store } = useGlobalReducer();
    const [hostData, setHostData] = useState({ name: "", email: "", password: "", img_url: "" });
    const { getSingleHost, editHost } = useHost();
    const { host_id } = useParams();
    const { uploadImage } = useCloudinary()

    useEffect(() => {
        getSingleHost(host_id);
    }, []);

    useEffect(() => {
        if (store.singleHost.id) {
            setHostData({
                name: store.singleHost.name,
                email: store.singleHost.email,
                password: "",
                img_url: store.singleHost.img_url || "",
            });
        }
    }, [store.singleHost]);

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit host</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, name: e.target.value })} value={hostData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, email: e.target.value })} value={hostData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e) => setHostData({ ...hostData, password: e.target.value })} value={hostData.password} type="password" name="password" id="password" />
                    </div>

                    <div className="mb-3">
                        <input type="file" className="form-control" onChange={(e) => uploadImage(e, "cocinapp_images", setHostData, hostData)} />
                    </div>

                    <button onClick={() => editHost(host_id, hostData)} className="btn btn-primary w-100 mb-3">Edit host</button>

                    <div className="text-center">
                        <Link to="/hosts">Back to hosts</Link>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default EditHostForm;
