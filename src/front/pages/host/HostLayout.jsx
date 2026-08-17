import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useHost } from "../../hooks/useHost"
import HostSidebar from "./HostSidebar"

// Persistent shell for every host-scoped page: sidebar stays fixed while the
// central content (Outlet) swaps between the different host functionalities.
const HostLayout = () => {

    const { store } = useGlobalReducer()
    const { rehydrateHost } = useHost()

    useEffect(() => {
        if (!store.loggedHost.host.id) {
            rehydrateHost()
        }
    }, [])

    return (
        <div className="host-shell d-flex flex-column flex-lg-row">
            <HostSidebar />
            <main className="host-main flex-grow-1">
                <Outlet />
            </main>
        </div>
    )
}

export default HostLayout
