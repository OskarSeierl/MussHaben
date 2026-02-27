import {DocumentReference, getDocFromCache, getDocFromServer,} from 'firebase/firestore';
import type {WithId} from "../../../shared-types/index.types.ts";

/**
 * Fetches a Firestore document using a local cache-first strategy with a TTL.
 */
export const fetchDocumentWithCache = async <T>(
    ref: DocumentReference<T>,
    maxAgeMs: number = 1000 * 60 * 60 * 24 * 7 // 7 days
): Promise<WithId<T> | null> => {

    const storageKey = `firestore_cache_${ref.path}`;
    const lastFetchStr = localStorage.getItem(storageKey);
    const lastFetchTime = lastFetchStr ? parseInt(lastFetchStr, 10) : 0;
    const isExpired = (Date.now() - lastFetchTime) > maxAgeMs;

    let snapshot;

    try {
        if (isExpired) {
            console.log(`[${storageKey}] Cache expired. Fetching from SERVER.`);
            snapshot = await getDocFromServer(ref);
            localStorage.setItem(storageKey, Date.now().toString());
        } else {
            console.log(`[${storageKey}] Cache valid. Fetching from CACHE.`);
            try {
                snapshot = await getDocFromCache(ref);
            } catch {
                console.log(`[${storageKey}] Cache empty physically. Fallback to SERVER.`);
                snapshot = await getDocFromServer(ref);
                localStorage.setItem(storageKey, Date.now().toString());
            }
        }

        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() } as WithId<T>;
        } else {
            return null; // Document doesn't exist
        }
    } catch (error) {
        console.error(`[${storageKey}] Fetch error:`, error);
        throw error; // Throw the error so the caller can catch and handle it
    }
};