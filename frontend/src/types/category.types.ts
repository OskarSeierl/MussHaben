import type {Category} from "../../../shared-types/index.types.ts";

export interface CategoryOption {
  label: string;
  id: number;
}

/**
 * Context for managing Willhaben categories
 */
export interface CategoriesContextType {
    categories: Category[];
    categoriesObject: Record<string, Category>;
    loading: boolean;
    error: Error | null;
}

export interface WillhabenData {
    categories: Category[];
}