/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { GRAPHQL_ALLOWLIST } from './lib/graphql/allowlist';
import { getJWTSub } from './lib/utils/jwt';
const sw = self as unknown as ServiceWorkerGlobalScope;

const INTRA_ENDPOINT = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';
const INTRA_PROXY = '/api/graphql';
const DOWNLOAD_PATH = '/api/download';

let token: string | null = null;
sw.addEventListener('message', (event) => {
	switch (event.data?.type) {
		case 'GET_USER_ID':
			event.ports[0]?.postMessage({ userID: token ? getJWTSub(token) : null });
			break;
		case 'SET_TOKEN':
			token = event.data.token;
			break;
		default:
			break;
	}
});

sw.addEventListener('install', () => sw.skipWaiting());
sw.addEventListener('activate', (event) => event.waitUntil(sw.clients.claim()));

const forbidden = (msg: string): Response =>
	new Response(JSON.stringify({ error: msg }), {
		status: 403,
		headers: { 'Content-Type': 'application/json' }
	});

const sha256hex = async (str: string): Promise<string> => {
	const bytes = new TextEncoder().encode(str);
	const buf = await crypto.subtle.digest('SHA-256', bytes);
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
};

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

const proxyIntraGraphQL = async (event: FetchEvent): Promise<Response> => {
	console.log('token:', !!token);

	if (!token) return fetch(event.request);

	let body: { query?: unknown; variables?: unknown };
	try {
		body = await event.request.clone().json();
	} catch {
		return new Response('Invalid JSON body', { status: 400 });
	}

	if (typeof body.query !== 'string') return forbidden('Missing query');

	// Compare the hash of the exact query string against the build-time allowlist.
	const hash = await sha256hex(body.query);
	if (!GRAPHQL_ALLOWLIST.has(hash)) return forbidden('Query not allowed');

	return fetch(INTRA_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(body)
	});
};

sw.addEventListener('fetch', (event) => {
	const { pathname } = new URL(event.request.url);

	if (pathname.startsWith(DOWNLOAD_PATH)) {
		event.respondWith(injectHeader(event));
		return;
	}

	if (pathname.startsWith(INTRA_PROXY)) {
		event.respondWith(proxyIntraGraphQL(event));
		return;
	}
});
