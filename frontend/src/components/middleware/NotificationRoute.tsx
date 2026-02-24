import React, {useEffect, useRef} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {getNotificationToken, requiresFirestoreSync} from "../../utils/notificationUtils.ts";
import {useAuth} from "../../hooks/useAuth.ts";
import {doc, setDoc } from "firebase/firestore";
import {db, messaging} from "../../config/firebase.ts";
import {onMessage} from "firebase/messaging";

export const NotificationRoute: React.FC = () => {
    const {user} = useAuth();
    const hasRequestedToken = useRef(false);
    const navigate = useNavigate();

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

    // Handle foreground notifications (when app is open)
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);

            const notificationTitle = payload.notification?.title || 'Neue Benachrichtigung';
            const notificationBody = payload.notification?.body || '';
            const targetUrl = payload.data?.url || '/search-agents';

            // Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification(notificationTitle, {
                    body: notificationBody,
                    icon: '/icons/icon-192.png',
                    badge: '/icons/icon-192.png',
                    tag: 'search-agent-matches', // Groups notifications
                    requireInteraction: false,
                });

                // Handle notification click
                notification.onclick = () => {
                    notification.close();
                    window.focus();
                    navigate(targetUrl);
                };
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    return <Outlet/>;
};

