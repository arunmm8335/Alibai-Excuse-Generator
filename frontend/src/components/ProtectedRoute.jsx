import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    // If there is no token, redirect to the /login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If the user is logged in, render the child component (e.g., HomePage)
    return <Outlet />;
};

export default ProtectedRoute;