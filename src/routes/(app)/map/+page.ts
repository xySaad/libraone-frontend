import { onlineOnCampus } from '$lib/types/map/occupancy.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { occupancy } = await parent();
	return { heading: 'Campus', online: onlineOnCampus(occupancy) };
};
