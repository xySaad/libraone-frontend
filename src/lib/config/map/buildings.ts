import { onlineMap } from '$lib/stores/onlineUsers.svelte';
import type { Building, Floor } from '$lib/types/map.svelte';
import aerial from '$lib/assets/campus-aerial.jpg';
import { LAYOUTS } from './layout';

const makeFloors = (...zones: string[]): Floor[] =>
	zones
		.filter((id) => LAYOUTS[id])
		.map((id) => ({ layout: LAYOUTS[id], zone: onlineMap.getZone(id) }));

/** The aerial photo the campus view is drawn on. Outlines and badges are in its pixel space. */
export const PHOTO = { src: aerial, width: 791, height: 544 } as const;
export const BUILDINGS: Partial<Record<string, Building>> = {
	blue: {
		id: 'blue',
		name: 'Blue',
		tone: 'blue',
		floors: makeFloors('z1', 'z2'),
		outline: [
			[148, 75],
			[312, 104],
			[292, 362],
			[108, 333]
		],
		badge: [210, 222]
	},
	green: {
		id: 'green',
		name: 'Green',
		tone: 'green',
		floors: makeFloors('z3', 'z4'),
		outline: [
			[400, 198],
			[656, 243],
			[645, 406],
			[368, 366]
		],
		badge: [512, 306]
	}
};
