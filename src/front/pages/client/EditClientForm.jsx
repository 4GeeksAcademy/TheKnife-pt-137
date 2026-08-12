import React, { useEffect, useState } from "react";
import { useClient } from "../../hooks/useClient";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const EditClientForm = () => {

    const { store } = useGlobalReducer()
    const [clientData, setClientData] = useState({ name: "", email: "", password: "", phone: "" })
    const { getClients, editClient } = useClient()
    const { client_id } = useParams()

    useEffect(() => {
        getClients()
    }, [])

    useEffect(() => {
        const currentClient = store.clients.find((clientItem) => clientItem.id === Number(client_id))
        if (currentClient) {
            setClientData({
                name: currentClient.name,
                email: currentClient.email,
                password: "",
                phone: currentClient.phone || ""
            })
        }
    }, [store.clients])

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Edit client</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Name</label>
                        <input className="form-control" onChange={(e) => setClientData({ ...clientData, name: e.target.value })} value={clientData.name} type="text" name="name" id="name" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-control" onChange={(e) => setClientData({ ...clientData, email: e.target.value })} value={clientData.email} type="text" name="email" id="email" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input className="form-control" onChange={(e) => setClientData({ ...clientData, password: e.target.value })} value={clientData.password} type="password" name="password" id="password" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="phone">Phone</label>
                        <input className="form-control" onChange={(e) => setClientData({ ...clientData, phone: e.target.value })} value={clientData.phone} type="text" name="phone" id="phone" />
                    </div>

                    <button onClick={() => editClient(client_id, clientData)} className="btn btn-primary w-100 mb-3">Edit client</button>

                    <div className="text-center">
                        <Link to="/clients">Back to clients</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default EditClientForm;
