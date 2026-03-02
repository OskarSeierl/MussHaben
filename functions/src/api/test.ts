import {onCall} from "firebase-functions/https";
import {SearchQuery, State} from "../shared/shared.types.js";
import {getListings} from "../services/willhabenService.js";
import {Listing} from "../types/searchResult.types.js";
import {doesListingMatchQuery} from "../services/searchAgentService.js";

export const testListingMatching = onCall(async () => {
    const url: string = "https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/dekoration/zimmerpflanzen-5463?areaId=900&rows=30&PRICE_FROM=0&PRICE_TO=0";
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

    const listings: Listing[] = await getListings(url);

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