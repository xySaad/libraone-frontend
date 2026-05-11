export class FetchError<T> extends Error {
	override cause?: T;
	status: number;
	constructor(status: number, options: ErrorOptions) {
		super('fetch error', options);
		this.status = status;
		this.cause = options.cause as T;
	}
}
export const fetchJSON = async <Req, Res>(
	method: string,
	url: string,
	headers?: HeadersInit,
	body?: Req
): Promise<Res> => {
	const resp = await fetch(url, {
		method: method,
		headers: { 'Content-Type': 'application/json', ...headers },
		body: JSON.stringify(body)
	});

	const json = await resp.json();

	if (!resp.ok) throw new FetchError(resp.status, { cause: json });

	return json;
};
