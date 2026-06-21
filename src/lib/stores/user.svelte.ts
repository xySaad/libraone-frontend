import api from '$lib/api';
import type { ProfileCreds } from '$lib/types/profile';
import { writable } from 'svelte/store';

const profileCreds = await api.LIBRAONE.candidate().catch(() => null);
export const profileUserState = writable<ProfileCreds | null>(profileCreds);
