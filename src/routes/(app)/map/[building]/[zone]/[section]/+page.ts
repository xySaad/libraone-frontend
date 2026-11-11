import { floorName } from '$lib/config/campus.js';
import { onlineInSection } from '$lib/types/map/occupancy.js';
import { resolveSection } from '$lib/types/map/routing.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { occupancy } = await parent();
	const { building, zone, section } = resolveSection(params.building, params.zone, params.section);
	return {
		zone,
		section,
		heading: `${section.label}, ${floorName(building, zone).toLowerCase()}`,
		online: onlineInSection(occupancy, zone, section),
		back: `/map/${building.id}/${zone}`
	};
};
