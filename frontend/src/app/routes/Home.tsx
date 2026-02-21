import React from 'react';
import {Stack, Typography} from "@mui/material";
import {useAuth} from "../../hooks/useAuth.ts";
import {AllSearchAgents} from "../../components/search-agents/AllSearchAgents.tsx";
import {AllSearchAgentsHeadline} from "../../components/search-agents/AllSearchAgentsHeadline.tsx";

const Home: React.FC = () => {
    const {user} = useAuth();

    return (
        <Stack spacing={2}>
            <Typography variant="h4" gutterBottom>Hallo {user?.displayName || user?.email || ""}</Typography>
            <AllSearchAgentsHeadline variant={"h5"} />
            <AllSearchAgents/>
        </Stack>
    );
};

export default Home;

