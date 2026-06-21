export interface LoginReq {
	username: string;
	password: string;
}

export interface ProfileCreds {
	id: number;
	graphql_login: string;
	graphql_id: number;
	role: string;
}

export type LastSession = {
	start: string;
	end: string;
	hostname: string;
	ip_address: string;
};

export type MaplProfile = {
	main_group: string;
	sub_group: string;
	location?: string | null;
	last_session?: LastSession | null;
};

export type LogtimeMonth = {
	total: number;
	logtime: Record<string, number>;
};

export type LogtimeData = Record<string, LogtimeMonth>;

export interface LeaderboardUser {
	username: string;
	cohort: string;
	value: number;
}
