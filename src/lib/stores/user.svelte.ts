import api from '$lib/api';
import { writable } from 'svelte/store';
import { preferences } from './preferences.svelte';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import type { LibraoneUser } from '$lib/types/user';

const libraoneCreds = await api.LIBRAONE_UNAUTHED.candidate().catch(() => null);
export const libraoneUserState = writable<LibraoneUser | null>(libraoneCreds);

const getUserIdFromWorker = async (): Promise<number | null> => {
	const ctrl = navigator.serviceWorker.controller;
	if (!ctrl) {
		window.location.reload();
		return null;
	}
	return new Promise((res) => {
		const { port1, port2 } = new MessageChannel();
		port1.onmessage = (e) => {
			if (preferences.intraAutoLogin && e.data.userID === null) goto(resolve('/accounts/intra'));
			else res(e.data.userID);
		};
		ctrl.postMessage({ type: 'GET_USER_ID' }, [port2]);
	});
};

const intraUserId = await getUserIdFromWorker();
export const intraUserIdState = writable<number | null>(intraUserId);

setInterval(async () => intraUserIdState.set(await getUserIdFromWorker()), 1000 * 20);
