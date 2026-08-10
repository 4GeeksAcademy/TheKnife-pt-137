import { Link } from "react-router-dom";
import { useHost } from "../../hooks/useHost";
import { useState } from "react";

const HostLogin = () => {

    const { hostLogin } = useHost();
    const [hostLoginData, setHostLoginData] = useState({ email: "", password: "" });

    return (
        <div className="container py-5" style={{ maxWidth: "400px" }}>

            <div className="card">
                <div className="card-header text-center">Host Login</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            onChange={(e) => setHostLoginData({ ...hostLoginData, email: e.target.value })}
                            value={hostLoginData.email}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            onChange={(e) => setHostLoginData({ ...hostLoginData, password: e.target.value })}
                            value={hostLoginData.password}
                            type="password"
                            name="password"
                            id="password"
                        />
                    </div>

                    <button className="btn btn-success w-100 mb-3" onClick={() => hostLogin(hostLoginData)}>Login</button>

                    <div className="text-center">
                        <Link to="/">Back to home</Link>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default HostLogin;
