<script lang="ts">
	import { infiniteScroll } from '$lib/actions/infiniteScroll';
	import { Client } from '$lib/graphql/client';
	import {
		GetPendingUserGroupsByIdDocument,
		GetPendingUserGroupsByLoginDocument,
		GetUserGroupsByIdDocument,
		GetUserGroupsByLoginDocument,
		type UserGroupFieldsFragment
	} from '$lib/graphql/generated';
	import { intraUserState } from '$lib/stores/user.svelte';
	import GroupCard from '$lib/components/group/GroupCard.svelte';

	const { userId }: { userId: string } = $props();

	const LIMIT = 10;

	// true = accepted, null = pending, false = ignored
	let activeFilter = $state<boolean | null>(true);

	const isById = () => Number.isInteger(+userId);

	const fetchPage = async (offset: number, filter: boolean | null) => {
		const vars = { offset, limit: LIMIT };

		if (filter === null) {
			const params = isById()
				? [GetPendingUserGroupsByIdDocument, { userId: +userId, ...vars }]
				: [GetPendingUserGroupsByLoginDocument, { userLogin: userId, ...vars }];
			const res = await Client.request(...params);
			return res.group_user;
		}

		const params = isById()
			? [GetUserGroupsByIdDocument, { userId: +userId, accepted: filter, ...vars }]
			: [GetUserGroupsByLoginDocument, { userLogin: userId, accepted: filter, ...vars }];
		const res = await Client.request(...params);
		return res.group_user;
	};

	let pages = $state<Promise<UserGroupFieldsFragment[]>[]>([]);
	let offset = 0;

	$effect(() => {
		offset = 0;
		pages = [fetchPage(0, activeFilter)];
	});

	function loadMore() {
		offset += LIMIT;
		pages.push(fetchPage(offset, activeFilter));
	}
</script>

<div class="groups-root">
	<div class="filter-bar" role="tablist" aria-label="Group membership filter">
		<button
			role="tab"
			class="filter-btn"
			class:active={activeFilter === true}
			aria-selected={activeFilter === true}
			onclick={() => (activeFilter = true)}
		>
			<span class="filter-dot accepted-dot"></span>
			Accepted
		</button>
		<button
			role="tab"
			class="filter-btn"
			class:active={activeFilter === null}
			aria-selected={activeFilter === null}
			onclick={() => (activeFilter = null)}
		>
			<span class="filter-dot pending-dot"></span>
			Pending
		</button>
		<button
			role="tab"
			class="filter-btn"
			class:active={activeFilter === false}
			aria-selected={activeFilter === false}
			onclick={() => (activeFilter = false)}
		>
			<span class="filter-dot ignored-dot"></span>
			Ignored
		</button>
	</div>

	{#each pages as page (page)}
		{#await page}
			{#each { length: 3 } as _, i (i)}
				<div class="group-card skeleton" style="animation-delay: {i * 80}ms"></div>
			{/each}
		{:then groups}
			{#if groups.length > 0}
				<div class="sentinel" use:infiniteScroll={loadMore}></div>
			{/if}
			{#each groups as userGroup (userGroup.id)}
				<GroupCard {userGroup} intraUserId={$intraUserState?.userId} />
			{/each}
		{:catch err}
			<p class="error-msg">Failed to load groups: {err.message}</p>
		{/await}
	{/each}
</div>

<style>
	.groups-root {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.filter-bar {
		display: flex;
		gap: 4px;
		padding-bottom: 4px;
	}

	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 12px;
		border-radius: 6px;
		border: 1px solid transparent;
		background: transparent;
		color: var(--text-muted);
		font-size: 12px;
		font-weight: 500;
		font-family: 'Inter Variable', sans-serif;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition:
			background 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.filter-btn:hover:not(.active) {
		background: var(--secondary);
		color: var(--text-value);
		border-color: hsla(215, 40%, 70%, 0.08);
	}

	.filter-btn.active {
		background: var(--secondary);
		color: var(--text-primary);
		border-color: hsla(215, 40%, 70%, 0.12);
	}

	.filter-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
		opacity: 0.85;
	}

	.accepted-dot {
		background: hsl(142, 50%, 42%);
	}
	.pending-dot {
		background: hsl(38, 75%, 52%);
	}
	.ignored-dot {
		background: hsl(0, 55%, 48%);
	}

	.sentinel {
		width: 0;
		height: 0;
	}

	.group-card.skeleton {
		height: 120px;
		border-radius: var(--border-radius-lg, 12px);
		border: 1px solid hsla(215, 40%, 70%, 0.08);
		background: var(--secondary);
		animation: pulse 1.4s ease infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.4;
		}
		50% {
			opacity: 0.75;
		}
	}

	.error-msg {
		font-size: 12px;
		color: #f87171;
		padding: 8px 0;
	}
</style>
