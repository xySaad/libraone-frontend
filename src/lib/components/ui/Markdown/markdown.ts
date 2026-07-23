import type { Token } from 'marked';

export const resolveIfRelative = (url: string, baseUrl: string) => {
	try {
		new URL(url);
		return url;
	} catch {
		const resolvedUrl = new URL(url, baseUrl);
		return resolvedUrl.toString();
	}
};

const parser = new DOMParser();
//TODO: implement an AST based solution instead of parsing raw DOM
//TODO: implement a spec compliant solution instead of hardcoding 'img' and 'a'
export function relativeUrlResolver(baseUrl: string) {
	return function walkTokens(token: Token) {
		if (token.type === 'image' || token.type === 'link') {
			token.href = resolveIfRelative(token.href, baseUrl);
			return;
		}

		if (token.type === 'html') {
			const parsedDocument = parser.parseFromString(token.raw, 'text/html');
			const elementsList = parsedDocument.body.querySelectorAll('img,a');
			const changes = [...elementsList].map((node) => {
				if (node instanceof HTMLImageElement) {
					const src = node.getAttribute('src');
					if (src) node.src = resolveIfRelative(src, baseUrl);
					return true;
				}
				if (node instanceof HTMLAnchorElement) {
					const href = node.getAttribute('href');
					if (href) node.href = resolveIfRelative(href, baseUrl);
					return true;
				}
				return false;
			});

			if (changes.some((c) => c)) {
				const raw = parsedDocument.body.innerHTML;
				token.raw = raw;
				token.text = raw;
			}
		}
	};
}
