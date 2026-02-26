import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    writeBatch,
    increment
} from "firebase/firestore";
import type {NewQueryData} from "../types/query.types.ts";
import {UserQueriesContext} from "./UserQueriesContext.ts";
import React, {useEffect, useState} from "react";
import {db} from "../config/firebase.ts";
import {useAuth} from "../hooks/useAuth.ts";
import {Outlet} from "react-router-dom";
import type {SearchQuery} from "../../../shared-types/index.types.ts";

const getUserQueriesRef = (userId: string) => collection(db, 'users', userId, 'queries');
const getUserQueryRef = (userId: string, queryId: string) => doc(db, 'users', userId, 'queries', queryId);

export const UserQueriesProvider: React.FC = () => {
    const {user} = useAuth();

    const [savedQueries, setSavedQueries] = useState<SearchQuery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) throw new Error("Must be logged in to fetch queries.");

        const q = query(getUserQueriesRef(user.uid), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const results = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as SearchQuery[];

                setSavedQueries(results);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching saved queries:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    const addQuery = async (queryData: NewQueryData) => {
        if (!user?.uid) throw new Error("Must be logged in to save a search.");

        const batch = writeBatch(db);

        // Create a new document reference for the query
        const queryRef = doc(collection(db, 'users', user.uid, 'queries'));

        // Add query to batch
        batch.set(queryRef, {...queryData, createdAt: serverTimestamp()});

        // Update queryCount in user document
        const userRef = doc(db, 'users', user.uid);
        batch.update(userRef, {
            queryCount: increment(1)
        });

        // Commit the batch
        await batch.commit();
    };

    const updateQuery = async (queryId: string, updatedData: Partial<NewQueryData>) => {
        if (!user?.uid) throw new Error("Must be logged in to update a search.");
        await updateDoc(getUserQueryRef(user.uid, queryId), updatedData);
    };

    const deleteQuery = async (queryId: string) => {
        if (!user?.uid) throw new Error("Must be logged in to delete a search.");

        const batch = writeBatch(db);

        // Delete the query document
        const queryRef = getUserQueryRef(user.uid, queryId);
        batch.delete(queryRef);

        // Decrement queryCount in user document
        const userRef = doc(db, 'users', user.uid);
        batch.update(userRef, {
            queryCount: increment(-1)
        });

        // Commit the batch
        await batch.commit();
    };

    const getQueryByIdSafe = (queryId: string) => {
        const result = savedQueries.find(q => q.id === queryId);
        if (!result) {
            throw new Error(`Query with ID ${queryId} not found.`);
        }
        return result;
    }

    return (
        <UserQueriesContext.Provider value={{
            savedQueries,
            getQueryByIdSafe,
            queriesLoading: loading,
            addQuery,
            updateQuery,
            deleteQuery
        }}>
            <Outlet/>
        </UserQueriesContext.Provider>
    );
};