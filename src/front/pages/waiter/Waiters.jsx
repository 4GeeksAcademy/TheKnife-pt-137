import React, { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useWaiter } from "../../hooks/useWaiter";

const Waiters = () => {

    const { getWaiters, deleteWaiter } = useWaiter()
    const { store } = useGlobalReducer()

    useEffect(() => {
        getWaiters()
    }, [])

    const waitersList = store.waiters.map((waiter) => {
        return <div key={waiter.id} className="waiter d-flex align-items-center gap-3">
            <span>Name: {waiter.name}</span>
            <span>Email: {waiter.email}</span>
            <button className="btn btn-danger" onClick={() => deleteWaiter(waiter.id)}>Delete waiter</button>
            <Link to={`/edit_waiter/${waiter.id}`}><button className="btn btn-warning">Edit waiter</button></Link>
            <Link to={`/single_waiter/${waiter.id}`}><button className="btn btn-primary">View waiter</button></Link>
        </div>
    })

    return (
        <div className="waiter_page d-flex flex-column align-items-center gap-3 mt-4">
            <Link to="/create_waiter"><button className="btn btn-primary">Add waiter</button></Link>
            <div className="waiters d-flex flex-column  align-items-center gap-2">
                <h1>Waiters</h1>
                {waitersList}
            </div>
        </div>
    )
}

export default Waiters;