<script lang="ts">
	import { infiniteScroll } from '$lib/actions/infiniteScroll';
	import { getEventUsers } from '$lib/api/events';
	import FilterControls from '$lib/components/FilterControls.svelte';
	import UserCard from '$lib/components/UserCard.svelte';

	const { eventId }: { eventId: number } = $props();
	const sortOptions = [
		{ key: 'createdAt', label: 'Joined' },
		{ key: 'level', label: 'Level' },
		{ key: 'userAuditRatio', label: 'Audit' }
		// ,{ key: 'available', label: 'Available' }
	];
	const limit = 20;

	let search = $state('');
	let sortKey = $state('createdAt');
	let sortDir = $state<'desc' | 'asc'>('desc');
	let eventUsersPromiseList = $state<ReturnType<typeof getEventUsers>[]>([]);

	let offset = $state(0);
	$effect(() => {
		offset = 0;
		eventUsersPromiseList = [
			getEventUsers(eventId, { orderBy: { [sortKey]: sortDir }, limit, offset: 0, search })
		];
	});

	function handleScroll() {
		offset += limit;
		eventUsersPromiseList.push(
			getEventUsers(eventId, { orderBy: { [sortKey]: sortDir }, limit, offset, search })
		);
	}
</script>

<div class="filter">
	<FilterControls bind:search bind:sortDir bind:sortKey {sortOptions} />
</div>

<div class="usersList">
	{#each eventUsersPromiseList as eventUsersPromise (eventUsersPromise)}
		{#await eventUsersPromise}
			loading...
		{:then eventUsers}
			{#if eventUsers.length > 0}
				<div class="sentinel" use:infiniteScroll={handleScroll}></div>
			{/if}
			{#each eventUsers as eventUser (eventUser.userId)}
				<UserCard user={eventUser.publicUser} eventUserRel={eventUser} />
			{/each}
		{/await}
	{/each}
</div>

<style>
	.filter {
		display: flex;
		gap: 10px;
		margin-right: auto;
		margin-left: 20px;
	}
	.sentinel {
		width: 0;
		height: 0;
	}

	.usersList {
		overflow: auto;
		padding: 20px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 16px;
		align-items: stretch;
	}
</style>
