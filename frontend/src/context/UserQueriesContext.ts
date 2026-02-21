import {createContext} from "react";
import type {UserQueriesContextType} from "../types/query.types.ts";

export const UserQueriesContext = createContext<UserQueriesContextType | undefined>(undefined);