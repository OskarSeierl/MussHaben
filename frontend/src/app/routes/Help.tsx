import React from 'react';
import {Box, Stack, Typography} from "@mui/material";
import BulkHelpImage from "../../assets/help/bulk.png";
import SingleHelpImage from "../../assets/help/single.png";

const Help: React.FC = () => {
    return (
        <Stack spacing={2}>
            <Typography variant="h4">Hilfe</Typography>
            <Typography>
                Dich interessiert wie MussHaben funktioniert und warum die SuchAgenten nicht immer alle neuen Anzeigen finden?
                Hier findest du eine kurze Erklärung zu den Methoden, die MussHaben verwendet, um die Anzeigen zu durchsuchen.
            </Typography>
            <Typography variant="h5">Methoden</Typography>
            <Typography variant="h6">
                Gebündelte Anfrage
                <Typography variant="caption"> (Verwendete Methode)</Typography>
            </Typography>
            <Box sx={{maxWidth: 600}}>
                <img style={{width: "100%"}} alt="Gebündelte Anfragen Architektur" src={BulkHelpImage} />
            </Box>
            <Typography>
                MussHaben sendet eine Anfrage um alle neuesten Anzeigen seid der letzten Aktualisierung zu bekommen.
                Diese Methode sendet somit nur eine Anfrage für alle SuchAgenten und ist damit sehr effizient.
                Aufgrund des Empfehlungs-Algorithmus von Willhaben ist es so nur schwer möglich alle neuen Anzeigen lückenlos zu bekommen da die Anfragen nicht determinitisch sind.
                Somit kann es vorkommen, dass MussHaben manche neuen Anzeigen nicht findet, wenn diese nicht in den ersten Ergebnissen der Suche auftauchen.
            </Typography>
            <Typography variant="h6">Einzelne Anfragen</Typography>
            <Box sx={{maxWidth: 600}}>
                <img style={{width: "100%"}} alt="Einzelne Anfragen Architektur" src={SingleHelpImage} />
            </Box>
            <Typography>
                Bei dieser Methode sendet MussHaben für jeden SuchAgent eine eigene Anfrage, um die neuesten Anzeigen zu bekommen.
                Da bei dieser Methode eine eingeschränktere Anzahl von Anzeigen abgerufen wird, sind bei geringer Ergebniszahl die Suchabfragen determinitisch.
                Somit werden alle neuen Anzeigen gefunden, wenn diese in den ersten Ergebnissen der Suche auftauchen.
            </Typography>
        </Stack>
    );
};

export default Help;

