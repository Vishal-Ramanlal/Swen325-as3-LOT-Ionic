/**
 * Check out https://googlechromelabs.github.io/sw-toolbox/ for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/vendor.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.fastest);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;

// Define function
function showNotification() {
  self.registration.showNotification('Inactive!', { body: 'There has not been any motion for some time.' })
}

// Listens for messages from clients and shows notification for correct message
self.addEventListener('message', function(event){
  if(event.data === 'notification') {
    showNotification();
  }
});

// If the notification is clicked on, send a message back and focus the tab containing the app.
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
    // Focus tab
    event.waitUntil(clients.matchAll({ type: 'window'}).then(function (clientList) {
        for (var i = 0; i < clientList.length; ++i) {
          console.log('List', clientList);
            var client = clientList[i];
            if (client.url === 'http://localhost:8100/') {
                client.postMessage('notificationClicked');
                return client.focus();
            }
        }
    }));
})