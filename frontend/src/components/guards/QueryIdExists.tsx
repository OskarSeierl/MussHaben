import React, {useMemo} from 'react';
import {Navigate, Outlet, useParams} from 'react-router-dom';
import {useUserQueries} from "../../hooks/useUserQueries.ts";

export const QueryIdExists: React.FC = () => {
    const { searchAgentId } = useParams();
    const {savedQueries} = useUserQueries();

    const query = useMemo(() => savedQueries.find(q => q.id === searchAgentId), [savedQueries, searchAgentId]);

    if (!query) {
        return <Navigate to="/" replace/>;
    }

    return <Outlet/>;
};

