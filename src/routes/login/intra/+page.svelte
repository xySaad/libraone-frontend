<script lang="ts">
	import api from '$lib/api';
	import { FetchError } from '$lib/api/fetch';
	import Link from '$lib/assets/svg/link.svelte';
	import PanelCard from '$lib/components/PanelCard.svelte';
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

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const b64 = btoa(`${username}:${password}`);
			const token = await api.INTRA.signin({ Authorization: `Basic ${b64}` });

			const payload = jwtDecode<JWTPayload>(token);
			const userId = +payload.sub;

			intraUserState.set({ jwt: token, userId });
			if (document.referrer && new URL(document.referrer).host === location.host) {
				history.back();
			} else {
				location.replace('/');
			}
		} catch (err) {
			if (err instanceof FetchError) {
				error = err.cause.error || 'Authentication failed';
			}
		} finally {
			loading = false;
		}
	};
</script>

<article>
	<form onsubmit={handleSubmit}>
		<PanelCard wordmark="Intra">
			<input bind:value={username} type="text" placeholder="username" required />
			<input bind:value={password} type="password" placeholder="password" required />

			{#if error}
				<p class="error">{error}</p>
			{/if}

			<button class="btn blue" type="submit" disabled={loading}>
				<Link />
				{loading ? 'Linking...' : 'Link'}
			</button>
		</PanelCard>
	</form>
</article>

<style>
	article {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.error {
		margin-top: 0.75rem;
		font-size: 0.875rem;
		color: #ef4444;
		text-align: center;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
		filter: grayscale(20%);
		transform: none;
		box-shadow: none;
	}
</style>
