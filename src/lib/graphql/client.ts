import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { ClientError, GraphQLClient } from 'graphql-request';
import { get } from 'svelte/store';
import { intraCreds } from '$lib/stores/user.svelte';

const INTRA_ENDPOINT = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';

export const Client = new GraphQLClient('https://libraone.undo.it/api/graphql');

const originalRequest = Client.request.bind(Client);

const patchedRequest = async (...args: Parameters<typeof Client.request>) => {
	const token = get(intraCreds);

	if (token) {
		const intraClient = new GraphQLClient(INTRA_ENDPOINT, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return intraClient.request(...args);
	}

	try {
		return await originalRequest(...args);
	} catch (error) {
		if (error instanceof ClientError) {
			if (error.response.status === 401) {
				goto(resolve(`/accounts/gitea?from=${location.pathname}`), { replaceState: true });
			}
		}

		throw error;
	}
};

Client.request = patchedRequest as typeof Client.request;
