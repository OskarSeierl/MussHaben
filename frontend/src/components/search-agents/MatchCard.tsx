import type {Match} from "../../../../functions/src/shared/shared.types.ts";
import React from "react";
import {Card, CardActionArea, CardContent, CardMedia, Chip, Stack, Typography} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EuroIcon from "@mui/icons-material/Euro";
import { Timestamp } from 'firebase/firestore';
import {millisToDateTime, millisToDuration} from "../../utils/timeUtils.ts";

interface Props {
    match: Match<Timestamp>;
}

export const MatchCard: React.FC<Props> = ({ match }) => {
    return (
        <Card>
            <CardActionArea
                onClick={() => window.open(match.link, '_blank', 'noopener,noreferrer')}
            >
                <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={2}>
                            <CardMedia
                                component="img"
                                sx={{ width: 120, height: 120, objectFit: 'cover' }}
                                image={match.imageUrl || 'https://via.placeholder.com/120?text=Kein+Bild'}
                                alt={match.description}
                            />
                            <Stack spacing={1}>
                                <Typography variant="body2">
                                    {match.description}
                                </Typography>
                                <Chip
                                    icon={<EuroIcon />}
                                    label={match.price}
                                    color="success"
                                    size="small"
                                    sx={{ alignSelf: 'flex-start' }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Hochgeladen: {  millisToDateTime(match.uploadedAt.toMillis()) }
                                    Gefunden nach { millisToDuration(match.foundAt.toMillis() - match.uploadedAt.toMillis()) } um {  millisToDateTime(match.foundAt.toMillis()) }
                                </Typography>
                            </Stack>
                        </Stack>
                        <OpenInNewIcon fontSize="small" color="action" />
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};