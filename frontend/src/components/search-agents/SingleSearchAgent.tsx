import React from 'react';
import {Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Grid, Typography} from "@mui/material";
import type {SavedSearchQuery} from "../../types/query.types.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useUserQueries} from "../../hooks/useUserQueries.ts";
import {useInfo} from "../../hooks/useInfo.ts";
import { Link } from 'react-router-dom';

interface Props {
    data: SavedSearchQuery;
}

export const SingleSearchAgent: React.FC<Props> = ({data}) => {
    const {deleteQuery} = useUserQueries();
    const {showError, showSuccess} = useInfo();

    const handleAgentDelete = async () => {
        try {
            await deleteQuery(data.id);
            showSuccess('Such-Agent erfolgreich erstellt!');
        } catch (error) {
            showError((error as Error)?.message || 'Unbekannter Fehler beim Erstellen des Such-Agenten.');
        }
    };

    return (
        <Accordion>
            <AccordionSummary
                aria-controls={`${data.id}-content`}
                id={`${data.id}-header`}
            >
                <Grid container sx={{width: "100%"}}>
                    <Grid size="grow">
                        <Typography>Kategorie: {data.category}</Typography>
                    </Grid>
                    <Grid size="grow">
                        <Typography>Keyword: {data.keyword}</Typography>
                    </Grid>
                    <Grid size="grow">
                        <Typography>Preis-Spanne: {data.minPrice || "__"}€ - {data.maxPrice || "__"}€</Typography>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                TODO
            </AccordionDetails>
            <AccordionActions>
                <Button
                    component={Link}
                    to={`/search-agents/${data.id}/edit`}
                    variant="contained"
                    color="warning"
                    startIcon={<EditIcon/>}
                >
                    Editieren
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon/>}
                    onClick={handleAgentDelete}
                >
                    Löschen
                </Button>
            </AccordionActions>
        </Accordion>
    );
};

