import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useWaiter } from "../../hooks/useWaiter";

const Waiters = () => {

    const { getWaiters, deleteWaiter } = useWaiter()
    const { store } = useGlobalReducer()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getWaiters().finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-center mt-5">Loading...</p>

    const waitersList = store.waiters.map((waiter) => {
        return <tr key={waiter.id}>
            <td>{waiter.name}</td>
            <td>{waiter.email}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => deleteWaiter(waiter.id)}>Delete</button>
                <Link to={`/edit_waiter/${waiter.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_waiter/${waiter.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    })

    return (
        <div className="waiter_page container py-4">
            <div className="d-flex gap-2 mb-4">
                <Link to="/create_waiter"><button className="btn btn-primary">Add waiter</button></Link>
                <Link to="/waiter_login"><button className="btn btn-success">Waiter login</button></Link>
            </div>
            <h1 className="h4 mb-3">Waiters</h1>
            <table className="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {waitersList}
                </tbody>
            </table>
        </div>
    )
}

export default Waiters;