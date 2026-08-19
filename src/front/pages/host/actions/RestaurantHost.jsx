import React, { useEffect, useState } from "react";
import useGlobalReducer from "../../../hooks/useGlobalReducer";
import { Link, useParams } from "react-router-dom";
import { useHost } from "../../../hooks/useHost";
import LoadingComponent from "../../../components/LoadingComponent";

const RestaurantHost = () => {

    const { getRestaurantHost } = useHost();
    const { store } = useGlobalReducer();
    const { restaurant_id } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getRestaurantHost(restaurant_id).finally(() => setLoading(false))
    }, []);

    if (loading) return <LoadingComponent />

    const host = store.restaurantHost
    const modalId = host ? `host-info-${host.id}` : null

    return (
        <div className="waiter_page">
            <div className="chef-page-header">
                <h1 className="chef-page-title">Host</h1>
                {!host && (
                    <Link to={`/restaurants/${restaurant_id}/register_host`} className="btn btn-primary">Registrar host</Link>
                )}
            </div>
            {host ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <div className="col">
                        <div className="waiter-card card h-100">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    {host.img_url ? (
                                        <img src={host.img_url} className="waiter-avatar" alt={host.name} />
                                    ) : (
                                        <div className="waiter-avatar">{host.name.charAt(0).toUpperCase()}</div>
                                    )}
                                    <div>
                                        <h5 className="waiter-name mb-1">{host.name}</h5>
                                        <span className="waiter-role">Host</span>
                                        <div className="waiter-divider">
                                            <span className="waiter-divider-line"></span>
                                            <span className="waiter-bowtie"></span>
                                            <span className="waiter-divider-line"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="waiter-email">
                                    <i className="fa-regular fa-envelope"></i>
                                    <span>{host.email}</span>
                                </div>
                                <hr className="waiter-hr" />
                                <button
                                    type="button"
                                    className="btn btn-outline-success btn-sm"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${modalId}`}
                                >
                                    <i className="fa-solid fa-circle-info me-1"></i>Ver información
                                </button>
                            </div>
                        </div>

                        <div className="modal fade" id={modalId} tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{host.name}</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                                    </div>
                                    <div className="modal-body">
                                        {host.img_url ? (
                                            <img src={host.img_url} className="profile-modal-photo" alt={host.name} />
                                        ) : (
                                            <div className="profile-modal-photo-placeholder">{host.name.charAt(0).toUpperCase()}</div>
                                        )}
                                        <p className="mb-2"><strong>Rol:</strong> Host</p>
                                        <p className="mb-0"><strong>Email:</strong> {host.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <p className="text-muted text-center py-4 mb-0">Todavía no hay un host registrado.</p>
                </div>
            )}
        </div>
    )
}

export default RestaurantHost;
