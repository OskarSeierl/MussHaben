import {onSchedule} from "firebase-functions/v2/scheduler";
import {getNewListings} from "../services/willhabenService.js";
import {Listing} from "../types/searchResult.types.js";
import {db} from "../index.js";
import {doesListingMatchQuery, getAttributeValue, sendMatchNotification} from "../services/searchAgentService.js";
import {Match, SearchQuery} from "../../../shared-types/index.types.js";
import {Timestamp} from "firebase-admin/firestore";
import {UserMatches} from "../types/match.types.js";
import {HttpsError} from "firebase-functions/https";

export const updateFindings = onSchedule("every 5 minutes", async () => {
    try {
        const currentListing: Listing[] = await getNewListings();
        const querySnapshot = await db.collectionGroup('queries').get();

        const batch = db.batch();
        const userMatches: UserMatches = {};

        for (const query of querySnapshot.docs) {
            for (const listing of currentListing) {
                const queryUserId = query.ref.parent.parent?.id;
                if (queryUserId) { // should be defined normally, but just to be safe
                    const queryData = query.data() as SearchQuery;
                    const doesMatch = doesListingMatchQuery(listing, queryData);

                    if (doesMatch) {
                        const matchRef = db.doc(`users/${queryUserId}/queries/${query.id}/matches/${listing.id}`);
                        const matchSnap = await matchRef.get();
                        if (!matchSnap.exists) {
                            userMatches[queryUserId] = [...(userMatches[queryUserId] || []), queryData.name];
                            batch.set(matchRef, {
                                description: listing.description,
                                imageUrl: listing.advertImageList.advertImage[0].thumbnailImageUrl,
                                price: parseFloat(getAttributeValue(listing, "PRICE") || "0").toFixed(2),
                                link: listing.contextLinkList.contextLink.find(link => link.id === "iadShareLink")?.uri || "",
                                timestamp: Timestamp.now(),
                                expireAt: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), // expire after 3 days
                            } as Match<Timestamp>);
                        }
                    }
                }
            }
        }

        if (Object.keys(userMatches).length > 0) {
            await batch.commit();
        }

        for (const userId in userMatches) {
            const userDoc = await db.doc(`users/${userId}`).get();
            const fcmToken = userDoc.data()?.fcmToken;
            if (fcmToken) {
                await sendMatchNotification(fcmToken, userMatches[userId]);
            }
        }

        console.log(`Search Agent Update completed. New matches found: ${JSON.stringify(userMatches)}`);
    } catch (error) {
        console.error("Error during Search Agent Update:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new HttpsError(
            "internal",
            "Failed to fetch categories",
            errorMessage,
        );
    }
});