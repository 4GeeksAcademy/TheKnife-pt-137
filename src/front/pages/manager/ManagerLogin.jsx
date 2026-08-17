import { Link } from "react-router-dom"
import { useManager } from "../../hooks/useManager"
import { useState } from "react"

const ManagerLogin = () => {

    const { managerLogin } = useManager()
    const [managerLoginData, setManagerLoginData] = useState({ email: "", password: "" })

    return (
        <div
            className="auth-page"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="auth-card">
                <div className="auth-form-panel">
                    <p className="brand">The Knife 🔪</p>
                    <p className="subtitle">Inicia sesión como Manager</p>

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

                    <div className="mb-2">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input
                            className="form-control"
                            onChange={(e) => setManagerLoginData({ ...managerLoginData, password: e.target.value })}
                            value={managerLoginData.password}
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

                    <button className="btn btn-cocin w-100 mb-3" onClick={() => managerLogin(managerLoginData)}>Iniciar sesión</button>

                    <div className="text-center">
                        <Link to="/" className="text-muted">Volver al inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerLogin
