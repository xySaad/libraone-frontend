<script lang="ts">
	import GroupsIcon from '$lib/assets/svg/groups.svelte';
	import Login from '$lib/assets/svg/login.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import type { GetEventRgistrationsQuery } from '$lib/graphql/generated';
	import CardDescription from '../Card/CardDescription.svelte';
	import CardStates from '../Card/CardStates.svelte';
	import type { StatesRow } from '../Card/types';
	import Divider from '../shared/Divider.svelte';
	import Badge from '../ui/Badge.svelte';
	import EventHeader from './EventHeader.svelte';

	export type RegistrationItem = NonNullable<
		NonNullable<GetEventRgistrationsQuery['event_by_pk']>['registrations']
	>[number];

	interface Props {
		registration: RegistrationItem;
	}

	const { registration }: Props = $props();

	const label = $derived(registration.label?.name ?? registration.labelName);

	const states: StatesRow[] = $derived([
		{
			icon: GroupsIcon,
			text: 'Capacity',
			value: registration.capacity
		},
		{
			icon: Login,
			text: 'Users',
			value: registration.users_aggregate?.aggregate?.count ?? 0
		}
	]);
</script>

<Card glow>
	<EventHeader
		campus={registration.campus ?? '-'}
		endAt={registration.endAt}
		startAt={registration.startAt}
	/>

	{#if registration.label?.description}
		<Divider />
		<CardDescription>{registration.label.description}</CardDescription>
	{/if}

	<Divider />
	<CardStates rows={states} />
	<Divider />
	<Badge tooltip="label">{label}</Badge>
</Card>
