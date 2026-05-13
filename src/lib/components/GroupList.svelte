<script lang="ts">
	import { infiniteScroll } from '$lib/actions/infiniteScroll';
	import { Client } from '$lib/graphql/client';
	import {
		GetUserGroupsByIdDocument,
		GetUserGroupsByLoginDocument,
		type UserGroupFieldsFragment
	} from '$lib/graphql/generated';
	import { formatDate } from '$lib/utils/time';
	import UserAvatar from './image/UserAvatar.svelte';
	import { intraUserState } from '$lib/stores/user.svelte';
	import PartnerExchange from '$lib/assets/svg/partner-exchange.svelte';

	const { userId }: { userId: string } = $props();

	const LIMIT = 10;

	// ── data fetching ────────────────────────────────────────────────────
	const fetchPage = async (offset: number) => {
		const vars = { offset, limit: LIMIT };
		const params = Number.isInteger(+userId)
			? [GetUserGroupsByIdDocument, { userId: +userId, ...vars }]
			: [GetUserGroupsByLoginDocument, { userLogin: userId, ...vars }];

		const userGroups = await Client.request(...params);
		return userGroups.group_user;
	};

	let pages = $state<Promise<UserGroupFieldsFragment[]>[]>([]);
	let offset = 0;
	$effect(() => {
		offset = 0;
		pages = [fetchPage(0)];
	});
	function loadMore() {
		offset += LIMIT;
		pages.push(fetchPage(offset));
	}

	// ── helpers ──────────────────────────────────────────────────────────
	const projectName = (path: string) => path.split('/').filter(Boolean).pop() ?? path;
	const projectParent = (path: string) => {
		const parts = path.split('/').filter(Boolean);
		return parts.length > 1 ? parts.slice(0, -1).join('/') : null;
	};

	const copyAuditors = (group: UserGroupFieldsFragment['group']) => {
		const members = group.members.map((m) => '@' + m.user?.login);
		const auditors = group.auditors.filter((a) => !a.closedAt).map((a) => '- @' + a.auditor?.login);
		const startDate = new Date().toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit'
		});

		const text = `Project: ${group.path.split('/').slice(-1)}
Team Members: ${members.join(' ')}
Available between: ${startDate} - 19:00
Auditors:
${auditors.join('\n')}`;

		navigator.clipboard.writeText(text);
	};
</script>

<div class="groups-root">
	{#each pages as page (page)}
		{#await page}
			{#each { length: 3 } as _, i (i)}
				<div class="group-card skeleton" style="animation-delay: {i * 80}ms"></div>
			{/each}
		{:then groups}
			{#if groups.length > 0}
				<div class="sentinel" use:infiniteScroll={loadMore}></div>
			{/if}

			{#each groups as g (g.id)}
				{@const name = projectName(g.group.path)}
				{@const parent = projectParent(g.group.path)}
				{@const isCaptain = g.group.captainId === g.userId}
				{@const teammate =
					g.userId !== $intraUserState?.userId &&
					g.group.members.some((m) => m.user?.id === $intraUserState?.userId)}
				<article class="group-card">
					<div class="accent-bar"></div>

					<div class="card-body">
						<div class="card-header">
							<div class="title-block">
								{#if parent}
									<span class="parent-path">{parent}</span>
								{/if}
								<h3 class="project-name">{name}</h3>
							</div>

							<div class="badges">
								{#if isCaptain}
									<span class="badge badge-captain" data-tooltip="Group captain">⚑ Captain</span>
								{/if}
								{#if teammate}
									<span class="badge badge-captain" data-tooltip="You are a member">
										<PartnerExchange /> Teammate
									</span>
								{/if}
							</div>
						</div>

						<div class="members-row">
							<span class="row-label">
								Members
								<span class="member-count">
									({g.group.members.length})
								</span>
							</span>
							<div class="avatar-stack">
								{#each g.group.members.slice(0, 8) as m (m.id)}
									{#if m.user}
										<div
											class="avatar-chip"
											data-tooltip={m.user.login}
											class:is-captain={m.user.id === g.group.captainId}
										>
											<UserAvatar avatarUrl={m.user.avatarUrl} userLogin={m.user.login} />
										</div>
									{/if}
								{/each}
								{#if g.group.members.length > 8}
									<div class="avatar-chip avatar-overflow">
										+{g.group.members.length - 8}
									</div>
								{/if}
							</div>
						</div>

						{#if g.group.auditors.length === 0}
							<div class="no-audit">
								<span>No audits yet</span>
							</div>
						{:else}
							<div class="audit-section">
								<div class="audit-header">
									<span class="row-label">Auditors</span>
									<button class="copy" onclick={() => copyAuditors(g.group)}>copy</button>
								</div>
								{#each g.group.auditors as auditor (auditor.id)}
									{#if auditor.auditor}
										<div class="auditor-row">
											<div class="avatar" data-tooltip={auditor.auditor.login}>
												<UserAvatar
													avatarUrl={auditor.auditor.avatarUrl}
													userLogin={auditor.auditor.login}
												/>
											</div>
											<span class="audit-date">{auditor.closureType}</span>
											<span class="audit-date">{formatDate(auditor.closedAt)}</span>
										</div>
									{/if}
								{/each}
							</div>
						{/if}

						<!-- ── audit count summary ── -->
						{#if g.group.auditors.length > 1}
							<div class="audit-meta">
								{g.group.auditors.length} audit{g.group.auditors.length !== 1 ? 's' : ''} total
							</div>
						{/if}
					</div>
				</article>
			{/each}
		{:catch err}
			<p class="error-msg">Failed to load groups: {err.message}</p>
		{/await}
	{/each}
</div>

<style>
	.copy {
		margin-left: auto;
		padding: 4px 10px;
		border: 1px solid hsl(213, 40%, 20%);
		border-radius: 6px;
		background: hsl(213, 45%, 14%);
		color: #9fb3c8;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition:
			background 0.15s ease,
			border-color 0.15s ease,
			color 0.15s ease,
			transform 0.08s ease;
	}

	.copy:hover {
		background: hsl(213, 50%, 18%);
		border-color: hsl(213, 40%, 28%);
		color: #e8edf2;
	}

	.copy:active {
		transform: scale(0.96);
	}

	.copy:focus-visible {
		outline: 2px solid hsl(213, 80%, 55%);
		outline-offset: 2px;
	}
	/* ── layout ── */
	.groups-root {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.sentinel {
		width: 0;
		height: 0;
	}

	/* ── card ── */
	.group-card {
		position: relative;
		display: flex;
		border-radius: var(--border-radius-lg, 12px);
		border: 1px solid hsl(213, 40%, 18%);
		background: hsl(213, 60%, 10%);
		/* overflow: hidden; */
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.group-card:hover {
		background: hsl(213, 60%, 12%);
		border-color: hsl(213, 40%, 24%);
	}

	/* accent bar colour driven by audit result */
	.accent-bar {
		width: 3px;
		flex-shrink: 0;
		background: hsl(213, 40%, 28%);
	}

	.card-body {
		flex: 1;
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
	}

	/* ── header ── */
	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
	}

	.title-block {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.parent-path {
		font-size: 11px;
		color: #4e6278;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.project-name {
		font-size: 14px;
		font-weight: 600;
		color: #e8edf2;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: -0.01em;
	}

	/* ── badges ── */
	.badges {
		display: flex;
		gap: 5px;
		flex-shrink: 0;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-size: 10px;
		font-weight: 600;
		padding: 2px 7px;
		border-radius: 20px;
		white-space: nowrap;
	}

	.badge-captain {
		background: hsl(45, 70%, 12%);
		color: hsl(45, 85%, 65%);
		border: 1px solid hsl(45, 60%, 22%);
		cursor: default;
	}

	/* ── members ── */
	.members-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.row-label {
		font-size: 10px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: #4e6278;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.avatar-stack {
		display: flex;
		flex-direction: row-reverse;
		margin-left: 4px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.avatar {
		width: 50px;
		height: 50px;
	}
	.avatar,
	.avatar-chip {
		:global(img) {
			/* background: hsl(213, 40%, 18%); */
			border: 2px solid hsl(213, 60%, 10%);
			border-radius: 50%;
			overflow: hidden;
			aspect-ratio: 1/1;
			object-fit: cover;
		}
	}
	.avatar-chip {
		width: 50px;
		height: 50px;

		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: -8px;
		flex-shrink: 0;
		cursor: default;
	}

	.avatar-chip.is-captain {
		:global(img) {
			border-color: hsl(45, 80%, 50%);
		}
	}

	.avatar-overflow {
		font-size: 9px;
		font-weight: 700;
		color: #6b7f96;
		background: hsl(213, 40%, 15%);
	}

	.member-count {
		font-size: 11px;
		color: #6b7f96;
		margin-left: 4px;
	}

	/* ── audit ── */
	.audit-section {
		border-radius: 8px;
		padding: 10px 12px;
		background: hsl(213, 40%, 8%);
		border: 1px solid hsl(213, 40%, 16%);
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.audit-header {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.audit-date {
		font-size: 11px;
		color: #4e6278;
		margin-left: auto;
	}

	.auditor-row {
		display: flex;
		align-items: center;
		gap: 7px;
	}

	.no-audit {
		font-size: 11px;
		color: #4e6278;
		padding: 4px 0;
	}

	.audit-meta {
		font-size: 11px;
		color: #4e6278;
		text-align: right;
	}

	/* ── skeleton ── */
	.group-card.skeleton {
		height: 120px;
		background: hsla(213, 40%, 10%, 0.7);
		border-color: hsl(213, 40%, 14%);
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

	/* ── error ── */
	.error-msg {
		font-size: 12px;
		color: #f87171;
		padding: 8px 0;
	}
</style>
