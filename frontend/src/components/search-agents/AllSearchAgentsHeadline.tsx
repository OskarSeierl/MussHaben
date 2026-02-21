import React from 'react';
import {Fab, Stack, Typography, type TypographyVariant} from "@mui/material";
import {Link} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

interface Props {
    variant: TypographyVariant
}

export const AllSearchAgentsHeadline: React.FC<Props> = ({variant}) => {
    return (
        <Stack direction={{sm: 'column', md: 'row'}} justifyContent="space-between" width="100%">
            <Typography variant={variant}>
                Deine Such-Agenten
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Neuen Such-Agenten erstellen</Typography>
                <Fab component={Link} to="/search-agents/new" color="primary" aria-label="add" size="small">
                    <AddIcon/>
                </Fab>
            </Stack>
        </Stack>
    );
};

