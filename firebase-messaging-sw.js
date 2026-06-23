// firebase-messaging-sw.js
// Service Worker per Firebase Cloud Messaging (notifiche push) + Cache offline

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCRjoyrdD1ML8g0FfX0ZD9rG_nScqsnolQ",
  authDomain: "mondiale2026-prono.firebaseapp.com",
  projectId: "mondiale2026-prono",
  storageBucket: "mondiale2026-prono.firebasestorage.app",
  messagingSenderId: "426218656526",
  appId: "1:426218656526:web:af2c67782e007d3f9cfd5f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '🌍 Mondiale 2026', {
    body: body || 'Aggiornamento disponibile',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: payload.data || {}
  });
});

const CACHE_NAME = 'mondiale2026-v1';
const CACHE_URLS = ['/mondiale2026.html', '/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('googleapis.com') ||
      e.request.url.includes('worldcup26.ir') ||
      e.request.url.includes('corsproxy.io')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus();
      return clients.openWindow('/');
    })
  );
});
