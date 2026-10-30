<script lang="ts">
	import { page } from '$app/state';
	import Code from '$lib/assets/svg/code.svelte';
	import Icon from '$lib/components/shared/Icon.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { onMount } from 'svelte';
	const senderOrigin = 'https://libraone-auth.undo.it';

	const handleAsReceiver = () => {
		window.addEventListener('message', async (event) => {
			if (event.origin !== senderOrigin) return;
			if (event.source !== window.opener) return;
			const { type, data } = event.data;
			if (type === 'token') {
				const reg = await navigator.serviceWorker.ready;
				reg.active?.postMessage({ type: 'SET_TOKEN', token: data });
				window.close();
			}
		});
		if (window.opener) window.opener.postMessage({ type: 'ready' }, senderOrigin);
	};

	const receiver = page.url.searchParams.get('receiver');
	const callback = page.url.searchParams.get('callback');
	onMount(async () => {
		if (receiver) handleAsReceiver();
		else if (callback) history.back();
		else if (!navigator.serviceWorker.controller) window.location.reload();
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
			<span>
				<Spinner size="100px" />
			</span>
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
