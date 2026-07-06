<script lang="ts">
	import EventCard from '$lib/components/activity/EventCard.svelte';
	import ObjectCard from '$lib/components/activity/ObjectCard.svelte';
	import ObjectHeader from '$lib/components/activity/ObjectHeader.svelte';
	import GroupCard from '$lib/components/group/GroupCard.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import FlexContainer from '$lib/components/ui/Flex/FlexContainer.svelte';
	import FlexItem from '$lib/components/ui/Flex/FlexItem.svelte';
	import List from '$lib/components/ui/List.svelte';
	import TabsContainer from '$lib/components/ui/Tabs/TabsContainer.svelte';
	import { Client } from '$lib/graphql/client';
	import {
		GetObjectChildrenDocument,
		GetObjectEventsDocument,
		GetObjectGroupsDocument,
		GetObjectOverviewDocument
	} from '$lib/graphql/generated';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

	const getObjectOverview = async () => {
		const { object } = await Client.request(GetObjectOverviewDocument, {
			objectId: +params.objectId
		});
		return object[0];
	};
	const getObjectChildren = async () => {
		const { object } = await Client.request(GetObjectChildrenDocument, {
			objectId: +params.objectId
		});
		return object[0].childrenRelation.map((o) => o.child);
	};

	const getObjectData = async () => {
		const overview = await getObjectOverview();
		const children = await getObjectChildren();
		return { overview, children };
	};

	const getObjectEvents = async () => {
		const { object } = await Client.request(GetObjectEventsDocument, {
			objectId: +params.objectId
		});
		return object[0].events;
	};

	const getObjectGroup = async () => {
		const { object } = await Client.request(GetObjectGroupsDocument, {
			objectId: +params.objectId
		});
		return object[0].groups;
	};
</script>

<article>
	<Suspend data={getObjectData()} loading="kerby">
		{#snippet children({ children, overview })}
			{@const { type, name, campus, events_aggregate, groups_aggregate } = overview}
			{@const eventsCount = events_aggregate.aggregate?.count ?? 0}
			{@const groupsCount = groups_aggregate.aggregate?.count ?? 0}

			<section>
				<ObjectHeader {campus} {name} {type} />
			</section>

			<TabsContainer
				hidden={{
					Content: children.length < 1,
					Events: eventsCount < 1,
					Groups: groupsCount < 1
				}}
			>
				{#snippet NavContent()}
					content
					<Badge>{children.length}</Badge>
				{/snippet}
				{#snippet Content()}
					<List items={children}>
						{#snippet Item(object)}
							<ObjectCard {object} />
						{/snippet}
					</List>
				{/snippet}

				{#snippet NavEvents()}
					events
					<Badge>{eventsCount}</Badge>
				{/snippet}
				{#snippet Events()}
					<div class="events">
						<Suspend data={getObjectEvents()}>
							{#snippet children(events)}
								<FlexContainer gap="10px" minWidth={300}>
									{#each events as event (event.id)}
										<FlexItem>
											<EventCard {event} objectId={overview.id} />
										</FlexItem>
									{/each}
								</FlexContainer>
							{/snippet}
						</Suspend>
					</div>
				{/snippet}

				{#snippet NavGroups()}
					groups
					<Badge>{groupsCount}</Badge>
				{/snippet}
				{#snippet Groups()}
					<Suspend data={getObjectGroup()}>
						{#snippet children(groups)}
							<List items={groups}>
								{#snippet Item(group)}
									<GroupCard {group} title="{group.captain?.login}'s group" />
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
		display: flex;

		overflow-y: scroll;
		overflow-x: hidden;

		.events {
			display: flex;
			justify-content: center;
		}
	}
</style>
