import { Link } from "react-router-dom"
import { useManager } from "../../hooks/useManager"
import { useState } from "react"

const ManagerLogin = () => {

    const { managerLogin } = useManager()
    const [managerLoginData, setManagerLoginData] = useState({ email: "", password: "" })

    return (
        <div className="container py-5" style={{ maxWidth: "400px" }}>

            <div className="card">
                <div className="card-header text-center">Manager Login</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            onChange={(e) => setManagerLoginData({ ...managerLoginData, email: e.target.value })}
                            value={managerLoginData.email}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            onChange={(e) => setManagerLoginData({ ...managerLoginData, password: e.target.value })}
                            value={managerLoginData.password}
                            type="password"
                            name="password"
                            id="password"
                        />
                    </div>

                    <button className="btn btn-success w-100 mb-3" onClick={() => managerLogin(managerLoginData)}>Login</button>

                    <div className="text-center">
                        <Link to="/">Back to Home</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ManagerLogin