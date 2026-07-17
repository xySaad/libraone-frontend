<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowLeft from '$lib/assets/svg/arrow-left.svelte';
	import ArrowRight from '$lib/assets/svg/arrow-right.svelte';
	import Badge from '../ui/Badge.svelte';
	interface Props {
		index: number;
		siblings: Array<{
			index?: number | null;
			id: number;
			child: { name?: string | null; id: number };
		}>;
	}

	const { siblings, index }: Props = $props();
	// TODO: handle the case when prev or next are more than one item
	const prev = $derived(siblings.find((rel) => rel.index === index - 1));
	const next = $derived(siblings.find((rel) => rel.index === index + 1));
</script>

<nav>
	{#if prev}
		{@const { id, name } = prev.child}
		<a href={resolve(`/(app)/events/[objectId]?relation=${prev.id}`, { objectId: id.toString() })}>
			<Badge>{name}<ArrowLeft /></Badge>
		</a>
	{/if}

	{#if next}
		{@const { id, name } = next.child}
		<a href={resolve(`/(app)/events/[objectId]?relation=${next.id}`, { objectId: id.toString() })}>
			<Badge>{name}<ArrowRight /></Badge>
		</a>
	{/if}
</nav>

<style>
	nav {
		display: flex;
		gap: 10px;
		white-space: nowrap;
	}
</style>
