importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
    apiKey: true,
    projectId: true,
    messagingSenderId: true,
    appId: true,
};

firebase.initializeApp(defaultConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image || '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'search-agent-matches', // Groups notifications with the same tag
        renotify: true, // Vibrate/sound even when replacing existing notification
        data: {
            url: payload.data?.url || '/',
            ...payload.data
        },
        requireInteraction: false, // Auto-dismiss after some time
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Get the URL from notification data, default to search agents page
    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUnowned: true }).then((clientList) => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes(self.registration.scope) && 'focus' in client) {
                    // Navigate the existing window to the target URL
                    return client.focus().then((client) => {
                        return client.navigate(urlToOpen);
                    });
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
