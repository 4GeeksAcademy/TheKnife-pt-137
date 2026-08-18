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
        <div
            className="auth-page"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="auth-card">
                <div className="auth-form-panel">
                    <p className="brand">The Knife <img src="/logobueno.png" alt="The Knife" className="brand-icon" /></p>
                    <p className="subtitle">Inicia sesión como Mesero</p>

                    <form onSubmit={handleLogin}>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input className="form-control" type="text" name="email" id="email" />
                        </div>

                        <div className="mb-2">
                            <label className="form-label" htmlFor="password">Contraseña</label>
                            <input className="form-control" type="password" name="password" id="password" />
                        </div>

                        <div className="auth-remember-forgot">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="remember" />
                                <label className="form-check-label" htmlFor="remember">Recuérdame</label>
                            </div>
                        </div>

                        <button className="btn btn-cocin w-100 mb-3" type="submit">Iniciar sesión</button>

                        <div className="text-center">
                            <Link to="/" className="text-muted">Volver al inicio</Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default WaiterLogin
