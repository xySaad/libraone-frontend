<script lang="ts">
	import ObjectCardList from '$lib/components/activity/ObjectCardList.svelte';
	import Suspend from '$lib/components/shared/Suspend.svelte';
	import { Client } from '$lib/graphql/client';
	import { GetRootObjectsDocument } from '$lib/graphql/generated';

	const getRootEvents = async () => {
		const { rootEvents } = await Client.request(GetRootObjectsDocument);
		return rootEvents.map((e) => e.object);
	};
</script>

<article>
	<Suspend data={getRootEvents()} loading="kerby">
		{#snippet children(object)}
			<ObjectCardList objectList={object} />
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
	}
</style>
