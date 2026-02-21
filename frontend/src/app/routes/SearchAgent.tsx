import React, {useMemo} from 'react';
import {Stack, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {SingleSearchAgent} from "../../components/search-agents/SingleSearchAgent.tsx";
import {useUserQueries} from "../../hooks/useUserQueries.ts";

const SearchAgent: React.FC = () => {
    const { searchAgentId } = useParams();
    const {savedQueries} = useUserQueries();

    const query = useMemo(() => savedQueries.find(q => q.id === searchAgentId), [savedQueries, searchAgentId]);

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Such-Agent "{searchAgentId}"</Typography>
            <SingleSearchAgent data={query!} />
        </Stack>
    );
};

export default SearchAgent;

