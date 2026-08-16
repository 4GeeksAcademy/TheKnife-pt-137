import { Link } from "react-router-dom"
import { useClient } from "../../hooks/useClient"
import { useState } from "react"

const ClientLogin = () => {

    const { clientLogin } = useClient()
    const [clientLoginData, setClientLoginData] = useState({ email: "", password: "" })

    return (
        <div
            className="auth-page"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="auth-card">
                <div className="auth-form-panel">
                    <p className="brand">The Knife 🔪</p>
                    <p className="subtitle">Inicia sesión como Cliente</p>

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

                    <div className="mb-2">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input
                            className="form-control"
                            onChange={(e) => setClientLoginData({ ...clientLoginData, password: e.target.value })}
                            value={clientLoginData.password}
                            type="password"
                            name="password"
                            id="password"
                        />
                    </div>

                    <div className="auth-remember-forgot">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember" />
                            <label className="form-check-label" htmlFor="remember">Recuérdame</label>
                        </div>
                    </div>

                    <button className="btn btn-cocin w-100 mb-3" onClick={() => clientLogin(clientLoginData)}>
                        Iniciar sesión
                    </button>

                    <div className="text-center mb-2">
                        <span>¿No tienes cuenta? </span>
                        <Link to="/client_register" className="auth-switch-link">Regístrate</Link>
                    </div>

                    <div className="text-center">
                        <Link to="/" className="text-muted">Volver al inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClientLogin
