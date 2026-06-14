<script lang="ts">
	import Gitea from '$lib/assets/svg/gitea.svelte';
	import Icon from '$lib/components/shared/Icon.svelte';
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Form from '$lib/components/ui/Form.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { onMount } from 'svelte';

	const oauthWindow = window.open(
		'http://localhost:5051/api/auth',
		'_blank',
		'popup,width=600,height=700'
	);
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
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;

		span {
			margin: auto;
		}
	}
</style>
