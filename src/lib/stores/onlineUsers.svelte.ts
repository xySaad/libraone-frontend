import { onWSMessage } from '$lib/api/websocket';
import { OnlineMap } from '$lib/types/map.svelte';
import type { Seat } from '$lib/types/websocket/seats';

export const onlineUsers = $state<Record<string, Seat>>({});
export const onlineMap = new OnlineMap();

onWSMessage('SeatsList', (seatsList) => {
	for (const login in seatsList) {
		const seat = seatsList[login];
		onlineUsers[login] = seat;

		onlineMap.addSeat(seat);
	}
});

onWSMessage('SeatUpdate', (update) => {
	for (const login in update.online) {
		const seat = update.online[login];

		onlineUsers[login] = update.online[login];
		onlineMap.addSeat(seat);
	}
	for (const login in update.offline) {
		const seat = update.offline[login];

		delete onlineUsers[login];
		onlineMap.removeSeat(seat);
	}
});
