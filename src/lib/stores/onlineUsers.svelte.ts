import { onWSMessage } from '$lib/api/websocket';
import type { Seat } from '$lib/types/websocket/seats';

export const onlineUsers = $state<Record<string, Seat>>({});

onWSMessage('SeatsList', (seatsList) => {
	for (const login in seatsList) {
		onlineUsers[login] = seatsList[login];
	}
});

onWSMessage('SeatUpdate', (update) => {
	for (const login in update.online) {
		onlineUsers[login] = update.online[login];
	}
	for (const login in update.offline) {
		delete onlineUsers[login];
	}
});
