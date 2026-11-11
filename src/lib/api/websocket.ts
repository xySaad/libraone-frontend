import { WebsocketMessageSchema, type WebsocketMessage } from '$lib/types/websocket/websocket';

const client = new WebSocket('/api/v2/ws');

client.addEventListener('open', () => {
	console.log('WS: connected');
});
client.addEventListener('close', (event) => {
	console.log('WS: disconnected', event.code, event.reason);
});
client.addEventListener('error', (event) => {
	console.error('WS: error:', event);
});

export function onWSMessage<K extends WebsocketMessage['type']>(
	type: K,
	listener: (message: Extract<WebsocketMessage, { type: K }>['data']) => unknown,
	options?: boolean | AddEventListenerOptions
): void;

export function onWSMessage(
	type: WebsocketMessage['type'],
	listener: (message: WebsocketMessage['data']) => unknown,
	options?: boolean | AddEventListenerOptions
) {
	return client.addEventListener(
		'message',
		(ev) => {
			const result = WebsocketMessageSchema.safeParse(JSON.parse(ev.data));
			if (result.success && result.data.type === type) {
				listener(result.data.data);
				return;
			}
		},
		options
	);
}
