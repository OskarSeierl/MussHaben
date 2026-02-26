import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

import {useAuth} from "../../hooks/useAuth.ts";
import {GeneralLoading} from "../GeneralLoading.tsx";

export const ProtectedRoute: React.FC = () => {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <GeneralLoading/>
        );
    }

    if (!user) {
        return <Navigate to="/welcome" replace/>;
    }

    return <Outlet/>;
};

