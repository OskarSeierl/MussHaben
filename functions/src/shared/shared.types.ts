export interface Category {
    url: string;
    id: number;
    name: string;
}

export enum State {
    WIEN = 900,
    NIEDEROESTERREICH = 3,
    OBEROESTERREICH = 4,
    STEIERMARK = 6,
    KAERNTEN = 2,
    SALZBURG = 5,
    TIROL = 7,
    VORARLBERG = 8,
    BURGENLAND = 1,
}

export interface SearchQuery {
    id: string;
    name: string;
    categories: number[];
    keyword?: string;
    state?: State;
    minPrice?: number;
    maxPrice?: number;
    specificRequest: boolean;
    createdAt: Date; // timestamp
}

export interface Match<T = Date> {
    description: string;
    imageUrl: string;
    price: number;
    link: string;
    timestamp: T;
    expireAt: T;
}

export type WithId<T> = T & { id: string };