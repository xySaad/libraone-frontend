import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { intraUserState } from '$lib/stores/user.svelte';
import { ClientError, GraphQLClient } from 'graphql-request';
import { get } from 'svelte/store';

export const Client = new GraphQLClient(
	'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql'
);

const originalRequest = Client.request.bind(Client);

const patchedRequest = async (...args: Parameters<typeof Client.request>) => {
	try {
		Client.setHeader('Authorization', `Bearer ${get(intraUserState)?.jwt}`);
		return await originalRequest(...args);
	} catch (error) {
		if (error instanceof ClientError) {
			const { body, headers } = error.response;
			if (headers.get('content-type')?.includes('application/json')) {
				const json = JSON.parse(body);
				if (json.errors?.length > 0) {
					goto(resolve('/login/intra'), { replaceState: true });
					throw error;
				}
			}
		}

		throw error;
	}
};

Client.request = patchedRequest as typeof Client.request;
