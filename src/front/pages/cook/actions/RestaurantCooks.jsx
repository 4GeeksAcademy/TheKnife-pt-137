import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useCook } from "../../../hooks/useCook";
import LoadingComponent from "../../../components/LoadingComponent";

const RestaurantCooks = () => {

    const { getRestaurantCooks, deleteRestaurantCook } = useCook();
    const { store } = useGlobalReducer();
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    async function handleDelete(restaurant_id, cook_id) {
        const confirmation = window.prompt("Are you sure you want to delete this user?\n Type 'DELETE' to confirm")
        if (confirmation != "DELETE") return
        deleteRestaurantCook(restaurant_id, cook_id)
    }

    useEffect(() => {
        setLoading(true)
        getRestaurantCooks(restaurant_id).finally(() => setLoading(false))
    }, []);

    if (loading) return <LoadingComponent />

    const cooksList = store.cooks.map((cook) => {
        const modalId = `cook-info-${cook.id}`
        return (
            <div className="col" key={cook.id}>
                <div className="waiter-card card h-100">
                    <div className="card-body d-flex flex-column">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            {cook.img_url ? (
                                <img src={cook.img_url} className="waiter-avatar" alt={cook.name} />
                            ) : (
                                <div className="waiter-avatar">{cook.name.charAt(0).toUpperCase()}</div>
                            )}
                            <div>
                                <h5 className="waiter-name mb-1">{cook.name}</h5>
                                <span className="waiter-role">Cocinero/a</span>
                                <div className="waiter-divider">
                                    <span className="waiter-divider-line"></span>
                                    <span className="waiter-bowtie"></span>
                                    <span className="waiter-divider-line"></span>
                                </div>
                            </div>
                        </div>
                        <div className="waiter-email">
                            <i className="fa-regular fa-envelope"></i>
                            <span>{cook.email}</span>
                        </div>
                        <hr className="waiter-hr" />
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-success btn-sm flex-fill"
                                data-bs-toggle="modal"
                                data-bs-target={`#${modalId}`}
                            >
                                <i className="fa-solid fa-circle-info me-1"></i>Ver información
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(restaurant_id, cook.id)}
                                className="btn btn-outline-danger btn-sm flex-fill"
                            >
                                <i className="fa-regular fa-trash-can me-1"></i>Eliminar cocinero
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{cook.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {cook.img_url ? (
                                    <img src={cook.img_url} className="profile-modal-photo" alt={cook.name} />
                                ) : (
                                    <div className="profile-modal-photo-placeholder">{cook.name.charAt(0).toUpperCase()}</div>
                                )}
                                <p className="mb-2"><strong>Rol:</strong> Cocinero/a</p>
                                <p className="mb-2"><strong>Email:</strong> {cook.email}</p>
                                <p className="mb-0"><strong>Restaurante:</strong> {cook.restaurant_name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="cook_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Cocineros</h1>
                <Link to={`/restaurants/${restaurant_id}/register_cook`} className="btn btn-primary">Registrar cocinero</Link>
            </div>
            {store.cooks.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {cooksList}
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">Todavía no hay cocineros registrados.</p>
                </div>
            )}
        </div>
    )
}

export default RestaurantCooks;
