import api from '$lib/api';
import { occupancyFromOnline } from '$lib/map/domain/occupancy';
import type { Occupancy } from '$lib/map/domain/occupancy';

const NOBODY: Occupancy = new Map();

/**
 * Who is sitting where. Lives outside the routes so navigating around the map is never held up
 * by a request, and so coming back to the map shows the last known state straight away.
 */
class OccupancyStore {
	#snapshot = $state.raw<Occupancy | null>(null);
	#failed = $state(false);
	#latest = 0;

	/** False until the first response has arrived. */
	get ready() {
		return this.#snapshot !== null;
	}
	/** The first request failed and there is nothing to show yet. */
	get failed() {
		return this.#failed && !this.ready;
	}
	get occupancy() {
		return this.#snapshot ?? NOBODY;
	}

	async refresh() {
		const request = ++this.#latest;
		try {
			const online = await api.CAMPUS.online();
			if (request !== this.#latest) return; // a newer refresh superseded this one
			this.#snapshot = occupancyFromOnline(online);
			this.#failed = false;
		} catch {
			if (request === this.#latest) this.#failed = true;
		}
	}
}

export const occupancyStore = new OccupancyStore();
