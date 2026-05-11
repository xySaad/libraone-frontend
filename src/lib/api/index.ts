import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { profileUserState } from '$lib/stores/user.svelte';
import { config, endpoint } from '$lib/types/config';
import type { GraphQLObject } from '$lib/types/object';
import type {
	LeaderboardUser,
	LoginReq,
	LogtimeData,
	MaplProfile,
	ProfileCreds
} from '$lib/types/profile';
import { get } from 'svelte/store';

export const api = {
	PROFILE: config({
		ORIGIN: 'https://mapl.zone01oujda.ma',
		HEADERS: () => ({ 'X-TOKEN': get(profileUserState)?.token ?? '' }),
		ERR_HANDLER: (status: number) => {
			if (status === 403) goto(resolve('/login/profile'), { replaceState: true });
		},
		login: endpoint<LoginReq, ProfileCreds>('POST', '/login'),
		online: endpoint<Record<string, string>>('GET', '/online'),
		profile({ login }: { login: string }) {
			return endpoint<MaplProfile>('GET', `/profile/${login}`).call(this);
		},
		logtime({ start, end, login }: { start: string; end: string; login: string }) {
			return endpoint<LogtimeData>('GET', `/logtime/${login}?start=${start}&end=${end}`).call(this);
		},
		leaderboard({ start, end }: { start: string; end: string }) {
			return endpoint<LeaderboardUser[]>(
				'GET',
				`/leaderboard?start=${start}&end=${end}&n=50&role=all`
			).call(this);
		}
	}),
	INTRA: config({
		ORIGIN: 'https://learn.zone01oujda.ma/api',
		signin: endpoint<string, ['Authorization']>('POST', '/auth/signin', true)
	}),
	PROXIED_INTRA: config({
		ORIGIN: 'https://cors.lil-hacker.workers.dev/proxy?url=https://learn.zone01oujda.ma/api',
		object: endpoint<GraphQLObject>('GET', '/object/oujda')
	})
};

export default api;
