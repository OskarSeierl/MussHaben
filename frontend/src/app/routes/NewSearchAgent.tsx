import React from 'react';
import { Stack, Typography } from "@mui/material";
import type { NewQueryData } from "../../types/query.types.ts";
import {useUserQueries} from "../../hooks/useUserQueries.ts";
import {useInfo} from "../../hooks/useInfo.ts";
import {useNavigate} from "react-router-dom";
import {SearchAgentForm} from "../../components/search-agents/SearchAgentForm.tsx";

const NewSearchAgent: React.FC = () => {
    const {addQuery} = useUserQueries();
    const {showError, showSuccess} = useInfo();
    const navigate = useNavigate();

    const handleSubmit = async (data: NewQueryData) => {
        try {
            await addQuery(data);
            showSuccess('Such-Agent erfolgreich erstellt!');
            navigate(-1);

        } catch (error) {
            showError((error as Error)?.message || 'Unbekannter Fehler beim Erstellen des Such-Agenten.');
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Such-Agenten erstellen</Typography>
            <SearchAgentForm buttonText="Erstellen" onSubmit={handleSubmit} />
        </Stack>
    );
};

export default NewSearchAgent;

