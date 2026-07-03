<script lang="ts" generics="T extends {id: unknown}">
	import FlexContainer from '$lib/components/ui/Flex/FlexContainer.svelte';
	import FlexItem from '$lib/components/ui/Flex/FlexItem.svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import Divider from '../shared/Divider.svelte';
	import Suspend from '../shared/Suspend.svelte';
	import Wordmark from '../shared/Wordmark.svelte';
	import Input from '../ui/Input.svelte';
	import Badge from './Badge.svelte';
	import SearchWorker from '$lib/workers/search.worker.ts?worker';
	interface Props {
		items: T[];
		Item: Snippet<[T]>;
	}

	const { items, Item }: Props = $props();

	let searchQuery = $state('');

	const worker = new SearchWorker();
	$effect.pre(() => {
		worker.postMessage({ type: 'items', items });
	});
	onDestroy(() => worker.terminate());

	const search = (query: string): Promise<T[]> =>
		new Promise((resolve) => {
			const channel = new MessageChannel();
			channel.port1.onmessage = (event: MessageEvent<T[]>) => resolve(event.data);
			worker.postMessage({ type: 'search', query }, [channel.port2]);
		});
</script>

<div class="list">
	<Divider>
		<Wordmark>Search</Wordmark>
	</Divider>

	<span>
		<Input name="search" type="text" placeholder="srm, go-reloaded" bind:value={searchQuery} />
	</span>

	<Suspend data={search(searchQuery)} size="24px">
		{#snippet children(results)}
			<Divider>
				<Badge>{results.length} result</Badge>
			</Divider>
			<FlexContainer minWidth={300} gap="16px" justifyContent="center">
				{#each results as item (item.id)}
					<FlexItem>
						{@render Item(item)}
					</FlexItem>
				{/each}
			</FlexContainer>
		{/snippet}
	</Suspend>
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-height: 100svh;

		span {
			width: clamp(280px, 80%, 600px);
			margin: 0 auto;
		}
	}
</style>
