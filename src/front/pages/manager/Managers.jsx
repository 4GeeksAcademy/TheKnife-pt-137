import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useManager } from "../../hooks/useManager";

const Managers = () => {

    const { getManagers, deleteManager } = useManager()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getManagers().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const managersList = store.managers.map((manager) => {
        return <tr key={manager.id}>
            <td>{manager.name}</td>
            <td>{manager.email}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteManager(manager.id)}>Delete</button>
                <Link to={`/edit_manager/${manager.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="manager_page container py-4">
            <div className="d-flex gap-2 mb-4">
                <Link to="/create_manager"><button className="btn btn-primary">Add manager</button></Link>
                <Link to="/manager_login"><button className="btn btn-success">Manager login</button></Link>
                <Link to="/manager_dashboard"><button className="btn btn-dark">Manager dashboard</button></Link>
            </div>
            <h1 className="h4 mb-3">Managers</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {managersList}
                </tbody>
            </table>
        </div>
    )
}

export default Managers;