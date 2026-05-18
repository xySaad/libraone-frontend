import { browser } from '$app/environment';
import type { ProfileCreds } from '$lib/types/profile';
import { writable } from 'svelte/store';

const readStorage = <T>(key: string): T | null => {
	if (!browser) return null;

	const raw = localStorage.getItem(key);
	if (!raw) return null;

	try {
		return JSON.parse(raw) as T;
	} catch {
		localStorage.removeItem(key);
		return null;
	}
};

const syncStorage = (key: string, value: unknown) => {
	if (!browser) return;

	if (value === null) {
		localStorage.removeItem(key);
		return;
	}

	localStorage.setItem(key, JSON.stringify(value));
};

const INTRA_KEY_STORAGE = 'intra_creds';
export interface IntraCreds {
	jwt: string;
	userId: number;
}
export const intraUserState = writable<IntraCreds | null>(
	readStorage<IntraCreds>(INTRA_KEY_STORAGE)
);
intraUserState.subscribe((v) => {
	syncStorage(INTRA_KEY_STORAGE, v);
});

const PROFILE_KEY_STORAGE = 'profile_creds';
export const profileUserState = writable<ProfileCreds | null>(
	readStorage<ProfileCreds>(PROFILE_KEY_STORAGE)
);

profileUserState.subscribe((v) => {
	syncStorage(PROFILE_KEY_STORAGE, v);
});
