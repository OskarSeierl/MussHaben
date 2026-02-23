import {onSchedule} from "firebase-functions/v2/scheduler";
import {getNewListings} from "../services/willhabenService.js";
import {Listing} from "../types/searchResult.types.js";
import {db} from "../index.js";
import {doesListingMatchQuery, getAttributeValue} from "../services/searchAgentService.js";
import {Match, SearchQuery} from "../../../shared-types/index.types.js";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export const updateFindings = onSchedule("every 5 minutes", async () => {
    const currentListing: Listing[] = await getNewListings();
    const querySnapshot = await db.collectionGroup('queries').get();

    const batch = db.batch();
    let newMatchesCount = 0;

    for(const doc of querySnapshot.docs) {
        for(const listing of currentListing) {
            const queryData = doc.data() as SearchQuery;
            const doesMatch = doesListingMatchQuery(listing, queryData);
            if(doesMatch) {
                const matchRef = db.doc(`users/${doc.ref.parent.parent?.id}/queries/${doc.id}/matches/${listing.id}`);
                const matchSnap = await matchRef.get();
                if(!matchSnap.exists) {
                    newMatchesCount++;
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

    if(newMatchesCount > 0) {
        await batch.commit();
    }
});