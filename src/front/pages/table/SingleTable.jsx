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
        <div className="single_table">
            <h1>number: {store.singleTable?.number}</h1>
            <h2>status: {store.singleTable?.status}</h2>
            <h3>location: {store.singleTable?.location}</h3>
            <Link to="/tables">Back to tables</Link>
        </div>
    );
};

export default SingleTable;