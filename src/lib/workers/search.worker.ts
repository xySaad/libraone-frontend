type InitMsg = { type: 'items'; items: unknown[] };
type SearchMsg = { type: 'search'; query: string };

let items: unknown[] = [];

const matchesQuery = (value: unknown, query: string): boolean => {
	if (value === null || value === undefined) return false;
	if (typeof value === 'string') return value.toLowerCase().includes(query);
	if (typeof value === 'number') return String(value).toLowerCase().includes(query);
	if (Array.isArray(value)) return value.some((v) => matchesQuery(v, query));
	if (typeof value === 'object') return Object.values(value).some((v) => matchesQuery(v, query));
	return false;
};

self.onmessage = (event: MessageEvent<InitMsg | SearchMsg>) => {
	const msg = event.data;

	if (msg.type === 'items') {
		items = msg.items;
		return;
	}

	const query = msg.query.trim().toLowerCase();
	const results = query ? items.filter((item) => matchesQuery(item, query)) : items;

	event.ports[0].postMessage(results);
};
