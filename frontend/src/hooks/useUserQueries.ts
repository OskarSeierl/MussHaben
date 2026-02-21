import {useContext} from 'react';
import {UserQueriesContext} from "../context/UserQueriesContext.ts";

export const useUserQueries = () => {
    const context = useContext(UserQueriesContext);
    if (!context) {
        throw new Error('useUserQueries must be used within an UserQueriesProvider');
    }
    return context;
};