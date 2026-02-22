import {useState, useEffect} from "react";
import type {Category} from "../types/category.types";
import {getCategories} from "../config/api.ts";

/**
 * Custom hook to fetch Willhaben categories
 * @returns Object containing categories, loading state, and error
 */
export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getCategories();
                setCategories(response.data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return {categories, loading, error};
}

