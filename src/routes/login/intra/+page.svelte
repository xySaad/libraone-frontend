<script lang="ts">
	import api from '$lib/api';
	import intra from '$lib/assets/intra.png';
	import LoginForm from '$lib/components/login/LoginForm.svelte';
	import { intraUserState } from '$lib/stores/user.svelte';
	import { jwtDecode } from 'jwt-decode';

	interface JWTPayload {
		sub: string;
		iat: number;
		ip: string;
		exp: number;
		'https://hasura.io/jwt/claims': {
			'x-hasura-allowed-roles': string[];
			'x-hasura-campuses': '{}';
			'x-hasura-default-role': 'user';
			'x-hasura-user-id': number;
			'x-hasura-token-id': string;
		};
	}

	async function handleSubmit({ username, password }: { username: string; password: string }) {
		const b64 = btoa(`${username}:${password}`);
		const token = await api.INTRA.signin({ Authorization: `Basic ${b64}` });
		const payload = jwtDecode<JWTPayload>(token);
		intraUserState.set({ jwt: token, userId: +payload.sub });
		history.back();
	}
</script>

<article>
	<LoginForm title="Intra" onsubmit={handleSubmit} titleColor="hsl(38, 80%, 62%)">
		{#snippet icon()}
			<img src={intra} alt="intra" />
		{/snippet}
	</LoginForm>
</article>

<style>
	article {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		width: 100%;
	}
</style>
