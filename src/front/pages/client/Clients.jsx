import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useClient } from "../../hooks/useClient";
import LoadingComponent from "../../components/LoadingComponent";

const Clients = () => {

    const { getClients, deleteClient } = useClient()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getClients().finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingComponent />

    const clientsList = store.clients.map((clientItem) => {
        return <tr key={clientItem.id}>
            <td>{clientItem.name}</td>
            <td>{clientItem.email}</td>
            <td>{clientItem.phone}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteClient(clientItem.id)}>Delete</button>
                <Link to={`/edit_client/${clientItem.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="client_page container py-4">
            <div className="d-flex gap-2 mb-4">
                <Link to="/create_client"><button className="btn btn-primary">Add client</button></Link>
                <Link to="/client_login"><button className="btn btn-success">Client login</button></Link>
            </div>
            <h1 className="h4 mb-3">Clients</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {clientsList}
                </tbody>
            </table>
        </div>
    )
}

export default Clients;
