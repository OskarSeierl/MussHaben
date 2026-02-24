import React, {useEffect, useRef} from 'react';
import {Outlet} from 'react-router-dom';
import {getNotificationToken, requiresFirestoreSync} from "../../utils/notificationUtils.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {doc, setDoc } from "firebase/firestore";
import {db} from "../../config/firebase.ts";

export const NotificationRoute: React.FC = () => {
    const {user} = useAuth();
    const hasRequestedToken = useRef(false);

    useEffect(() => {
        // Skip if we've already requested for this user or if no user is logged in
        if (!user || hasRequestedToken.current) {
            return;
        }

        const requestNotifications = async () => {
            try {
                const token = await getNotificationToken();
                if (token) {
                    console.log("Notification token obtained:", token);
                    if (requiresFirestoreSync(user.uid, token)) {
                        console.log("Saving notification token for user:", user.uid);
                        await setDoc(doc(db, 'users', user.uid), {fcmToken: token}, {merge: true});
                    }
                }

            } catch (error) {
                console.error("Error requesting notification token:", error);
            }
        };

        hasRequestedToken.current = true;
        requestNotifications();
    }, [user]);

    return <Outlet/>;
};

