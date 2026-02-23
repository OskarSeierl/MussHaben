import {db} from "../index.js";
import {Category} from "../../../shared-types/index.types.js";

export const cacheCategories = async (categories: Category[]) => {
    await db.doc('appData/willhabenMetadata').set({
        categories: categories,
        lastUpdated: new Date()
    });
};

export const getCachedCategories = async (): Promise<Category[] | null> => {
    const doc = await db.doc('appData/willhabenMetadata').get();
    if (doc.exists) {
        const data = doc.data();
        return data?.categories || null;
    }
    return null;
}