import {AppBar, Avatar, Box, Button, Container, IconButton, Toolbar, Tooltip} from "@mui/material";
import React from 'react';
import Logo from '../../assets/logo.png';
import { pages } from "../../config/pages.ts";

interface Props {
    showButtons: boolean;
}

export const Navbar: React.FC<Props> = ({showButtons}) => {
    return (
        <AppBar position="static">
            <Container>
                <Toolbar disableGutters>

                    {/* LOGO SECTION */}
                    <Box sx={{
                        mr: 2,
                        mt: 1,
                        maxWidth: 100,
                    }}>
                        <img
                            src={Logo}
                            style={{width: '100%'}}
                            alt={"MussHaben Logo"}
                        />
                    </Box>


                    {/* NAVIGATION LINKS SECTION */}
                    <Box sx={{flexGrow: 1, display: 'flex'}}>
                        {showButtons ? pages.map((page) => (
                            <Button
                                key={page.name}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                {page.name}
                            </Button>
                        )) : null}
                    </Box>

                    {/* USER SETTINGS SECTION */}
                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton sx={{p: 0}}>
                                <Avatar alt="Profilbild" src="/static/images/avatar/2.jpg"/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

