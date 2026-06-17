<script lang="ts">
	import api from '$lib/api';
	import UserAvatar from '$lib/components/image/UserAvatar.svelte';
	import { formatDateInput } from '$lib/utils/time';

	// Default to current month
	const now = new Date();
	const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

	let start = $state(formatDateInput(firstOfMonth));
	let end = $state(formatDateInput(lastOfMonth));

	const leaderboardPromise = $derived(api.CAMPUS.leaderboard({ start, end }));

	const maxValue = $derived.by(async () => {
		const data = await leaderboardPromise;
		return Math.max(...data.map((u) => u.value), 1);
	});

	function fmtHours(seconds: number) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		if (h === 0) return `${m}m`;
		if (m === 0) return `${h}h`;
		return `${h}h ${m}m`;
	}

	const MEDAL = ['🥇', '🥈', '🥉'];
	const RANK_COLOR = ['hsl(45, 85%, 58%)', 'hsl(210, 15%, 65%)', 'hsl(24, 70%, 52%)'];
</script>

<div class="lb-root">
	<!-- Header bar -->
	<div class="lb-header">
		<div class="lb-title">
			<span class="trophy">🏆</span>
			<h1>Leaderboard</h1>
		</div>

		<div class="lb-controls">
			<div class="date-group">
				<label class="ctrl-label" for="start-date">From</label>
				<input id="start-date" class="date-input" type="date" bind:value={start} max={end} />
			</div>
			<div class="range-sep">→</div>
			<div class="date-group">
				<label class="ctrl-label" for="end-date">To</label>
				<input id="end-date" class="date-input" type="date" bind:value={end} min={start} />
			</div>
		</div>
	</div>

	<!-- Cohort pills -->
	<!-- {#await cohorts then cohortList}
		{#if cohortList.length > 2}
			<div class="cohort-bar" role="group" aria-label="Filter by cohort">
				{#each cohortList as c (c)}
					<button
						class="cohort-pill"
						class:active={selectedCohort === c}
						onclick={() => (selectedCohort = c)}
					>
						{c === 'all' ? 'All cohorts' : c}
					</button>
				{/each}
			</div>
		{/if}
	{/await} -->

	<!-- Leaderboard table -->
	{#await leaderboardPromise}
		<div class="lb-loading">
			{#each { length: 10 } as _, i (i)}
				<div class="row-skeleton" style="animation-delay: {i * 60}ms"></div>
			{/each}
		</div>
	{:then users}
		{#if users.length === 0}
			<div class="lb-empty">
				<span class="empty-icon">📭</span>
				<p>No data for this period</p>
			</div>
		{:else}
			<!-- Top 3 podium -->
			{#if users.length >= 3}
				<div class="podium">
					{#each [1, 0, 2] as podiumIdx (podiumIdx)}
						{@const u = users[podiumIdx]}
						{@const rank = podiumIdx + 1}
						<div class="podium-slot" data-rank={rank} style="--rank-color: {RANK_COLOR[podiumIdx]}">
							<div class="podium-avatar">
								<span class="podium-medal">{MEDAL[podiumIdx]}</span>
								<div class="podium-initials">
									<UserAvatar userLogin={u.username} />
								</div>
							</div>
							<div class="podium-name">{u.username}</div>
							<div class="podium-cohort">{u.cohort}</div>
							<div class="podium-value">{fmtHours(u.value)}</div>
							<div class="podium-plinth" data-rank={rank}></div>
						</div>
					{/each}
				</div>
			{/if}

			<!-- Full list -->
			{#await maxValue then max}
				<div class="lb-list">
					{#each users as user, i (user.username)}
						{@const rank = i + 1}
						{@const pct = (user.value / max) * 100}
						{@const isTop3 = rank <= 3}
						<div class="lb-row" class:top3={isTop3} style="animation-delay: {i * 30}ms">
							<div class="lb-rank" style={isTop3 ? `color: ${RANK_COLOR[rank - 1]}` : ''}>
								{#if isTop3}
									{MEDAL[rank - 1]}
								{:else}
									<span class="rank-num">{rank}</span>
								{/if}
							</div>

							<div class="lb-avatar">
								<UserAvatar userLogin={user.username} />
							</div>

							<div class="lb-info">
								<div class="lb-username">{user.username}</div>
								<div class="lb-cohort">{user.cohort}</div>
							</div>

							<div class="lb-bar-wrap">
								<div
									class="lb-bar-fill"
									style="width: {pct}%; background: {isTop3
										? RANK_COLOR[rank - 1]
										: 'hsl(213, 60%, 40%)'}"
								></div>
							</div>

							<div class="lb-value" style={isTop3 ? `color: ${RANK_COLOR[rank - 1]}` : ''}>
								{fmtHours(user.value)}
							</div>
						</div>
					{/each}
				</div>
			{/await}
		{/if}
	{:catch}
		<div class="lb-empty">
			<span class="empty-icon">⚠️</span>
			<p>Failed to load leaderboard</p>
		</div>
	{/await}
</div>

<style>
	.lb-root {
		padding: 24px 32px;
		max-width: 860px;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
		overflow: auto;
		animation: fade-up 0.35s ease both;
	}

	/* ── Header ── */
	.lb-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 16px;
	}

	.lb-title {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.trophy {
		font-size: 1.5rem;
		line-height: 1;
	}

	h1 {
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-primary);
		margin: 0;
	}

	.lb-controls {
		display: flex;
		align-items: center;
		gap: 8px;
		background: hsla(213, 40%, 10%, 0.8);
		border: 1px solid hsl(213, 40%, 18%);
		border-radius: 12px;
		padding: 8px 14px;
	}

	.date-group {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.ctrl-label {
		font-size: 0.62rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
	}

	.date-input {
		background: transparent;
		border: none;
		color: var(--text-primary);
		font-size: 0.82rem;
		font-weight: 500;
		padding: 0;
		cursor: pointer;
		outline: none;
		color-scheme: dark;
		width: 130px;
	}

	.date-input:focus {
		color: hsl(210, 80%, 72%);
	}

	.range-sep {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin: 0 4px;
		padding-top: 14px;
	}

	/* ── Podium ── */
	.podium {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 8px;
		padding: 20px 0 0;
	}

	.podium-slot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		flex: 1;
		max-width: 180px;
	}

	.podium-avatar {
		position: relative;
		width: 52px;
		height: 52px;
	}

	.podium-medal {
		position: absolute;
		top: -10px;
		right: -10px;
		font-size: 1.2rem;
		z-index: 1;
	}

	.podium-initials {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		background: hsl(213, 45%, 14%);
		border: 2px solid var(--rank-color, hsl(213, 40%, 28%));
		color: var(--rank-color, var(--text-value));
		box-shadow: 0 0 16px color-mix(in srgb, var(--rank-color, transparent) 30%, transparent);
		overflow: hidden;
	}

	.podium-name {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
		max-width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.podium-cohort {
		font-size: 0.65rem;
		color: var(--text-muted);
		text-align: center;
		max-width: 110px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.podium-value {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--rank-color, var(--text-value));
	}

	.podium-plinth {
		width: 100%;
		border-radius: 8px 8px 0 0;
		background: linear-gradient(
			to bottom,
			color-mix(in srgb, var(--rank-color, hsl(213, 40%, 18%)) 20%, hsl(213, 50%, 10%)),
			hsl(213, 50%, 8%)
		);
		border: 1px solid color-mix(in srgb, var(--rank-color, hsl(213, 40%, 18%)) 30%, transparent);
		border-bottom: none;
	}

	.podium-plinth[data-rank='1'] {
		height: 72px;
	}
	.podium-plinth[data-rank='2'] {
		height: 52px;
	}
	.podium-plinth[data-rank='3'] {
		height: 36px;
	}

	/* ── List ── */
	.lb-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.lb-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 14px;
		border-radius: 10px;
		border: 1px solid hsl(213, 40%, 16%);
		background: hsl(213, 55%, 9%);
		transition:
			border-color 0.15s,
			background 0.15s;
		animation: fade-up 0.3s ease both;
	}

	.lb-row:hover {
		background: hsl(213, 55%, 11%);
		border-color: hsl(213, 40%, 22%);
	}

	.lb-row.top3 {
		background: hsl(213, 55%, 10%);
	}

	.lb-rank {
		width: 28px;
		text-align: center;
		font-size: 1rem;
		flex-shrink: 0;
	}

	.rank-num {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.lb-avatar {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: hsl(213, 45%, 14%);
		border: 1px solid hsl(213, 40%, 22%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.65rem;
		font-weight: 700;
		color: hsl(210, 30%, 60%);
		flex-shrink: 0;
		letter-spacing: 0.03em;
		overflow: hidden;
	}

	.lb-info {
		min-width: 0;
		flex: 0 0 160px;
	}

	.lb-username {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lb-cohort {
		font-size: 0.68rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.lb-bar-wrap {
		flex: 1;
		height: 5px;
		background: hsl(213, 40%, 14%);
		border-radius: 3px;
		overflow: hidden;
	}

	.lb-bar-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0.75;
	}

	.lb-value {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-value);
		text-align: right;
		flex: 0 0 56px;
		white-space: nowrap;
	}

	/* ── Loading skeleton ── */
	.lb-loading {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.row-skeleton {
		height: 56px;
		border-radius: 10px;
		background: hsl(213, 40%, 10%);
		animation: pulse 1.4s ease infinite;
	}

	/* ── Empty state ── */
	.lb-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 60px;
		color: var(--text-muted);
	}

	.empty-icon {
		font-size: 2.2rem;
		opacity: 0.5;
	}

	.lb-empty p {
		font-size: 0.9rem;
		margin: 0;
	}

	/* ── Animations ── */
	@keyframes pulse {
		0%,
		100% {
			opacity: 0.35;
		}
		50% {
			opacity: 0.65;
		}
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
