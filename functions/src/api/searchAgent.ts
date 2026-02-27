import {onSchedule} from "firebase-functions/v2/scheduler";
import {getNewListings} from "../services/willhabenService.js";
import {Listing} from "../types/searchResult.types.js";
import {db} from "../index.js";
import {doesListingMatchQuery, getAttributeValue, sendMatchNotification} from "../services/searchAgentService.js";
import {Match, SearchQuery} from "../../../shared-types/index.types.js";
import {Timestamp} from "firebase-admin/firestore";
import {UserMatches} from "../types/match.types.js";
import {HttpsError} from "firebase-functions/https";
import {onDocumentDeleted} from "firebase-functions/firestore";

const SEARCH_AGENT_INTERVAL = 5; // minutes
const MAX_LISTINGS_AGE_TO_CHECK = 2 * SEARCH_AGENT_INTERVAL; // minutes, check listings from the last 2 intervals to avoid missing matches due to willhaben indeterminism of listings

export const updateFindings = onSchedule(`*/${SEARCH_AGENT_INTERVAL} * * * *`, async () => {
    try {
        const currentListing: Listing[] = await getNewListings(MAX_LISTINGS_AGE_TO_CHECK);
        console.log(`Search Agent Update started. Checking ${currentListing.length} new listings against user queries...`);
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
                            if(!(queryUserId in userMatches)) {
                                userMatches[queryUserId] = {};
                            }
                            if(!(queryData.name in userMatches[queryUserId])) {
                                userMatches[queryUserId][queryData.name] = [];
                            }
                            userMatches[queryUserId][queryData.name].push(listing.id);

                            batch.set(matchRef, {
                                description: listing.description,
                                imageUrl: listing.advertImageList.advertImage[0].thumbnailImageUrl,
                                price: parseFloat(getAttributeValue(listing, "PRICE") || "0"),
                                link: listing.contextLinkList.contextLink.find(link => link.id === "iadShareLink")?.uri || "",
                                timestamp: Timestamp.now(),
                                expireAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // expire after 1 day
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

export const deleteMatchesOnQueryDelete = onDocumentDeleted("users/{userId}/queries/{queryId}", async (event) => {
    const queryId = event.params.queryId;
    const deletedDocRef = event.data?.ref;

    if (!deletedDocRef) {
        console.error(`No document reference found in event for query ${queryId}`);
        return;
    }

    console.log(`User deleted query ${queryId}. Starting recursive cleanup...`);

    try {
        await db.recursiveDelete(deletedDocRef);
        console.log(`Successfully cleaned up orphaned data for query ${queryId}`);
    } catch (error) {
        console.error(`Failed to cleanup sub-collections for ${queryId}:`, error);
    }
});