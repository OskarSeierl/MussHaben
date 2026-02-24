export interface Category {
    url: string;
    id: number;
    name: string;
}

export enum State {
    WIEN = "Wien",
    NIEDEROESTERREICH = "Niederoesterreich",
    OBEROESTERREICH = "Oberoesterreich",
    STEIERMARK = "Steiermark",
    KAERNTEN = "Kaernten",
    SALZBURG = "Salzburg",
    TIROL = "Tirol",
    VORARLBERG = "Vorarlberg",
    BURGENLAND = "Burgenland",
}

export interface SearchQuery {
    id: string;
    name: string;
    category: number;
    keyword?: string;
    state?: State;
    minPrice?: number;
    maxPrice?: number;
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