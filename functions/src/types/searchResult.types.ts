export interface ListingAttribute {
    name: string;
    values: string[];
}

interface ListingAdvertImage {
    id: number;
    thumbnailImageUrl: string;
}

interface ListingContextLink {
    id: string;
    uri: string;
}

export interface Listing {
    id: string;
    attributes?: {
        attribute: ListingAttribute[];
    };
    description: string;
    advertImageList: {
        advertImage: ListingAdvertImage[];
    }
    contextLinkList: {
        contextLink: ListingContextLink[]
    }
}

export interface WillhabenSearchResult {
    props: {
        pageProps: {
            searchResult: {
                advertSummaryList: {
                    advertSummary: Listing[];
                };
            };
        };
    };
}