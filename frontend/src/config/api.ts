import {httpsCallable} from "firebase/functions";
import type {Category} from "../types/category.types.ts";
import {functions} from "./firebase.ts";

export const getCategories = httpsCallable<void, Category[]>(functions, "getCategories");