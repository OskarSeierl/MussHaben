import {onCall} from "firebase-functions/https";
import {SearchQuery, State} from "../shared/shared.types.js";
import {getNewListingsFromAgent} from "../services/willhabenService.js";
import {Listing} from "../types/searchResult.types.js";
import {doesListingMatchQuery} from "../services/searchAgentService.js";

export const testListingMatching = onCall(async () => {
    const query: SearchQuery = {
        id: "test-query-id",
        name: "Plant Query",
        categories: [3724, 3729, 3728],
        keyword: undefined,
        state: State.WIEN,
        minPrice: 0,
        maxPrice: 0,
        specificRequest: true,
        createdAt: new Date(),
    }

    const listings: Listing[] = await getNewListingsFromAgent(query, 120);

    const matchResults = [];

    for(const listing of listings) {
        const isMatch = doesListingMatchQuery(listing, query);
        matchResults.push({
            "Description": listing.description,
            "Is Match": isMatch ? "✅ Yes" : "❌ No"
        });
    }

    console.table(matchResults);
});