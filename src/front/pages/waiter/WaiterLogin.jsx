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
        <form onSubmit={handleLogin} className="waiter_login mt-5 gap-3 d-flex flex-column justify-content-center align-items-center">
            <div className="email_box">
                <label className="me-2" htmlFor="email">Email</label>
                <input type="text" name="email" id="email" />
            </div>
            <div className="password_box">
                <label className="me-2" htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
            </div>
            <button className="btn btn-success" type="submit">Login</button>
            <Link to="/waiters">Back to waiters</Link>
        </form>
    )
}

export default WaiterLogin