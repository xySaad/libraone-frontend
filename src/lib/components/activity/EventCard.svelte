<script lang="ts">
	import { resolve } from '$app/paths';
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import Login from '$lib/assets/svg/login.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import type { GetObjectEventsQuery } from '$lib/graphql/generated';
	import CardStates from '../Card/CardStates.svelte';
	import type { StatesRow } from '../Card/types';
	import Divider from '../shared/Divider.svelte';
	import EventHeader from './EventHeader.svelte';

	interface Props {
		event: GetObjectEventsQuery['object'][number]['events'][number];
		objectId: number;
	}

	const { event, objectId }: Props = $props();

	const states: StatesRow[] = $derived([
		{
			icon: GroupsIcon,
			text: 'Registrations',
			value: event.registrations_aggregate.aggregate?.count ?? 0
		},
		{
			icon: Login,
			text: 'Users',
			value: event.users_aggregate.aggregate?.count ?? 0
		}
	]);
</script>

<a
	href={resolve('/(app)/events/[objectId]/[eventId]', {
		eventId: event.id.toString(),
		objectId: objectId.toString()
	})}
>
	<Card glow>
		<EventHeader campus={event.campus ?? '-'} endAt={event.endAt} startAt={event.startAt} />

		{#if event.description}
			<Divider />
			<p class="description">{event.description}</p>
		{/if}

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

		.description {
			font-size: var(--subtitle-font-size);
			line-height: 1.65;
			color: var(--text-muted);
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
			margin: 0;
		}
	}
</style>
