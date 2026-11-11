import { error } from '@sveltejs/kit';
import { findBuilding } from '$lib/config/campus.js';
import { findSection } from './geometry';

export function resolveBuilding(id: string) {
	const building = findBuilding(id);
	if (!building) error(404, `There is no building "${id}"`);
	return building;
}

export function resolveFloor(buildingId: string, zoneId: string) {
	const building = resolveBuilding(buildingId);
	const zone = building.floors.find((z) => z === zoneId);
	if (!zone) error(404, `${building.name} has no floor "${zoneId}"`);
	return { building, zone };
}

export function resolveSection(buildingId: string, zoneId: string, sectionId: string) {
	const { building, zone } = resolveFloor(buildingId, zoneId);
	const section = findSection(zone, sectionId);
	if (!section) error(404, `There is no section "${sectionId}" on this floor`);
	return { building, zone, section };
}
