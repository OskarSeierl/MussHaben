import React, {useEffect, useState} from "react";
import {onAuthStateChanged, type User} from "firebase/auth";
import {auth, db} from "../config/firebase.ts";
import { AuthContext } from "./AuthContext.ts";
import {doc, getDoc} from "firebase/firestore";
import type {UserData} from "../types/user.types.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const docSnap = await getDoc(doc(db, "users", currentUser.uid));
                if (docSnap.exists()) {
                    setUserData(docSnap.data() as UserData);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};