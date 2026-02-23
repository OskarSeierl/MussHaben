import {Listing} from "../types/searchResult.types.js";
import {SearchQuery} from "../../../shared-types/index.types.js";

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
}