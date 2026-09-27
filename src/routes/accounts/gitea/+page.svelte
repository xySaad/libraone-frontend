<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import api from '$lib/api';
	import Gitea from '$lib/assets/svg/gitea.svelte';
	import Icon from '$lib/components/shared/Icon.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { profileUserState } from '$lib/stores/user.svelte';

	const close = page.url.searchParams.get('close');
	const from = page.url.searchParams.get('from');

	const CLOSE_MESSAGE = 'close-gitea-oauth-window';
	const closeHandler = (oauthWindow: Window) => async (event: MessageEvent) => {
		if (event.origin !== window.origin) return;
		if (event.data === CLOSE_MESSAGE) oauthWindow.close();
		$profileUserState = await api.LIBRAONE.candidate();
		goto(from ?? '/', { replaceState: true });
	};

	const mount = () => {
		const oauthWindow = window.open('https://libraone.undo.it/api/v2/oauth/gitea', '_blank');
		if (oauthWindow) addEventListener('message', closeHandler(oauthWindow));
	};

	if (Boolean(close) === true)
		window.opener.postMessage(CLOSE_MESSAGE, { targetOrigin: window.origin });
	else mount();
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
