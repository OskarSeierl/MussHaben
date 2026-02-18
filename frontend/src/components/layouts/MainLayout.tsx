import {
    Box,
    Container,
    useMediaQuery,
    useTheme
} from "@mui/material";
import React from 'react';
import {Outlet} from "react-router-dom";
import {Navbar} from "../navigation/Navbar.tsx";
import {BottomNavbar} from "../navigation/BottomNavbar.tsx";
import {Footer} from "../Footer.tsx";

export const MainLayout: React.FC = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    const [activeIndex, setActiveIndex] = React.useState(0);

    return (
        <Container sx={{p: 0, mt: [0, 3]}}>
            <Navbar showButtons={isDesktop}/>

            <Box sx={{bgcolor: '#fff', p: 2}}>
                <Outlet/>
            </Box>

            <Footer/>

            {!isDesktop && (
                <BottomNavbar activeButtonIndex={activeIndex} onClick={setActiveIndex}/>
            )}
        </Container>

    );
};

