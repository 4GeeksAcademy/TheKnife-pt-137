

import { Link } from "react-router-dom"
import { useState } from "react"
import { useCook } from "../../hooks/useCook"

const CookLogin = () => {

    const { cookLogin } = useCook()
    const [cookLoginData, setCookLoginData] = useState({email: "", password: ""})

    return (
        <div className="container py-5" style={{ maxWidth: "400px" }}>

            <div className="card">
                <div className="card-header text-center">Cook Login</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCookLoginData({ ...cookLoginData, email: e.target.value })}
                            value={cookLoginData.email}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCookLoginData({ ...cookLoginData, password: e.target.value })}
                            value={cookLoginData.password}
                            type="password"
                            name="password"
                            id="password"
                        />
                    </div>

                    <button className="btn btn-success w-100 mb-3" onClick={() => cookLogin(cookLoginData)}>Login</button>

                    <div className="text-center">
                        <Link to="/">Back to home</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CookLogin