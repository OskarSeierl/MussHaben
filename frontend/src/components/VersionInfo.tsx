import React from 'react';
import {Paper, Link, Typography} from "@mui/material";
import packageJson from '../../package.json';

export const VersionInfo: React.FC = () => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                bgcolor: 'grey.50',
                textAlign: 'center'
            }}
        >
            <Typography variant="body2" color="text.secondary">
                MussHaben
            </Typography>
            <Typography variant="caption" color="text.secondary">
                <Link href="https://github.com/OskarSeierl/MussHaben">https://github.com/OskarSeierl/MussHaben</Link> |
                Version {packageJson.version}
            </Typography>
        </Paper>
    );
};

export default VersionInfo;
