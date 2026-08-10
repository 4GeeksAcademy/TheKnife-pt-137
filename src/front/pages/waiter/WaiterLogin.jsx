import { Link } from "react-router-dom"
import { useWaiter } from "../../hooks/useWaiter"

const WaiterLogin = () => {

    const { waiterLogin } = useWaiter()

    const handleLogin = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const waiterLoginData = {
            email: formData.get("email"),
            password: formData.get("password")
        }
        waiterLogin(waiterLoginData)
    }

    return (
        <div className="container py-5" style={{ maxWidth: "400px" }}>

            <div className="card">
                <div className="card-header text-center">Waiter Login</div>
                <div className="card-body">

                    <form onSubmit={handleLogin}>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input className="form-control" type="text" name="email" id="email" />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input className="form-control" type="password" name="password" id="password" />
                        </div>

                        <button className="btn btn-success w-100 mb-3" type="submit">Login</button>

                        <div className="text-center">
                            <Link to="/">Back to Home</Link>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )
}

export default WaiterLogin