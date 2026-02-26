import React from 'react';
import {Fab, Stack, Typography, type TypographyVariant} from "@mui/material";
import {Link} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {useUserQueries} from "../../hooks/useUserQueries.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {MAX_SEARCH_AGENTS_WITHOUT_PREMIUM} from "../../config/maximumAgents.ts";

interface Props {
    variant: TypographyVariant
}

export const AllSearchAgentsHeadline: React.FC<Props> = ({variant}) => {
    const {savedQueries} = useUserQueries();
    const {userData} = useAuth();

    const canCreateNewAgent = userData?.isPremium || savedQueries.length < MAX_SEARCH_AGENTS_WITHOUT_PREMIUM;

    return (
        <Stack direction={{sm: 'column', md: 'row'}} justifyContent="space-between" width="100%">
            <Typography variant={variant}>
                Deine Such-Agenten
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>
                    { canCreateNewAgent ? "Neuen Such-Agenten erstellen" : <em>Maximal-Anzahl von Such-Agenten erreicht ({savedQueries.length}/{MAX_SEARCH_AGENTS_WITHOUT_PREMIUM})</em> }
                </Typography>
                <Fab component={Link} to="/search-agents/new" color="primary" aria-label="add" size="small" disabled={!canCreateNewAgent}>
                    <AddIcon/>
                </Fab>
            </Stack>
        </Stack>
    );
};
