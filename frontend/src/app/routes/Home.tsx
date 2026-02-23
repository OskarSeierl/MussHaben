import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import {useAuth} from "../../hooks/useAuth.ts";
import {AllSearchAgents} from "../../components/search-agents/AllSearchAgents.tsx";
import {AllSearchAgentsHeadline} from "../../components/search-agents/AllSearchAgentsHeadline.tsx";
import {getListings} from "../../config/api.ts";

const Home: React.FC = () => {
    const {user} = useAuth();

    return (
        <Stack spacing={2}>
            <Typography variant="h4" gutterBottom>Hallo {user?.displayName || user?.email || ""}</Typography>
            <AllSearchAgentsHeadline variant={"h5"} />
            <AllSearchAgents/>
            <Button onClick={async () => {
                const result = await getListings();
                console.log(result.data);
            }}>Click to get listings</Button>
        </Stack>
    );
};

export default Home;

