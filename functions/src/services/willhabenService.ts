import fetch from "node-fetch";
import {Listing, WillhabenSearchResult} from "../types/searchResult.types.js";
import {Category} from "../../../shared-types/index.types.js";

const CATEGORIES_SITEMAP_URL = "https://www.willhaben.at/sitemap/sitemapindex-marktplatz-kategorien.xml";

// URL format: https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/[category-name]-[category-id]
const WANTED_BASE_URL = "https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz/";

/**
 * Fetches the Willhaben categories sitemap and extracts all categories
 * @returns Promise with an array of categories
 */
export const fetchWillhabenCategories = async (): Promise<Category[]> => {
    const response = await fetch(CATEGORIES_SITEMAP_URL);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch sitemap: ${response.status} ${response.statusText}`,
        );
    }

    const xmlText = await response.text();
    return parseCategories(xmlText);
}

/**
 * Parses XML sitemap text and extracts categories
 * @param xmlText The raw XML text from the sitemap
 * @returns Array of categories with extracted information
 */
const parseCategories = (xmlText: string): Category[] => {
    const categories: Category[] = [];

    // Extract all URLs using regex
    const urlPattern = /<loc>(.*?)<\/loc>/g;
    let match;

    while ((match = urlPattern.exec(xmlText)) !== null) {
        const url = match[1];
        const category = parseCategoryFromUrl(url);
        if (category && !categories.some((c) => c.name === category.name)) {
            categories.push(category);
        }
    }

    return categories;
}

/**
 * Extracts category information from a Willhaben URL
 * @param url The URL to parse
 * @returns Category object or null if parsing fails
 */
const parseCategoryFromUrl = (url: string): Category | null => {
    const urlPattern = new RegExp(WANTED_BASE_URL + "(.+)-(\\d+)$");
    const urlMatch = url.match(urlPattern);

    if (!urlMatch) {
        return null;
    }

    const name = urlMatch[1];
    const id = parseInt(urlMatch[2]);

    return {url, id, name,};
}

export const getNewListings = async (): Promise<Listing[]> => {
    return getListings(WANTED_BASE_URL+ "?rows=1000"); // fetch maximum listings (currently 200)
};

/**
 * Fetches a Willhaben search results page and extracts the listings
 * @param url The URL of the search results page to fetch
 * @returns Promise with an array of cleaned listing objects
 * @author Christian Proschek (https://github.com/CP02A/willhaben)
 */
export const getListings = async (url: string): Promise<Listing[]> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch URL. HTTP Status: ${response.status}`);
    }

    const htmlString = await response.text();
    const scriptStartTag = '<script id="__NEXT_DATA__" type="application/json">';
    const startIndex = htmlString.indexOf(scriptStartTag);

    if (startIndex === -1) {
        throw new Error("Could not find Next.js data script tag in the HTML response.");
    }

    // Extract the JSON string out of the HTML
    const dataString = htmlString.substring(startIndex + scriptStartTag.length);
    const jsonString = dataString.substring(0, dataString.indexOf('</script>'));

    // Cast the parsed JSON to your specific Willhaben root interface
    const result = JSON.parse(jsonString) as WillhabenSearchResult;

    const rawAdverts = result?.props?.pageProps?.searchResult?.advertSummaryList?.advertSummary;

    if (!Array.isArray(rawAdverts)) {
        throw new Error("Unexpected JSON structure: Could not find advertSummary array.");
    }

    return rawAdverts.map(rawObj => ({
        id: rawObj.id,
        attributes: rawObj.attributes,
        description: rawObj.description,
        advertImageList: {
            advertImage: rawObj.advertImageList.advertImage.map(image => ({
                id: image.id,
                thumbnailImageUrl: image.thumbnailImageUrl,
            }))
        },
        contextLinkList: {
            contextLink: rawObj.contextLinkList.contextLink.map(link => ({
                id: link.id,
                uri: link.uri,
            }))
        },
    }));
};

