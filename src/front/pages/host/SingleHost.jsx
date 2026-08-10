import { useEffect } from "react";
import { useHost } from "../../hooks/useHost";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const SingleHost = () => {

    const { store } = useGlobalReducer();
    const { getSingleHost } = useHost();
    const { host_id } = useParams();

    useEffect(() => {
        getSingleHost(host_id);
    }, []);

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                    <h1 className="h4">{store.singleHost.name}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Email:</strong> {store.singleHost.email}</li>
                        <li className="list-group-item"><strong>Restaurant ID:</strong> {store.singleHost.restaurant_id}</li>
                        <li className="list-group-item"><strong>Restaurant:</strong> {store.singleHost.restaurant_name}</li>
                    </ul>
                    <Link to="/hosts" className="btn btn-outline-secondary">Back to hosts</Link>
                </div>
            </div>

        </div>
    );
};

export default SingleHost;
