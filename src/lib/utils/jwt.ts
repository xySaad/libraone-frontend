export const getJWTSub = (token: string): number =>
	Number(JSON.parse(atob(token.split('.')[1])).sub);
