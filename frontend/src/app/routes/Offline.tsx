import React from 'react';
import {Stack, Typography} from "@mui/material";
import VersionInfo from '../../components/VersionInfo';

const Offline: React.FC = () => {
    return (
        <Stack spacing={2}>
            <Typography variant="h5">MussHaben ist derzeit deaktiviert.</Typography>
            <VersionInfo/>
        </Stack>
    );
};

export default Offline;
