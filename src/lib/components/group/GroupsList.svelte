<script lang="ts" generics="T extends unknown">
	import FlexContainer from '$lib/components/ui/Flex/FlexContainer.svelte';
	import FlexItem from '$lib/components/ui/Flex/FlexItem.svelte';
	import type { GetObjectGroupsQuery } from '$lib/graphql/generated';
	import Divider from '../shared/Divider.svelte';
	import Wordmark from '../shared/Wordmark.svelte';
	import Input from '../ui/Input.svelte';
	import GroupCard from './GroupCard.svelte';
	type Group = T extends GetObjectGroupsQuery['object'][number]['groups'][number] ? T : never;

	interface Props {
		groups: Group[];
		title?: (group: Group) => string;
	}

	const { groups, title }: Props = $props();
	let value = $state('');

	const getFiltredUsers = () =>
		groups.filter(
			(g) =>
				title?.(g).includes(value) ||
				g.members.findIndex((m) => m.user?.login?.includes(value)) !== -1
		);
</script>

<div class="list">
	<Divider>
		<Wordmark>Search</Wordmark>
	</Divider>

	<span>
		<Input
			name="group-search"
			id="group-search"
			type="text"
			placeholder="srm, go-reloaded"
			bind:value
		/>
	</span>
	<Divider>
		<Wordmark>Groups</Wordmark>
	</Divider>
	<FlexContainer minWidth={300} gap="16px" justifyContent="center">
		{#each getFiltredUsers() as group (group.id)}
			<FlexItem>
				<GroupCard {group} title={title?.(group)} />
			</FlexItem>
		{/each}
	</FlexContainer>
</div>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 20px;

		span {
			width: clamp(280px, 80%, 600px);
			margin: auto;
		}
	}
</style>
