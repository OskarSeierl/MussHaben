import React, {useEffect, useState} from "react";
import type {CategoriesContextType, WillhabenData} from "../types/category.types";
import {getCategories} from "../config/api.ts";
import {CategoriesContext} from "./CategoriesContext.ts";
import { Outlet } from "react-router-dom";
import type {Category} from "../../../functions/src/shared/shared.types.ts";
import {doc, type DocumentReference} from "firebase/firestore";
import {db} from "../config/firebase.ts";
import {fetchDocumentWithCache} from "../utils/firestoreCacheUtils.ts";

/**
 * Provider component for managing Willhaben categories
 */
export const CategoriesProvider: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const categoriesObject = categories.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
    }, {} as Record<string, Category>);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const cachedCategories = await fetchDocumentWithCache<WillhabenData>(doc(db, "appData", "willhabenMetadata") as DocumentReference<WillhabenData>);
                if (cachedCategories) {
                    setCategories(cachedCategories.categories);
                } else {
                    const response = await getCategories();
                    setCategories(response.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const value: CategoriesContextType = {
        categories,
        categoriesObject,
        loading,
        error,
    };

    return (
        <CategoriesContext.Provider value={value}>
            <Outlet/>
        </CategoriesContext.Provider>
    );
}

