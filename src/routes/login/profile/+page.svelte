<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { api } from '$lib/api';
	import { FetchError } from '$lib/api/fetch';
	import Link from '$lib/assets/svg/link.svelte';
	import PanelCard from '$lib/components/PanelCard.svelte';
	import { profileUserState } from '$lib/stores/user.svelte';

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	$effect(() => {
		if ($profileUserState) {
			goto(resolve('/login'), { replaceState: true });
		}
	});

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			const creds = await api.PROFILE.login({ username, password });
			$profileUserState = creds;
			goto(resolve('/'), { replaceState: true });
		} catch (e) {
			if (e instanceof FetchError && typeof e.cause?.detail == 'string')
				error = e.cause?.detail || 'Invalid username or password';
		} finally {
			loading = false;
		}
	};
</script>

<article>
	<form onsubmit={handleSubmit}>
		<PanelCard wordmark="Profile">
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
		color: #ef4444;
		font-size: 0.875rem;
		margin: 0.5rem 0;
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
