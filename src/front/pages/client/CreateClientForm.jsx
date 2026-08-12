import React, { useState } from "react";
import { useClient } from "../../hooks/useClient";
import { Link } from "react-router-dom";

const CreateClientForm = () => {

    const [clientData, setClientData] = useState({ name: "", email: "", password: "", phone: "" })
    const { createClient } = useClient()

    return (
        <div className="container py-5" style={{ maxWidth: "500px" }}>

            <div className="card">
                <div className="card-header text-center">Create new client</div>
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

                    <button onClick={() => createClient(clientData)} className="btn btn-primary w-100 mb-3">Create new client</button>

                    <div className="text-center">
                        <Link to="/clients">Back to clients</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreateClientForm;
