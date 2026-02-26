import React from 'react';
import {Box, CircularProgress, Fade, Stack, Typography} from "@mui/material";
import Logo from "../assets/logo.png";

export const GeneralLoading: React.FC = () => {
    return (
        <Fade in={true} timeout={1000}>
            <Box sx={{p: 4}}>
                <Stack spacing={3} alignItems="center">
                    <Box
                        sx={{
                            width: 200,
                            animation: 'pulse 2s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%, 100%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                },
                                '50%': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)',
                                },
                            },
                        }}
                    >
                        <img
                            style={{width: "100%"}}
                            src={Logo}
                            alt="MussHaben Logo"
                        />
                    </Box>
                    <CircularProgress/>
                    <Typography variant="h6">
                        Benutzer wird geladen...
                    </Typography>
                </Stack>
            </Box>
        </Fade>
    );
};

