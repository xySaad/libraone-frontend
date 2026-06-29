<script lang="ts">
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	import { resolve } from '$app/paths';
	import Event from '$lib/assets/svg/event.svelte';
	import type { GetRootObjectsQuery } from '$lib/graphql/generated';
	import ObjectHeader from './ObjectHeader.svelte';
	import CardStates from '../Card/CardStates.svelte';
	import Divider from '../shared/Divider.svelte';

	interface Props {
		object: GetRootObjectsQuery['rootEvents'][number]['object'];
	}

	const { object }: Props = $props();
	const { type, campus, name } = $derived(object);
	const states = $derived([
		{
			icon: GroupsIcon,
			text: 'Groups',
			value: object.groups_aggregate.aggregate?.count ?? 0
		},
		{
			icon: Event,
			text: 'Events',
			value: object.events_aggregate.aggregate?.count ?? 0
		}
	]);
</script>

<a href={resolve('/(app)/events/[objectId]', { objectId: object.id.toString() })}>
	<Card glow>
		<ObjectHeader {type} {campus} {name} />
		<Divider />
		<CardStates rows={states} />
	</Card>
</a>

<style>
	a {
		width: 100%;

		&:hover {
			display: block;
			border-radius: var(--card-radius);
			background: var(--primary);
		}
	}
</style>
