<script lang="ts" generics="T extends unknown">
	import FlexContainer from '$lib/components/ui/Flex/FlexContainer.svelte';
	import FlexItem from '$lib/components/ui/Flex/FlexItem.svelte';
	import type { GetObjectGroupsQuery } from '$lib/graphql/generated';
	import GroupCard from './GroupCard.svelte';
	type Group = T extends GetObjectGroupsQuery['object'][number]['groups'][number] ? T : never;

	interface Props {
		groups: Group[];
		title?: (group: Group) => string;
	}

	const { groups, title }: Props = $props();
</script>

<FlexContainer minWidth={300} gap="16px" justifyContent="center">
	{#each groups as group (group.id)}
		<FlexItem>
			<GroupCard {group} title={title?.(group)} />
		</FlexItem>
	{/each}
</FlexContainer>
