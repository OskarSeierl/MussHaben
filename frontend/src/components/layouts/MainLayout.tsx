import {
    Alert,
    Box,
    Container,
    Paper,
    useMediaQuery,
    useTheme
} from "@mui/material";
import React from 'react';
import {Link, Outlet} from "react-router-dom";
import {Navbar} from "../navigation/Navbar.tsx";
import {BottomNavbar} from "../navigation/BottomNavbar.tsx";
import {Footer} from "../Footer.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

export const MainLayout: React.FC = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    const {userData} = useAuth();

    return (
        <Container sx={{p: 0, mt: [0, 3]}}>
            <Navbar showButtons={isDesktop}/>

            {
                !userData?.isPremium && (
                    <Alert severity="info" sx={{mt: [1, 3]}}>
                        MussHaben ist ein reines Hobbyprojekt und ist nicht für kommerziellen Nutzen gebaut.
                        Aufgrunddessen:
                        <ul>
                            <li>ist die Anzahl der Such-Agenten pro Nutzer auf 1 begrenzt</li>
                            <li>wird eine ungenaue Abfragetechnik verwendet (siehe <Link to="/help">Hilfe</Link>)</li>
                        </ul>
                    </Alert>
                )
            }

            <Paper sx={{p: [2, 4], mt: [1, 3]}}>
                <Outlet/>
            </Paper>

            <Box sx={{mt: 3}}>
                <Footer/>
            </Box>

            {!isDesktop && (
                <BottomNavbar/>
            )}
        </Container>

    );
};

