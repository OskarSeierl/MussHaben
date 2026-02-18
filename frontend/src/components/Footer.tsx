import React from 'react';
import {Box, Grid, Link} from "@mui/material";

export const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{textAlign: "left"}}>
            <Grid container spacing={4} justifyContent="space-evenly">
                <Box>
                    <b>Über MussHaben</b>
                    <p>GitHub: <Link href="https://github.com/OskarSeierl/willhaben-advanced-search-agent">https://github.com/OskarSeierl/willhaben-advanced-search-agent</Link></p>
                </Box>
                <Box>
                    <b>Kontakt</b>
                    <p>
                        E-Mail: <Link href="mailto:oskar.seierl@aon.at">oskar.seierl@aon.at</Link>
                    </p>
                    <p>
                        LinkedIn: <Link href="https://www.linkedin.com/in/oskar-seierl/">https://www.linkedin.com/in/oskar-seierl/</Link>
                    </p>
                </Box>
            </Grid>
        </Box>
    );
};

