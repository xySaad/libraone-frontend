<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Code from '$lib/assets/svg/code.svelte';
	import Icon from '$lib/components/shared/Icon.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { intraCreds } from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';
	const senderOrigin = 'https://libraone-auth.undo.it';

	const handleAsReceiver = () => {
		window.addEventListener('message', async (event) => {
			if (event.origin !== senderOrigin) return;
			if (event.source !== window.opener) return;
			const { type, data } = event.data;
			if (type === 'token') {
				intraCreds.set(data);
				goto('/');
			}
		});
		if (window.opener) window.opener.postMessage({ type: 'ready' }, senderOrigin);
	};

	const handleAsCallback = () => window.close();
	const receiver = page.url.searchParams.get('receiver');
	const callback = page.url.searchParams.get('callback');
	onMount(() => {
		if (receiver) handleAsReceiver();
		else if (callback) handleAsCallback();
		else window.location.replace(senderOrigin);
	});
</script>

<article>
	<Card padding="lg" maxWidth="420px">
		<Form novalidate>
			<Wordmark>
				<Icon><Code fill="var(--intra-accent)" /></Icon>
				Intra
			</Wordmark>
			{#if callback}
				Login succeded. Please close this window
			{:else}
				<span>
					<Spinner size="100px" />
				</span>
			{/if}
		</Form>
	</Card>
</article>

<style>
	article {
		position: relative;
		height: fit-content;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		width: 100%;
		margin: auto;

		span {
			margin: auto;
		}
	}
</style>
