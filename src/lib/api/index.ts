import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { config, endpoint } from '$lib/types/config';
import type { GraphQLObject } from '$lib/types/object';
import type { LeaderboardUser, LogtimeData, MaplProfile, ProfileCreds } from '$lib/types/profile';

const handleUnAuthorized = (status: number) =>
	status === 401 && goto(resolve(`/login/gitea?from=${location.pathname}`), { replaceState: true });

export const api = {
	LIBRAONE: config({
		ORIGIN: 'https://libraone.undo.it/api',
		candidate(login?: string) {
			return endpoint<ProfileCreds>('GET', `/candidate/${login ?? ''}`).call(this);
		}
	}),
	CAMPUS: config({
		ORIGIN: 'https://libraone.undo.it/api/campus',
		online: endpoint<Record<string, string>>('GET', '/online'),
		ERR_HANDLER: handleUnAuthorized,
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
		object(path: string = '') {
			return endpoint<GraphQLObject>('GET', `/object/${path}`).call(this);
		}
	})
};

export default api;
