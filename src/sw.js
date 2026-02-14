import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Cache the specific roadmap data with StaleWhileRevalidate (fastest for user, updates in background)
registerRoute(
    ({ url }) => url.pathname.includes('MERN-roadmap-data.json'),
    new StaleWhileRevalidate({
        cacheName: 'roadmap-data-cache',
    })
);

// Optional: Cache other external resources or specific API calls if any (none for now, mostly static)

self.skipWaiting();
clientsClaim();

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true,
        }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
