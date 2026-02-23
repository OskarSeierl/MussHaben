import React from 'react';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Divider, Skeleton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import type {SavedSearchQuery} from "../../types/query.types.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import EuroIcon from '@mui/icons-material/Euro';
import {useUserQueries} from "../../hooks/useUserQueries.ts";
import {useInfo} from "../../hooks/useInfo.ts";
import {Link} from 'react-router-dom';
import {useCategories} from "../../hooks/useCategories.ts";

interface Props {
    data: SavedSearchQuery;
}

export const SingleSearchAgent: React.FC<Props> = ({data}) => {
    const {deleteQuery} = useUserQueries();
    const {showError, showSuccess} = useInfo();
    const {categoriesObject, loading} = useCategories();

    const handleAgentDelete = async () => {
        try {
            await deleteQuery(data.id);
            showSuccess('Such-Agent erfolgreich erstellt!');
        } catch (error) {
            showError((error as Error)?.message || 'Unbekannter Fehler beim Erstellen des Such-Agenten.');
        }
    };

    const categoryElement = loading
        ? <Skeleton variant="text" width={200} />
        : <Typography>{categoriesObject[data.category].name}</Typography>;

    const minPriceLabel = data.minPrice ?? '__';
    const maxPriceLabel = data.maxPrice ?? '__';

    const stateLabel = data.state ? data.state : 'Alle Bundesländer';

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`${data.id}-content`}
                id={`${data.id}-header`}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    rowGap={2}
                    sx={{width: "100%"}}
                >
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <CategoryIcon color="action" fontSize="small"/>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Kategorie:
                        </Typography>
                        {categoryElement}
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={1}>
                        <Chip
                            size="small"
                            variant="outlined"
                            color="primary"
                            icon={<SearchIcon/>}
                            label={data.keyword ? `Keyword: ${data.keyword}` : 'Kein Keyword'}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            icon={<EuroIcon/>}
                            label={`Preis: ${minPriceLabel}€ - ${maxPriceLabel}€`}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            icon={<PublicIcon/>}
                            label={stateLabel}
                        />
                    </Stack>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={2}>
                    <Divider/>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Such-Agent Details
                        </Typography>
                    </Box>
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={1} flexWrap="wrap">
                        <Tooltip title="Kategorie">
                            <Chip size="small" icon={<CategoryIcon/>} label={categoryElement}/>
                        </Tooltip>
                        <Tooltip title="Keyword">
                            <Chip
                                size="small"
                                color="primary"
                                icon={<SearchIcon/>}
                                label={data.keyword ? data.keyword : 'Kein Keyword'}
                            />
                        </Tooltip>
                        <Tooltip title="Preis-Spanne">
                            <Chip
                                size="small"
                                icon={<EuroIcon/>}
                                label={`${minPriceLabel}€ - ${maxPriceLabel}€`}
                            />
                        </Tooltip>
                        <Tooltip title="Ort">
                            <Chip
                                size="small"
                                icon={<PublicIcon/>}
                                label={stateLabel}
                            />
                        </Tooltip>
                    </Stack>
                </Stack>
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
