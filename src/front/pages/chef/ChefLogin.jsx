import { Link } from "react-router-dom"
import { useChef } from "../../hooks/useChef"
import { useState } from "react"

const ChefLogin = () => {

    const { chefLogin } = useChef()
    const [chefLoginData, setChefLoginData] = useState({ email: "", password: "" })

    return (
        <div
            className="auth-page"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1600&q=80')",
            }}
        >
            <div className="auth-card">
                <div className="auth-form-panel">
                    <p className="brand">The Knife 🔪</p>
                    <p className="subtitle">Inicia sesión como Chef</p>

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

                    <div className="mb-2">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input
                            className="form-control"
                            onChange={(e) => setChefLoginData({ ...chefLoginData, password: e.target.value })}
                            value={chefLoginData.password}
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

                    <button className="btn btn-cocin w-100 mb-3" onClick={() => chefLogin(chefLoginData)}>
                        Iniciar sesión
                    </button>

                    <div className="text-center mb-2">
                        <span>¿No tienes cuenta? </span>
                        <Link to="/chef_register" className="auth-switch-link">Regístrate</Link>
                    </div>

                    <div className="text-center">
                        <Link to="/" className="text-muted">Volver al inicio</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChefLogin
