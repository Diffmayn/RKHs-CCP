/**
 * RKH Photo Orders - Service Worker
 * 
 * Provides offline support through caching and background sync.
 */

const CACHE_NAME = 'rkh-photo-orders-v1';
const DYNAMIC_CACHE = 'rkh-photo-orders-dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
	'/',
	'/index.html',
	'/fallback-bundle.js',
	'/assets/CCP-Logo.png',
];

// API endpoints to never cache
const API_PATTERNS = [
	'/api/',
	'/auth/',
	'/ws/',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	console.log('[SW] Installing service worker...');
	
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				console.log('[SW] Caching static assets');
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => {
				console.log('[SW] Static assets cached');
				return self.skipWaiting();
			})
			.catch((error) => {
				console.error('[SW] Failed to cache static assets:', error);
			})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	console.log('[SW] Activating service worker...');
	
	event.waitUntil(
		caches.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
						.map((name) => {
							console.log('[SW] Deleting old cache:', name);
							return caches.delete(name);
						})
				);
			})
			.then(() => {
				console.log('[SW] Service worker activated');
				return self.clients.claim();
			})
	);
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);
	
	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}
	
	// Skip API requests (handled by sync queue in app)
	if (API_PATTERNS.some((pattern) => url.pathname.includes(pattern))) {
		return;
	}
	
	// Skip cross-origin requests
	if (url.origin !== location.origin) {
		return;
	}
	
	// For navigation requests, try network first
	if (request.mode === 'navigate') {
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Cache the response for offline use
					const responseClone = response.clone();
					caches.open(DYNAMIC_CACHE).then((cache) => {
						cache.put(request, responseClone);
					});
					return response;
				})
				.catch(() => {
					// Fallback to cached version
					return caches.match(request)
						.then((cached) => cached || caches.match('/index.html'));
				})
		);
		return;
	}
	
	// For other requests, stale-while-revalidate
	event.respondWith(
		caches.match(request)
			.then((cached) => {
				const fetchPromise = fetch(request)
					.then((response) => {
						// Don't cache error responses
						if (!response.ok) {
							return response;
						}
						
						// Cache the fresh response
						const responseClone = response.clone();
						caches.open(DYNAMIC_CACHE).then((cache) => {
							cache.put(request, responseClone);
						});
						
						return response;
					})
					.catch(() => {
						// Network failed, return cached if available
						return cached || createOfflineResponse(request);
					});
				
				// Return cached immediately, update in background
				return cached || fetchPromise;
			})
	);
});

// Background sync event
self.addEventListener('sync', (event) => {
	console.log('[SW] Background sync event:', event.tag);
	
	if (event.tag === 'sync-orders') {
		event.waitUntil(syncOrders());
	} else if (event.tag === 'sync-assets') {
		event.waitUntil(syncAssets());
	}
});

// Push notification event
self.addEventListener('push', (event) => {
	console.log('[SW] Push notification received');
	
	if (!event.data) {
		return;
	}
	
	const data = event.data.json();
	const options = {
		body: data.body || 'New notification',
		icon: '/assets/CCP-Logo.png',
		badge: '/assets/CCP-Logo.png',
		vibrate: [100, 50, 100],
		data: data.data || {},
		actions: data.actions || [],
	};
	
	event.waitUntil(
		self.registration.showNotification(data.title || 'RKH Photo Orders', options)
	);
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
	console.log('[SW] Notification clicked:', event.action);
	
	event.notification.close();
	
	const urlToOpen = event.notification.data?.url || '/';
	
	event.waitUntil(
		self.clients.matchAll({ type: 'window' })
			.then((clientList) => {
				// Focus existing window if available
				for (const client of clientList) {
					if (client.url === urlToOpen && 'focus' in client) {
						return client.focus();
					}
				}
				// Open new window if no existing window
				if (self.clients.openWindow) {
					return self.clients.openWindow(urlToOpen);
				}
			})
	);
});

// Message event - handle messages from app
self.addEventListener('message', (event) => {
	console.log('[SW] Message received:', event.data);
	
	if (event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	} else if (event.data.type === 'CACHE_URLS') {
		event.waitUntil(
			caches.open(DYNAMIC_CACHE).then((cache) => {
				return cache.addAll(event.data.urls || []);
			})
		);
	} else if (event.data.type === 'CLEAR_CACHE') {
		event.waitUntil(
			caches.keys().then((names) => {
				return Promise.all(names.map((name) => caches.delete(name)));
			})
		);
	}
});

// Helper function to sync orders
async function syncOrders() {
	console.log('[SW] Syncing orders...');
	
	// Notify all clients to perform sync
	const clients = await self.clients.matchAll();
	clients.forEach((client) => {
		client.postMessage({ 
			type: 'SYNC_REQUESTED',
			resource: 'orders'
		});
	});
}

// Helper function to sync assets
async function syncAssets() {
	console.log('[SW] Syncing assets...');
	
	const clients = await self.clients.matchAll();
	clients.forEach((client) => {
		client.postMessage({ 
			type: 'SYNC_REQUESTED',
			resource: 'assets'
		});
	});
}

// Create offline response
function createOfflineResponse(request) {
	const url = new URL(request.url);
	const ext = url.pathname.split('.').pop();
	
	// Return appropriate offline response based on file type
	if (ext === 'html' || request.mode === 'navigate') {
		return new Response(
			`<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Offline - RKH Photo Orders</title>
				<style>
					body {
						font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
						display: flex;
						align-items: center;
						justify-content: center;
						min-height: 100vh;
						margin: 0;
						background: #f5f5f5;
					}
					.offline-message {
						text-align: center;
						padding: 40px;
						background: white;
						border-radius: 8px;
						box-shadow: 0 2px 10px rgba(0,0,0,0.1);
					}
					h1 { color: #333; margin-bottom: 10px; }
					p { color: #666; margin-bottom: 20px; }
					button {
						padding: 12px 24px;
						font-size: 16px;
						background: #3b82f6;
						color: white;
						border: none;
						border-radius: 6px;
						cursor: pointer;
					}
					button:hover { background: #2563eb; }
				</style>
			</head>
			<body>
				<div class="offline-message">
					<h1>You're Offline</h1>
					<p>Please check your internet connection and try again.</p>
					<button onclick="window.location.reload()">Retry</button>
				</div>
			</body>
			</html>`,
			{
				status: 503,
				statusText: 'Service Unavailable',
				headers: { 'Content-Type': 'text/html' }
			}
		);
	}
	
	if (ext === 'js') {
		return new Response('console.log("Script unavailable offline");', {
			status: 503,
			headers: { 'Content-Type': 'application/javascript' }
		});
	}
	
	if (ext === 'css') {
		return new Response('/* Styles unavailable offline */', {
			status: 503,
			headers: { 'Content-Type': 'text/css' }
		});
	}
	
	if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) {
		// Return a placeholder image (1x1 transparent pixel)
		return new Response(
			new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,137,0,0,0,10,73,68,65,84,120,156,99,0,1,0,0,5,0,1,13,10,45,180,0,0,0,0,73,69,78,68,174,66,96,130]),
			{
				status: 503,
				headers: { 'Content-Type': 'image/png' }
			}
		);
	}
	
	return new Response('Resource unavailable offline', { status: 503 });
}

console.log('[SW] Service worker loaded');
