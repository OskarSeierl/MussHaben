import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

import {useAuth} from "../../hooks/useAuth.ts";

export const ProtectedRoute: React.FC = () => {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
};

