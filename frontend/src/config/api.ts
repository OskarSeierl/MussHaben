import {httpsCallable} from "firebase/functions";
import {functions} from "./firebase.ts";
import type {Category} from "../../../functions/src/shared/shared.types.ts";

export const getCategories = httpsCallable<void, Category[]>(functions, "getCategories");
export const getListings = httpsCallable<void, number>(functions, "getListings");