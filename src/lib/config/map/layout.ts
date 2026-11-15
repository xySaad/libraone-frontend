export const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;
export type Direction = (typeof DIRECTIONS)[number];

export interface Entry {
	x: number;
	y: number;
	dir: Direction;
}

export interface Block {
	r: number;
	x: number;
	y: number;
	n: number;
}

export interface FloorLayout {
	blocks: Partial<Record<Direction, Block[]>>;
	entry: Entry;
	/** Where the furthest rows end, in seat units: the size of the plate that wraps them. */
	right: number;
	bottom: number;
}

export const LAYOUTS: Record<string, FloorLayout> = {
	z1: {
		blocks: {
			up: [
				{ r: 6, x: 7.9, y: 0, n: 6 },
				{ r: 7, x: 10.18, y: 0, n: 6 },
				{ r: 8, x: 12.46, y: 0, n: 6 },
				{ r: 9, x: 14.74, y: 0, n: 6 },
				{ r: 10, x: 17.02, y: 0, n: 6 }
			],
			left: [
				{ r: 5, x: 0, y: 6.63, n: 6 },
				{ r: 4, x: 0, y: 8.86, n: 6 },
				{ r: 3, x: 0, y: 11.09, n: 6 },
				{ r: 2, x: 0, y: 13.32, n: 6 },
				{ r: 1, x: 0, y: 15.55, n: 6 }
			],

			right: [
				{ r: 11, x: 12.57, y: 6.63, n: 6 },
				{ r: 12, x: 12.57, y: 8.86, n: 6 },
				{ r: 13, x: 12.57, y: 11.09, n: 6 },
				{ r: 14, x: 12.57, y: 13.32, n: 6 },
				{ r: 15, x: 12.57, y: 15.55, n: 6 },
				{ r: 16, x: 12.57, y: 17.78, n: 6 }
			],
			down: [
				{ r: 19, x: 5.97, y: 24.4, n: 8 },
				{ r: 18, x: 8.27, y: 20.4, n: 12 },
				{ r: 17, x: 10.57, y: 20.4, n: 12 }
			]
		},
		entry: { x: 2.3, y: 1.7, dir: 'down' },
		right: 18.52,
		bottom: 31.9
	},
	z2: {
		blocks: {
			left: [
				{ r: 5, x: 0, y: 6.63, n: 6 },
				{ r: 4, x: 0, y: 8.86, n: 6 },
				{ r: 3, x: 0, y: 11.09, n: 6 },
				{ r: 2, x: 0, y: 13.32, n: 6 },
				{ r: 1, x: 0, y: 15.55, n: 6 }
			]
		},
		bottom: 30,
		right: 15,
		entry: {
			dir: 'up',
			x: 17,
			y: 27
		}
	},
	z3: {
		blocks: {
			up: [
				{ r: 1, x: 0, y: 0, n: 6 },
				{ r: 2, x: 2.33, y: 0, n: 6 },
				{ r: 3, x: 4.66, y: 0, n: 6 },
				{ r: 4, x: 6.99, y: 0, n: 6 }
			],
			right: [
				{ r: 5, x: 14.2, y: -0.3, n: 6 },
				{ r: 6, x: 14.2, y: 2.03, n: 6 },
				{ r: 7, x: 14.2, y: 4.36, n: 6 },
				{ r: 8, x: 14.2, y: 6.69, n: 6 }
			],
			down: [
				{ r: 9, x: 0, y: 10.8, n: 6 },
				{ r: 10, x: 2.33, y: 10.8, n: 6 },
				{ r: 11, x: 4.66, y: 10.8, n: 6 }
			]
		},
		entry: { x: 0.9, y: 8, dir: 'right' },
		right: 19.7,
		bottom: 16.3
	},
	z4: {
		blocks: {
			left: [
				{ r: 11, x: 0, y: 0, n: 2 },
				{ r: 10, x: 0, y: 2.5, n: 2 },
				{ r: 9, x: 0, y: 5, n: 2 },
				{ r: 8, x: 0, y: 7.5, n: 2 },
				{ r: 7, x: 0, y: 10, n: 2 },
				{ r: 6, x: 0, y: 12.5, n: 2 }
			],
			right: [
				{ r: 1, x: 11.15, y: 2.5, n: 6 },
				{ r: 2, x: 11.15, y: 5, n: 6 },
				{ r: 3, x: 11.15, y: 7.5, n: 6 },
				{ r: 4, x: 11.15, y: 10, n: 6 },
				{ r: 5, x: 11.15, y: 12.5, n: 6 }
			]
		},

		entry: { x: 14, y: 0.35, dir: 'down' },
		right: 16.65,
		bottom: 14
	}
};

/** The empty margin around a floor's rows in the seat plan, in seat units: room for the row labels and the door. */
export const PLAN_PAD = 2;

/** How far the entry door arrow turns for each side it faces. */
export const DOOR_TURN: Record<Direction, number> = { down: 0, right: -90, up: 180, left: 90 };
