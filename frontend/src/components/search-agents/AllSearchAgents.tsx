import React from 'react';
import {Box, Skeleton, Stack, Typography} from "@mui/material";
import {useUserQueries} from "../../hooks/useUserQueries.ts";
import {SingleSearchAgent} from "./SingleSearchAgent.tsx";

export const AllSearchAgents: React.FC = () => {
    const {savedQueries, queriesLoading} = useUserQueries()

    if(queriesLoading) {
        return (
            <Stack spacing={0.3}>
                <Skeleton variant="rectangular" height={48} />
                <Skeleton variant="rectangular" height={48} />
                <Skeleton variant="rectangular" height={48} />
                <Skeleton variant="rectangular" height={48} />
            </Stack>
        );
    }

    if(savedQueries.length === 0) {
        return (
            <Typography>
                <em>Du hast noch keine Such-Agenten erstellt. Klicke auf den Button oben, um deinen ersten Such-Agenten zu erstellen!</em>
            </Typography>
        );
    }

    return (
        <Box>
            {
                savedQueries.map((query) => (
                    <SingleSearchAgent key={query.id} data={query} />
                ))
            }
        </Box>
    );
};

