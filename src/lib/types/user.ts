import type { Record_Public_View, User_Public_View } from '$lib/graphql/generated';

export type User = User_Public_View;
export type UserRecord = Record_Public_View;

export interface LibraoneUser {
	id: number;
	gitea_login: string;
	graphql_login: string;
	graphql_id: number;
	role: string;
	avatar_url: string;
	campus: string;
}
