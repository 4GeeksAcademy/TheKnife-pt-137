

import { Link } from "react-router-dom"
import { useState } from "react"
import { useCook } from "../../hooks/useCook"

const CookLogin = () => {

    const { cookLogin } = useCook()
    const [cookLoginData, setCookLoginData] = useState({email: "", password: ""})

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
                    <p className="brand">The Knife <img src="/logobueno.png" alt="The Knife" className="brand-icon" /></p>
                    <p className="subtitle">Inicia sesión como Cocinero</p>

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

                    <div className="mb-2">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCookLoginData({ ...cookLoginData, password: e.target.value })}
                            value={cookLoginData.password}
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

                    <button className="btn btn-cocin w-100 mb-3" onClick={() => cookLogin(cookLoginData)}>Iniciar sesión</button>

                    <div className="text-center">
                        <Link to="/" className="text-muted">Volver al inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CookLogin
