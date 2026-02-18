import {BottomNavigation, BottomNavigationAction, Box} from "@mui/material";
import React from 'react';
import { pages } from "../../config/pages.ts";

interface Props {
    activeButtonIndex: number;
    onClick: (index: number) => void;
}

export const BottomNavbar: React.FC<Props> = ({activeButtonIndex, onClick}) => {
    return (
        <Box sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
        }}>
            <BottomNavigation
                showLabels
                value={activeButtonIndex}
                onChange={(_event, newValue) => {
                    onClick(newValue);
                }}
            >
                {pages.map((page) => (
                    <BottomNavigationAction key={page.name} label={page.name} icon={<page.icon/>}/>
                ))}
            </BottomNavigation>
        </Box>
    );
};

