import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useWaiter } from "../../hooks/useWaiter"
import WaiterSidebar from "./WaiterSidebar"

// Persistent shell for every waiter-scoped page: sidebar stays fixed while the
// central content (Outlet) swaps between the different waiter functionalities.
const WaiterLayout = () => {

    const { store } = useGlobalReducer()
    const { rehydrateWaiter } = useWaiter()

    useEffect(() => {
        if (!store.loggedWaiter.waiter.id) {
            rehydrateWaiter()
        }
    }, [])

    return (
        <div className="waiter-shell d-flex flex-column flex-lg-row">
            <WaiterSidebar />
            <main className="waiter-main flex-grow-1">
                <Outlet />
            </main>
        </div>
    )
}

export default WaiterLayout
