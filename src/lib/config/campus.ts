import aerial from '$lib/assets/campus-aerial.jpg';
import type { Building, ZoneId } from '$lib/types/map/types.js';

/** The campus has no concept of buildings in the API, so the structure is hardcoded here. */
export const BUILDINGS: readonly Building[] = [
	{
		id: 'A',
		name: 'Building A',
		floors: ['z1', 'z2'],
		tone: 'a',
		outline: [
			[148, 75],
			[312, 104],
			[292, 362],
			[108, 333]
		],
		badge: [210, 222]
	},
	{
		id: 'B',
		name: 'Building B',
		floors: ['z3', 'z4'],
		tone: 'b',
		outline: [
			[400, 198],
			[656, 243],
			[645, 406],
			[368, 366]
		],
		badge: [512, 306]
	}
];

export const FLOOR_NAMES = ['Ground floor', 'Top floor'] as const;

/** The aerial photo the campus view is drawn on. Outlines and badges are in its pixel space. */
export const PHOTO = { src: aerial, width: 791, height: 544 } as const;

export const findBuilding = (id: string) => BUILDINGS.find((b) => b.id === id);

export const floorName = (b: Building, zone: ZoneId) =>
	b.floors[0] === zone ? FLOOR_NAMES[0] : FLOOR_NAMES[1];
