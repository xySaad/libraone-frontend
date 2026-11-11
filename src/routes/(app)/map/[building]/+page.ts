import { onlineInBuilding } from '$lib/types/map/occupancy.js';
import { resolveBuilding } from '$lib/types/map/routing.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { occupancy } = await parent();
	const building = resolveBuilding(params.building);
	return {
		building,
		heading: building.name,
		online: onlineInBuilding(occupancy, building),
		back: '/map',
		occupancy
	};
};
