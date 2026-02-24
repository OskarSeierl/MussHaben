import React, {useState} from 'react';
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import EuroIcon from '@mui/icons-material/Euro';
import InboxIcon from '@mui/icons-material/Inbox';
import {Link} from 'react-router-dom';
import {collection, getDocs, orderBy, query} from 'firebase/firestore';
import {db} from '../../config/firebase.ts';

import {useUserQueries} from "../../hooks/useUserQueries.ts";
import {useInfo} from "../../hooks/useInfo.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {useCategories} from "../../hooks/useCategories.ts";
import type {Match, SearchQuery} from "../../../../shared-types/index.types.ts";
import {MatchCard} from "./MatchCard.tsx";
import {Timestamp} from 'firebase/firestore';

interface Props {
    data: SearchQuery;
}

export const SingleSearchAgent: React.FC<Props> = ({data}) => {
    const {deleteQuery} = useUserQueries();
    const {showError, showSuccess} = useInfo();
    const {user} = useAuth();
    const {categoriesObject, loading: categoriesLoading} = useCategories();

    const [matches, setMatches] = useState<Match<Timestamp>[] | undefined>(undefined);
    const [matchesLoading, setMatchesLoading] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const handleAccordionChange = async (_event: React.SyntheticEvent, expanded: boolean) => {
        setIsExpanded(expanded);

        if (expanded && matches === undefined && user) {
            setMatchesLoading(true);
            try {
                const matchesRef = collection(db, `users/${user.uid}/queries/${data.id}/matches`);
                const matchesQuery = query(matchesRef, orderBy('timestamp', 'desc'));
                const matchesSnapshot = await getDocs(matchesQuery);
                const loadedMatches = matchesSnapshot.docs.map(doc => doc.data() as Match<Timestamp>);
                setMatches(loadedMatches);
            } catch (error) {
                console.error('Error loading matches:', error);
                showError('Fehler beim Laden der Matches.');
            } finally {
                setMatchesLoading(false);
            }
        }
    };

    const handleAgentDelete = async () => {
        try {
            await deleteQuery(data.id);
            showSuccess('Such-Agent erfolgreich gelöscht!');
        } catch (error) {
            showError((error as Error)?.message || 'Fehler beim Löschen.');
        }
    };

    // Helper variables for cleaner JSX
    const categoryLabel = categoriesObject[data.category]?.name || 'Unbekannt';
    const minPriceLabel = data.minPrice ?? '--';
    const maxPriceLabel = data.maxPrice ?? '--';
    const stateLabel = data.state || 'Alle Bundesländer';

    return (
        <Accordion expanded={isExpanded} onChange={handleAccordionChange}>
            <AccordionSummary>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                    sx={{width: '100%'}}
                >
                    <Typography>"{data.name}"</Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                        {categoriesLoading ? (
                            <Skeleton width={150} height={19.5} variant="rounded" />
                        ) : (
                            <Chip
                                size="small"
                                variant="outlined"
                                icon={<CategoryIcon/>}
                                label={categoryLabel}
                            />
                        )}
                        <Chip
                            size="small"
                            variant="outlined"
                            color={data.keyword ? "primary" : "default"}
                            icon={<SearchIcon/>}
                            label={data.keyword || 'Kein Keyword'}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            icon={<EuroIcon/>}
                            label={`${minPriceLabel} - ${maxPriceLabel}`}
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
                <Stack spacing={3}>
                    <Divider/>

                    {/* Results Section */}
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Gefundene Matches ({matches?.length || 0})
                        </Typography>

                        {matchesLoading ? (
                            <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
                                <CircularProgress/>
                            </Box>
                        ) : matches?.length === 0 ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    py: 6,
                                    bgcolor: 'action.hover',
                                    borderRadius: 2,
                                    textAlign: 'center',
                                }}
                            >
                                <InboxIcon sx={{fontSize: 60, color: 'text.secondary', mb: 2}}/>
                                <Typography variant="h6" color="text.secondary">
                                    Keine Matches gefunden
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sobald neue Angebote verfügbar sind, werden sie hier angezeigt.
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    maxHeight: 500,
                                    overflowY: 'auto',
                                }}
                            >
                                <Stack spacing={2}>
                                    {matches?.map((match) => (
                                        <MatchCard key={match.link} match={match}/>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </AccordionDetails>

            <AccordionActions>
                <Button
                    component={Link}
                    to={`/search-agents/${data.id}/edit`}
                    variant="outlined"
                    startIcon={<EditIcon/>}
                >
                    Bearbeiten
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