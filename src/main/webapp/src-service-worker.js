// Create Workbox service worker instance
workbox.skipWaiting();
workbox.clientsClaim();

// Placeholder array which is populated automatically by workboxBuild.injectManifest()
workbox.precaching.precacheAndRoute(self.__precacheManifest);

// const bgPostSyncPlugin = new workbox.backgroundSync.Plugin('solockedPostQueue', {
//     maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
// });
//
// workbox.routing.registerRoute(
//     '/api/accounts-dbs/updateDbUserConnected',
//     workbox.strategies.networkOnly({
//         plugins: [bgPostSyncPlugin]
//     }),
//     'PUT'
// );
//workbox.routing.registerRoute(
//    new RegExp('/api/'),
//    workbox.strategies.networkFirst()
//);
