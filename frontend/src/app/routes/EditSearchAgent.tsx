import React from 'react';
import { Stack, Typography } from "@mui/material";
import type { NewQueryData } from "../../types/query.types.ts";
import {useUserQueries} from "../../hooks/useUserQueries.ts";
import {useInfo} from "../../hooks/useInfo.ts";
import {useNavigate, useParams} from "react-router-dom";
import {SearchAgentForm} from "../../components/search-agents/SearchAgentForm.tsx";

const EditSearchAgent: React.FC = () => {
    const {updateQuery, getQueryByIdSafe} = useUserQueries();
    const {showError, showSuccess} = useInfo();
    const navigate = useNavigate();
    const { searchAgentId } = useParams();

    const handleSubmit = async (data: NewQueryData) => {
        try {
            await updateQuery(searchAgentId!, data);
            showSuccess('Such-Agent Änderungen erfolgreich gespeichert!');
            navigate(-1);

        } catch (error) {
            showError((error as Error)?.message || 'Unbekannter Fehler beim Erstellen des Such-Agenten.');
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Such-Agenten editieren</Typography>
            <SearchAgentForm buttonText="Speichern" defaultData={getQueryByIdSafe(searchAgentId!)} onSubmit={handleSubmit} />
        </Stack>
    );
};

export default EditSearchAgent;

