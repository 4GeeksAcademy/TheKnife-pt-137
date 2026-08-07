import { useEffect } from "react";
import { useTable } from "../../hooks/useTable";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { Link } from "react-router-dom";

const SingleTable = () => {

    const { store } = useGlobalReducer();
    const { getSingleTable } = useTable();
    const { table_id } = useParams();

    useEffect(() => {
        if (table_id) {
            getSingleTable(table_id);
        }
    }, [table_id]);

    return (
        <div className="container py-4 d-flex flex-column align-items-center">

            <div className="card" style={{ maxWidth: "500px" }}>
                <div className="card-body">
                    <h1 className="h4">Table #{store.singleTable?.number}</h1>
                    <ul className="list-group list-group-flush mb-3">
                        <li className="list-group-item"><strong>Status:</strong> {store.singleTable?.status}</li>
                        <li className="list-group-item"><strong>Location:</strong> {store.singleTable?.location}</li>
                    </ul>
                    <Link to="/tables" className="btn btn-outline-secondary">Back to tables</Link>
                </div>
            </div>

        </div>
    );
};

export default SingleTable;