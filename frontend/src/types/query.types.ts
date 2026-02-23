export enum State {
    WIEN = "WIEN",
    NIEDEROESTERREICH = "NIEDEROESTERREICH",
    OBEROESTERREICH = "OBEROESTERREICH",
    STEIERMARK = "STEIERMARK",
    KAERNTEN = "KAERNTEN",
    SALZBURG = "SALZBURG",
    TIROL = "TIROL",
    VORARLBERG = "VORARLBERG",
    BURGENLAND = "BURGENLAND",
}

export interface SavedSearchQuery {
    id: string;
    category: number;
    keyword?: string;
    state?: string;
    minPrice?: number;
    maxPrice?: number;
    createdAt: number; // timestamp
}

export type NewQueryData = Omit<SavedSearchQuery, 'id' | 'createdAt'>;

export interface UserQueriesContextType {
    savedQueries: SavedSearchQuery[];
    getQueryByIdSafe: (queryId: string) => SavedSearchQuery;
    queriesLoading: boolean;
    addQuery: (queryData: NewQueryData) => Promise<void>;
    updateQuery: (queryId: string, updatedData: Partial<NewQueryData>) => Promise<void>;
    deleteQuery: (queryId: string) => Promise<void>;
}