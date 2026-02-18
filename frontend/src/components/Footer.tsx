import React from 'react';
import {Box, Link, Typography} from "@mui/material";

export const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{textAlign: "center"}}>
            <Typography variant="body1"><em>„Möge die Macht mit dir sein.“</em> - MussHaben</Typography>
            <Typography variant="body2">gebaut von <Link href="https://oskarseierl.at">Oskar Seierl</Link></Typography>
        </Box>
    );
};

