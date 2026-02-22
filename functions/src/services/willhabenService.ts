import fetch from "node-fetch";
import {Category} from "../types/category.types.js";

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

