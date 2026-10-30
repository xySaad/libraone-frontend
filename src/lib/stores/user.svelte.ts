import api from '$lib/api';
import type { ProfileCreds } from '$lib/types/profile';
import { writable } from 'svelte/store';
import { preferences } from './prefenreces.svelte';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

const profileCreds = await api.LIBRAONE.candidate().catch(() => null);
export const profileUserState = writable<ProfileCreds | null>(profileCreds);

const getUserIdFromWorker = async (): Promise<number | null> => {
	const reg = await navigator.serviceWorker.ready;
	const active = reg.active;
	if (!active) return null;
	return new Promise((res) => {
		const { port1, port2 } = new MessageChannel();
		port1.onmessage = (e) => {
			res(e.data.userID);
			if (preferences.intraAutoLogin && e.data.userID === null) goto(resolve('/accounts/intra'));
		};
		active.postMessage({ type: 'GET_USER_ID' }, [port2]);
	});
};

const intraUserId = await getUserIdFromWorker();
export const intraUserIdState = writable<number | null>(intraUserId);

setInterval(async () => intraUserIdState.set(await getUserIdFromWorker()), 1000 * 20);
