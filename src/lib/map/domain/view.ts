import { resolve } from '$app/paths';
import { floorName, findBuilding } from '$lib/map/config/campus';
import { findSection } from './geometry';
import type { Section } from './geometry';
import { onlineInBuilding, onlineInSection, onlineInZone, onlineOnCampus } from './occupancy';
import type { Occupancy } from './occupancy';
import type { Building, ZoneId } from './types';

/** Which level of the campus the URL points at, with everything it names already looked up. */
export type MapView =
	| { level: 'campus' }
	| { level: 'building'; building: Building }
	| { level: 'floor'; building: Building; zone: ZoneId }
	| { level: 'section'; building: Building; zone: ZoneId; section: Section };

interface MapParams {
	building?: string;
	zone?: string;
	section?: string;
}

/** Null when the URL names a building, floor or section that doesn't exist. */
export function resolveView({ building: bId, zone: zId, section: sId }: MapParams): MapView | null {
	if (bId === undefined) return { level: 'campus' };
	const building = findBuilding(bId);
	if (!building) return null;

	if (zId === undefined) return { level: 'building', building };
	const zone = building.floors.find((z) => z === zId);
	if (!zone) return null;

	if (sId === undefined) return { level: 'floor', building, zone };
	const section = findSection(zone, sId);
	if (!section) return null;

	return { level: 'section', building, zone, section };
}

export interface ViewSummary {
	heading: string;
	online: number;
	/** Where "back" goes; absent on the campus view. */
	back?: string;
}

export function summarize(view: MapView, occupancy: Occupancy): ViewSummary {
	switch (view.level) {
		case 'campus':
			return { heading: 'Campus', online: onlineOnCampus(occupancy) };
		case 'building':
			return {
				heading: view.building.name,
				online: onlineInBuilding(occupancy, view.building),
				back: resolve('/map')
			};
		case 'floor':
			return {
				heading: `${view.building.name}, ${floorName(view.building, view.zone).toLowerCase()}`,
				online: onlineInZone(occupancy, view.zone),
				back: resolve(`/map/${view.building.id}`)
			};
		case 'section':
			return {
				heading: `${view.section.label}, ${floorName(view.building, view.zone).toLowerCase()}`,
				online: onlineInSection(occupancy, view.zone, view.section),
				back: resolve(`/map/${view.building.id}/${view.zone}`)
			};
	}
}
