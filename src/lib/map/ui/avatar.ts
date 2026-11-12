import api from '$lib/api';

/** The small campus-map portrait of a student. */
export const avatarUrl = (login: string) => `${api.CAMPUS.ORIGIN}/image/map/${login}`;
