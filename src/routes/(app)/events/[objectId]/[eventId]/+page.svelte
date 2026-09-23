<script lang="ts">
	import { resolve } from '$app/paths';
	import RegistrationCard from '$lib/components/activity/RegistrationCard.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import List from '$lib/components/ui/List.svelte';
	import TabsContainer from '$lib/components/ui/Tabs/TabsContainer.svelte';
	import UserCard from '$lib/components/UserCard.svelte';
	import { Client } from '$lib/graphql/client';
	import {
		GetEventOverviewDocument,
		GetEventRgistrationsDocument,
		GetEventUsersDocument
	} from '$lib/graphql/generated';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();
	const eventId = $derived(params.eventId);
	const objectId = $derived(params.objectId);

	const getEventOverview = async (id: number) => {
		const { event_by_pk } = await Client.request(GetEventOverviewDocument, { id });
		return event_by_pk;
	};

	const getEventUsersRel = async (id: number) => {
		const { event_by_pk } = await Client.request(GetEventUsersDocument, { id });
		return event_by_pk?.usersRelation ?? [];
	};

	const getEventRegistrations = async (id: number) => {
		const { event_by_pk } = await Client.request(GetEventRgistrationsDocument, { id });
		return event_by_pk?.registrations ?? [];
	};
</script>

<article>
	<Suspend data={getEventOverview(+eventId)}>
		{#snippet children(event)}
			<TabsContainer>
				{#snippet NavUsers()}
					users ({event?.users_aggregate.aggregate?.count})
				{/snippet}
				{#snippet Users()}
					<Suspend data={getEventUsersRel(+eventId)}>
						{#snippet children(eventUsersRel)}
							<List items={eventUsersRel}>
								{#snippet Item(eventUserRel)}
									{#if eventUserRel.publicUser}
										<UserCard {eventUserRel} user={eventUserRel.publicUser} />
									{/if}
								{/snippet}
							</List>
						{/snippet}
					</Suspend>
				{/snippet}

				{#snippet NavRegistrations()}
					registrations ({event?.registrations_aggregate.aggregate?.count})
				{/snippet}
				{#snippet Registrations()}
					<Suspend data={getEventRegistrations(+eventId)}>
						{#snippet children(registrations)}
							<List items={registrations}>
								{#snippet Item(registration)}
									<a
										href={resolve('/(app)/events/[objectId]/[eventId]/[registrationId]', {
											eventId: eventId,
											objectId: objectId,
											registrationId: registration.id.toString()
										})}
									>
										<RegistrationCard {registration} />
									</a>
								{/snippet}
							</List>
						{/snippet}
					</Suspend>
				{/snippet}
			</TabsContainer>
		{/snippet}
	</Suspend>
</article>

<style>
	article {
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 20px;

		overflow-y: scroll;
		overflow-x: hidden;

		a {
			display: block;
			height: 100%;
			width: 100%;
			&:hover {
				border-radius: var(--card-radius);
				background: var(--primary);
			}
		}
	}
</style>
