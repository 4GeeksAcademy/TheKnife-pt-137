import { Link } from "react-router-dom"
import { useChef } from "../../hooks/useChef"
import { useState } from "react"

const ChefLogin = () => {

    const { chefLogin } = useChef()
    const [chefLoginData, setChefLoginData] = useState({ email: "", password: "" })

    return (
        <div className="container py-5" style={{ maxWidth: "400px" }}>

            <div className="card">
                <div className="card-header text-center">Chef Login</div>
                <div className="card-body">

                    <div className="mb-3">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            className="form-control"
                            onChange={(e) => setChefLoginData({ ...chefLoginData, email: e.target.value })}
                            value={chefLoginData.email}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            className="form-control"
                            onChange={(e) => setChefLoginData({ ...chefLoginData, password: e.target.value })}
                            value={chefLoginData.password}
                            type="password"
                            name="password"
                            id="password"
                        />
                    </div>

                    <button className="btn btn-success w-100 mb-3" onClick={() => chefLogin(chefLoginData)}>Login</button>

                    <div className="text-center">
                        <Link to="/chefs">Back to chefs</Link>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default ChefLogin
