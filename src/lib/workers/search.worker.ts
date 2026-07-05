type InitMsg = { type: 'items'; items: unknown[] };
type SearchMsg = { type: 'search'; query: string };
export type ResultItem<T> = {
	value: T;
	keys: string[];
};

export type SearchResult<T> = {
	items: ResultItem<T>[];
	keys: Set<string>;
};

const matchesQuery = (value: unknown, query: string): boolean | string[] => {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string') return value.toLowerCase().includes(query);
	if (typeof value === 'number') return String(value).toLowerCase().includes(query);
	if (Array.isArray(value)) {
		const keys: string[] = [];
		const result = value.some((v) => {
			const result = matchesQuery(v, query);
			if (typeof result === 'boolean') return result;
			keys.push(...result);
		});
		return keys.length > 0 ? keys : result;
	}

	if (typeof value === 'object') {
		const keys: string[] = [];
		const result = Object.entries(value).some(([k, v]) => {
			const result = matchesQuery(v, query);
			if (result === false) return false;
			if (result === true) {
				keys.push(k);
				return true;
			}

			keys.push(...result.map((subkey) => k + '.' + subkey));
		});
		return keys.length > 0 ? keys : result;
	}
	return false;
};

let items: unknown[];
self.onmessage = (event: MessageEvent<InitMsg | SearchMsg>) => {
	const msg = event.data;

	if (msg.type === 'items') {
		items = msg.items;
		return;
	}

	const query = msg.query.trim().toLowerCase();
	let keys = new Set<string>();

	const resultItems =
		query.length < 1
			? items.map((value) => ({ value, keys: [] }))
			: items
					.map((item) => {
						const result = matchesQuery(item, query);
						if (result === false) return null;
						if (result === true) return { value: item, keys: [] };

						keys = keys.union(new Set(result));
						return { value: item, keys: result };
					})
					.filter((v) => v !== null);

	const searchResult: SearchResult<unknown> = { items: resultItems, keys };
	event.ports[0].postMessage(searchResult);
};
