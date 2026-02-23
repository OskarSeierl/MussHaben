export interface UserMatch {
    [agentName: string]: string[]; // array of listing IDs
}

export interface UserMatches {
    [userId: string]: UserMatch; // array of agent names
}