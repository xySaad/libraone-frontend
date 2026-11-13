<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import api from '$lib/api';
	import Gitea from '$lib/assets/svg/gitea.svelte';
	import Icon from '$lib/components/shared/Icon.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { libraoneUserState } from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';

	const close = page.url.searchParams.get('close');
	const from = page.url.searchParams.get('from');

	const CLOSE_MESSAGE = 'close-gitea-oauth-window';
	const closeHandler = (oauthWindow: Window) => async (event: MessageEvent) => {
		if (event.origin !== window.origin) return;
		if (event.data === CLOSE_MESSAGE) oauthWindow.close();
		$libraoneUserState = await api.LIBRAONE_UNAUTHED.candidate();
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		if (from) goto(from, { replaceState: true });
		else goto(resolve('/'), { replaceState: true });
	};

	onMount(() => {
		//OAuth callback
		if (Boolean(close) === true) {
			if (!window.opener) {
				goto(resolve('/accounts'), { replaceState: true });
			} else {
				window.opener.postMessage(CLOSE_MESSAGE, { targetOrigin: window.origin });
			}
			return;
		}

		//main page
		const oauthWindow = window.open('https://libraone.undo.it/api/v2/oauth/gitea', '_blank');
		if (!oauthWindow || oauthWindow.closed) {
			history.back();
			return;
		}
		const handler = closeHandler(oauthWindow);
		window.addEventListener('message', handler);
		const interval = setInterval(() => {
			if (oauthWindow.closed) history.back();
		}, 1000);
		return () => {
			clearInterval(interval);
			window.removeEventListener('message', handler);
		};
	});
</script>

<article>
	<Card padding="lg" maxWidth="420px">
		<Form novalidate>
			<Wordmark>
				<Icon><Gitea /></Icon>
				Gitea
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
