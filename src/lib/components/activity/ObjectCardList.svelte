<script lang="ts">
	import ObjectCard from '$lib/components/activity/ObjectCard.svelte';
	import FlexContainer from '$lib/components/ui/Flex/FlexContainer.svelte';
	import FlexItem from '$lib/components/ui/Flex/FlexItem.svelte';
	import type { ObjectOverviewFragment } from '$lib/graphql/generated';

	interface Props {
		objectList: ObjectOverviewFragment[];
	}

	const { objectList }: Props = $props();
</script>

<div class="objectChildren">
	<FlexContainer minWidth={300} gap="16px" justifyContent="center">
		{#each objectList as object (object.id)}
			<FlexItem>
				<div class="card">
					<ObjectCard {object} />
				</div>
			</FlexItem>
		{/each}
	</FlexContainer>
</div>

<style>
	.objectChildren {
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}
</style>
