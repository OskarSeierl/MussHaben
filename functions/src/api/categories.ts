import { onCall, HttpsError } from "firebase-functions/v2/https";
import { fetchWillhabenCategories } from "../services/willhabenService.js";

/**
 * Callable function to fetch Willhaben categories
 * Can be called from the frontend using Firebase Functions client SDK
 */
export const getCategories = onCall(async () => {
  try {
    const categories = await fetchWillhabenCategories();

    return {
      success: true,
      categories,
      count: categories.length,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new HttpsError(
      "internal",
      "Failed to fetch categories",
      errorMessage,
    );
  }
});

