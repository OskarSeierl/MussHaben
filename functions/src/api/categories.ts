import {HttpsError, onCall} from "firebase-functions/v2/https";
import {fetchWillhabenCategories} from "../services/willhabenService.js";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {getCachedCategories, cacheCategories} from "../services/categoryService.js";

/**
 * Scheduled function to update Willhaben categories in Firestore
 * Runs on the 1st of every month at midnight
 */
export const updateWillhabenCategories = onSchedule("0 0 1 * *", async () => {
  try {
    await cacheCategories(await fetchWillhabenCategories());
  } catch (error) {
    console.error("Failed to update categories:", error);
    throw error;
  }
});

/**
 * Callable function to fetch Willhaben categories from
 * Can be called from the frontend using Firebase Functions client SDK
 */
export const getCategories = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
        "unauthenticated",
        "You must be logged in to fetch categories."
    );
  }

  try {
    const cachedCategories = await getCachedCategories();
    if (cachedCategories) {
        return cachedCategories;
    }
    const fetchedCategories = await fetchWillhabenCategories();
    await cacheCategories(fetchedCategories);
    return fetchedCategories;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new HttpsError(
      "internal",
      "Failed to fetch categories",
      errorMessage,
    );
  }
});

