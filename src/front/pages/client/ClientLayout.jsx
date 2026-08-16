import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import useGlobalReducer from "../../hooks/useGlobalReducer"
import { useClient } from "../../hooks/useClient"
import ClientSidebar from "./ClientSidebar"

// Persistent shell for every client-account page: sidebar stays fixed while
// the central content (Outlet) swaps between the different client sections.
const ClientLayout = () => {

    const { store } = useGlobalReducer()
    const { rehydrateClient } = useClient()

    useEffect(() => {
        if (!store.loggedClient.client.id) {
            rehydrateClient()
        }
    }, [])

    return (
        <div className="client-shell d-flex flex-column flex-lg-row">
            <ClientSidebar />
            <main className="client-main flex-grow-1">
                <Outlet />
            </main>
        </div>
    )
}

export default ClientLayout
