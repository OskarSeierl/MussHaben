/**
 * Interface for a Willhaben category
 */
export interface Category {
  url: string;
  id: number;
  name: string;
}

/**
 * Response type from getCategories function
 */
export interface GetCategoriesResponse {
  success: boolean;
  categories: Category[];
  count: number;
}

export interface CategoryOption {
  label: string;
  id: number;
}