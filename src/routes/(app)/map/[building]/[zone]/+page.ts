import { floorName } from '$lib/config/campus.js';
import { onlineInZone } from '$lib/types/map/occupancy.js';
import { resolveFloor } from '$lib/types/map/routing.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { occupancy } = await parent();
	const { building, zone } = resolveFloor(params.building, params.zone);
	return {
		building,
		zone,
		heading: `${building.name}, ${floorName(building, zone).toLowerCase()}`,
		online: onlineInZone(occupancy, zone),
		back: `/map/${building.id}`,
		occupancy
	};
};
