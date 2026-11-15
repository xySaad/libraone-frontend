import type { FloorLayout } from '$lib/config/map/layout';
import type { Seat } from './websocket/seats';
export type Point = readonly [x: number, y: number];

export interface Zone {
	id: string;
	totalOnline: number;
	rows: Record<string, Row>;
}
interface Row {
	id: string;
	seats: Seat[];
}

export class OnlineMap {
	totalOnline = $state(0);
	zones: Record<string, Zone> = $state({});

	/** Always returns the reactive proxy: the object `??=` evaluates to is the raw one, which never updates the UI. */
	getZone(id: string) {
		this.zones[id] ??= { id, totalOnline: 0, rows: {} };
		return this.zones[id];
	}

	addSeat(seat: Seat) {
		this.totalOnline++;
		const zone = this.getZone(seat.zone);
		zone.totalOnline++;
		const row = (zone.rows[seat.row] ??= { id: seat.row, seats: [] });
		row.seats.push(seat);
	}

	removeSeat(seat: Seat) {
		this.totalOnline--;
		const zone = this.zones[seat.zone];
		zone.totalOnline--;
		const row = zone.rows[seat.row];
		row.seats = row.seats.filter((s) => s.id !== seat.id);
	}
}

export interface Floor {
	layout: FloorLayout;
	zone: Zone;
}
export type Tone = 'blue' | 'green';
export interface Building {
	id: string;
	floors: Floor[];
	name: string;
	tone: Tone;
	/** Roof outline on the aerial photo, in photo pixels. */
	outline: readonly Point[];
	/** Where the badge sits on the aerial photo, in photo pixels. */
	badge: Point;
}
