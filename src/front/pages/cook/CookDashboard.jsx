import { useEffect } from "react";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { useCook } from "../../hooks/useCook";


const CookDashBoard = () => {

    const { store } = useGlobalReducer()
    const navigate = useNavigate()
    const { cookLogout } = useCook()

    useEffect(() => {
        const cookLogged = !!localStorage.getItem("cooktoken")
        if (!cookLogged) {
            navigate("/cook_login")
        }
    }, [])

    const currentCook = store.loggedCook.cook

    return (
        <div className="cook_dashboard">
            <h1>Welcome back, {currentCook.name}</h1>
            <h2>Restaurant: {store.loggedCook.restaurant}</h2>
            <button onClick={cookLogout} className="btn btn-primary">Log out</button>
        </div>
    )
}

export default CookDashBoard;