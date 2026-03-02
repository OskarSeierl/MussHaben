import {Listing} from "../types/searchResult.types.js";
import {SearchQuery} from "../shared/shared.types.js";
import {getMessaging} from "firebase-admin/messaging";
import {UserMatch} from "../types/match.types.js";
import {stateMapping} from "../shared/sharedUtils.js";

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
    if(!query.categories.some(category => listingCategories.includes(category.toString()))) {
        return false;
    }

    // Check state
    const listingState = getAttributeValue(listing, "STATE") || "";
    if(query.state && normalizeString(listingState) !== normalizeString(stateMapping[query.state])) {
        return false;
    }

    // Check price
    const listingPrice = parseFloat(getAttributeValue(listing, "PRICE") || "0");
    if((query.minPrice ?? 0) > listingPrice || (query.maxPrice ?? Number.MAX_SAFE_INTEGER) < listingPrice) {
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

export const sendMatchNotification = async (fcmToken: string, userMatch: UserMatch) => {
    const agentEntries = Object.entries(userMatch);
    const totalMatches = agentEntries.reduce((sum, [, matches]) => sum + matches.length, 0);

    // Create a detailed body for grouped notifications
    const resultString = agentEntries
        .map(([agentName, matches]) => `${agentName} (${matches.length})`)
        .join(', ');

    const message = {
        token: fcmToken,
        notification: {
            title: 'Neuer MussHaben Treffer!',
            body: `Es gibt neue Treffer für deine Such-Agenten: ${resultString}. Schau gleich nach!`
        },
        data: {
            // Add data to handle click action and grouping
            url: 'https://willhaben-advanced-agent.web.app/',
            agentCount: agentEntries.length.toString(),
            totalMatches: totalMatches.toString(),
            timestamp: Date.now().toString()
        },
        android: {
            notification: {
                channelId: 'default', // Highly recommended for Android 8.0+
                tag: 'search-agent-matches', // Groups notifications with the same tag
                clickAction: 'FLUTTER_NOTIFICATION_CLICK'
            }
        },
        webpush: {
            fcmOptions: {
                link: '/' // Opens this URL when notification is clicked
            },
            notification: {
                tag: 'search-agent-matches', // Groups notifications on web
                renotify: true, // Show notification even if one with same tag exists
                requireInteraction: false
            }
        }
    };

    const response = await getMessaging().send(message);
    console.log('Successfully sent message:', response);
};