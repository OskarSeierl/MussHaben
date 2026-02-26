import {createContext} from 'react';
import type {AuthContextType} from "../types/user.types.ts";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

