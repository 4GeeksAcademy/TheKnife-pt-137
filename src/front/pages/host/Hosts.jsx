import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";
import { useHost } from "../../hooks/useHost";
import LoadingComponent from "../../components/LoadingComponent";

const Hosts = () => {

    const { getHosts, deleteHost } = useHost();
    const { store } = useGlobalReducer();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getHosts().finally(() => setLoading(false));
    }, []);

    function handleDelete(hostId) {
        const confirmation = window.prompt("Escribe 'DELETE' para borrar este host.");
        if (confirmation !== "DELETE") return;
        deleteHost(hostId);
    }

    if (loading) return <LoadingComponent />;

    const hostsList = store.hosts.map((host) => (
        <tr key={host.id}>
            <td><img src={host.img_url} height="50" width="50" style={{ objectFit: "cover", borderRadius: "50%" }} /></td>
            <td>{host.name}</td>
            <td>{host.email}</td>
            <td>{host.restaurant_id}</td>
            <td>{host.restaurant_name}</td>
            <td className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(host.id)}>Delete</button>
                <Link to={`/edit_host/${host.id}`}><button className="btn btn-warning btn-sm">Edit</button></Link>
                <Link to={`/single_host/${host.id}`}><button className="btn btn-primary btn-sm">View</button></Link>
            </td>
        </tr>
    ));

    return (
        <div className="host_page container py-4">
            <div className="d-flex gap-2 mb-4">
                <Link to="/host_login"><button className="btn btn-success">Host login</button></Link>
                <Link to="/host_dashboard"><button className="btn btn-dark">Host dashboard</button></Link>
            </div>
            <h1 className="h4 mb-3">Hosts</h1>
            {store.hosts.length === 0 ? (
                <p className="text-muted">No hay hosts todavía. Los registra el chef desde su dashboard.</p>
            ) : (
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Restaurant ID</th>
                            <th>Restaurant</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {hostsList}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Hosts;
