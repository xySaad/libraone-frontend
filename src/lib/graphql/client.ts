import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { ClientError, GraphQLClient } from 'graphql-request';

export const Client = new GraphQLClient('https://libraone.undo.it/api/graphql');

const originalRequest = Client.request.bind(Client);

const patchedRequest = async (...args: Parameters<typeof Client.request>) => {
	try {
		return await originalRequest(...args);
	} catch (error) {
		if (error instanceof ClientError) {
			if (error.response.status === 401) {
				goto(resolve(`/login/gitea?from=${location.pathname}`), { replaceState: true });
			}
		}

		throw error;
	}
};

Client.request = patchedRequest as typeof Client.request;
