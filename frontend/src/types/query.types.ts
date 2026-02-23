import type {SearchQuery} from "../../../shared-types/index.types.ts";

export type NewQueryData = Omit<SearchQuery, 'id' | 'createdAt'>;

export interface UserQueriesContextType {
    savedQueries: SearchQuery[];
    getQueryByIdSafe: (queryId: string) => SearchQuery;
    queriesLoading: boolean;
    addQuery: (queryData: NewQueryData) => Promise<void>;
    updateQuery: (queryId: string, updatedData: Partial<NewQueryData>) => Promise<void>;
    deleteQuery: (queryId: string) => Promise<void>;
}