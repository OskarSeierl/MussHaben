import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";
import type { GetCategoriesResponse } from "../types/category.types";

/**
 * Fetches all Willhaben categories from the backend
 * @returns Promise with the categories response
 */
export async function fetchCategories(): Promise<GetCategoriesResponse> {
  const getCategories = httpsCallable<void, GetCategoriesResponse>(
    functions,
    "getCategories"
  );

  const result = await getCategories();
  return result.data;
}

