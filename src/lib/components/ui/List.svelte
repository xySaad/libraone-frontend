<script lang="ts" generics="T extends {id: unknown}">
	import FlexContainer from '$lib/components/ui/Flex/FlexContainer.svelte';
	import FlexItem from '$lib/components/ui/Flex/FlexItem.svelte';
	import type { Snippet } from 'svelte';
	import Divider from '../shared/Divider.svelte';
	import Wordmark from '../shared/Wordmark.svelte';
	import Input from '../ui/Input.svelte';
	import Badge from './Badge.svelte';

	interface Props {
		items: T[];
		Item: Snippet<[T]>;
		searchPredicate: (item: T, query: string) => boolean | undefined | null;
	}

	const { items, Item, searchPredicate }: Props = $props();

	let searchQuery = $state('');
	const filtredItems = $derived(items.filter((g) => searchPredicate(g, searchQuery)));
</script>

<div class="list">
	<Divider>
		<Wordmark>Search</Wordmark>
	</Divider>

	<span>
		<Input name="search" type="text" placeholder="srm, go-reloaded" bind:value={searchQuery} />
	</span>
	<Divider>
		<Badge>{filtredItems.length} result</Badge>
	</Divider>
	<FlexContainer minWidth={300} gap="16px" justifyContent="center">
		{#each filtredItems as item (item.id)}
			<FlexItem>
				{@render Item(item)}
			</FlexItem>
		{/each}
	</FlexContainer>
</div>

<style>
	.list {
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		gap: 20px;
		min-height: 100svh;

		span {
			width: clamp(280px, 80%, 600px);
			margin: 0 auto;
		}
	}
</style>
