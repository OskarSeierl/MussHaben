import React from 'react';
import {Stack} from "@mui/material";
import {AllSearchAgents} from "../../components/search-agents/AllSearchAgents.tsx";
import {AllSearchAgentsHeadline} from "../../components/search-agents/AllSearchAgentsHeadline.tsx";

const SearchAgents: React.FC = () => {
    return (
        <Stack spacing={2}>
            <AllSearchAgentsHeadline variant={"h4"}/>
            <AllSearchAgents/>
        </Stack>
    );
};

export default SearchAgents;

