import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useCook } from "../../hooks/useCook"
import CookSidebar from "./CookSidebar"

// Persistent shell for every cook-scoped page: sidebar stays fixed while the
// central content (Outlet) swaps between the different cook functionalities.
const CookLayout = () => {

    const { store } = useGlobalReducer()
    const { rehydrateCook } = useCook()

    useEffect(() => {
        if (!store.loggedCook.cook.id) {
            rehydrateCook()
        }
    }, [])

    return (
        <div className="cook-shell d-flex flex-column flex-lg-row">
            <CookSidebar />
            <main className="cook-main flex-grow-1">
                <Outlet />
            </main>
        </div>
    )
}

export default CookLayout
