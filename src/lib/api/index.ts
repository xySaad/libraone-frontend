import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { config, endpoint } from '$lib/types/config';
import type { GraphQLObject } from '$lib/types/object';
import type { LeaderboardUser, LogtimeData, MaplProfile } from '$lib/types/profile';
import type { LibraoneUser } from '$lib/types/user';

const handleUnAuthorized = (status: number) =>
	status === 401 &&
	goto(resolve(`/accounts/gitea?from=${location.pathname}`), { replaceState: true });

const LIBRAONE_BASE = 'https://libraone.undo.it/api';
export const api = {
	LIBRAONE: config({
		ERR_HANDLER: handleUnAuthorized,
		BASE: LIBRAONE_BASE,
		object(path: string = '') {
			return endpoint<GraphQLObject>('GET', `/object${path}`).call(this);
		},
		discord: endpoint<string[], Record<string, string>>('POST', '/v2/users/discord')
	}),
	LIBRAONE_UNAUTHED: config({
		BASE: LIBRAONE_BASE,
		candidate() {
			return endpoint<LibraoneUser>('GET', '/candidate').call(this);
		}
	}),
	CAMPUS: config({
		BASE: `${LIBRAONE_BASE}/campus`,
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
		BASE: 'https://learn.zone01oujda.ma/api',
		signin: endpoint<string, ['Authorization']>('POST', '/auth/signin', true)
	}),
	PROXIED_INTRA: config({
		BASE: 'https://cors.lil-hacker.workers.dev/proxy?url=https://learn.zone01oujda.ma/api',
		object(path: string = '') {
			return endpoint<GraphQLObject>('GET', `/object/${path}`).call(this);
		}
	})
};

export default api;
