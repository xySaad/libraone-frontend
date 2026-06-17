import api from '$lib/api';
import type { ProfileCreds } from '$lib/types/profile';
import { writable } from 'svelte/store';

const INTRA_KEY_STORAGE = 'intra_creds';
const intraCreds = localStorage.getItem(INTRA_KEY_STORAGE);
export interface IntraCreds {
	jwt: string;
	userId: number;
}
export const intraUserState = writable<IntraCreds | null>(
	intraCreds ? JSON.parse(intraCreds) : null
);
intraUserState.subscribe((v) => {
	if (v) localStorage.setItem(INTRA_KEY_STORAGE, JSON.stringify(v));
});

const profileCreds = await api.LIBRAONE.candidate().catch(() => null);
export const profileUserState = writable<ProfileCreds | null>(profileCreds);
