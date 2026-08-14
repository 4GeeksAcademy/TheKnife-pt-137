import React from "react";

const LoadingComponent = () => {
    return (
        <div className="d-flex justify-content-center align-items-center py-5">
            <div className="position-relative" style={{ width: "4rem", height: "4rem" }}>
                <div
                    className="spinner-border text-primary position-absolute top-0 start-0"
                    style={{ width: "4rem", height: "4rem" }}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div
                    className="spinner-border text-danger position-absolute top-50 start-50 translate-middle"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                    role="status"
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingComponent;
