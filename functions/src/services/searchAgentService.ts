import {Listing} from "../types/searchResult.types.js";
import {SearchQuery} from "../../../shared-types/index.types.js";
import {getMessaging} from "firebase-admin/messaging";

export const getAttributeValue = (listing: Listing, attributeName: string): string | undefined => {
    const attribute = listing.attributes?.attribute.find(attr => attr.name === attributeName);
    return attribute?.values[0];
}

export const normalizeString = (str: string): string => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export const doesListingMatchQuery = (listing: Listing, query: SearchQuery): boolean => {
    // Check category
    const listingCategories: string = getAttributeValue(listing, "categorytreeids") || "";
    if(!listingCategories.includes(query.category.toString())) {
        return false;
    }

    // Check state
    const listingState = getAttributeValue(listing, "STATE") || "";
    if(query.state && normalizeString(listingState) !== normalizeString(query.state)) {
        return false;
    }

    // Check price
    const listingPrice = parseFloat(getAttributeValue(listing, "PRICE") || "0");
    if((query.minPrice || 0) > listingPrice || (query.maxPrice || Number.MAX_SAFE_INTEGER) < listingPrice) {
        return false;
    }

    // Check keyword
    if(query.keyword) {
        const normalizedKeyword = normalizeString(query.keyword);
        const normalizedDescription = normalizeString(listing.description);
        const normalizedBody = normalizeString(getAttributeValue(listing, "BODY_DYN") || "");
        if(!normalizedDescription.includes(normalizedKeyword) && !normalizedBody.includes(normalizedKeyword)) {
            return false;
        }
    }

    return true;
};

export const sendMatchNotification = async (fcmToken: string, queryNames: string[]) => {
    const message = {
        token: fcmToken,
        notification: {
            title: 'Neuer MussHaben Treffer!',
            body: `Es gibt neue Treffer für deine Such-Agenten: ${queryNames.join(', ')}. Schau gleich nach!`
        },
        data: {
            // The data payload is invisible to the user but crucial for your app.
            // Your React frontend can read this when they click the notification
            // to automatically open the specific Willhaben URL or route to a page.
            //url: matchUrl,
            //type: 'NEW_MATCH'
        },
        // Optional: Android/iOS specific configurations (like grouping notifications)
        android: {
            notification: {
                channelId: 'default', // Highly recommended for Android 8.0+
            }
        }
    };

    const response = await getMessaging().send(message);
    console.log('Successfully sent message:', response);
};