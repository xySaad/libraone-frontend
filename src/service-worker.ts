/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('install', () => {
	sw.skipWaiting();
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(sw.clients.claim());
});

const injectHeader = async (event: FetchEvent): Promise<Response> => {
	const reqUrl = new URL(event.request.url);
	const target = reqUrl.searchParams.get('url');
	if (!target) return new Response('Missing url parameter', { status: 400 });
	const response = await fetch(target);
	if (!response.ok) return response;
	const fileName = reqUrl.searchParams.get('name');
	const contentDisposition = fileName ? `attachment; filename="${fileName}"` : `attachment`;
	const headers = new Headers(response.headers);
	headers.set('Content-Disposition', contentDisposition);
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
};

sw.addEventListener('fetch', (event) => {
	const reqUrl = new URL(event.request.url);
	if (!reqUrl.pathname.startsWith('/api/download')) return;
	event.respondWith(injectHeader(event));
});
