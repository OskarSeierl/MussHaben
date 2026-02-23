import { setGlobalOptions } from "firebase-functions";
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

setGlobalOptions({ maxInstances: 10 });

// Export firebase instances
export const db = getFirestore();

// Export API endpoints
export { getCategories, updateWillhabenCategories } from "./api/categories.js";
export { getListings, updateFindings } from "./api/searchAgent.js";