import { Link } from "react-router-dom"
import { useClient } from "../../hooks/useClient"
import { useState } from "react"

const ClientLogin = () => {

    const { clientLogin } = useClient()
    const [clientLoginData, setClientLoginData] = useState({ email: "", password: "" })

    return (
        <div className="container py-5" style={{ maxWidth: "400px" }}>

            <div className="card">
                <div className="card-header text-center">Client Login</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            onChange={(e) => setClientLoginData({ ...clientLoginData, email: e.target.value })}
                            value={clientLoginData.email}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            onChange={(e) => setClientLoginData({ ...clientLoginData, password: e.target.value })}
                            value={clientLoginData.password}
                            type="password"
                            name="password"
                            id="password"
                        />
                    </div>

                    <button className="btn btn-success w-100 mb-3" onClick={() => clientLogin(clientLoginData)}>Login</button>

                    <div className="text-center">
                        <Link to="/">Back to home</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ClientLogin
