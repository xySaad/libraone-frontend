<script lang="ts">
	import type { StatesRow } from './types';

	const { rows }: { rows: StatesRow[] } = $props();
</script>

<div class="card-stats">
	{#each rows as row (row)}
		<div class="stat-row">
			<row.icon />
			<span class="stat-label">{row.text}</span>
			<span class="stat-value">{row.value}</span>
		</div>
	{/each}
</div>

<style>
	.card-stats {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;

		.stat-row {
			width: 100%;
			display: flex;
			align-items: center;
			gap: 8px;

			.stat-label {
				font-size: var(--subtitle-font-size);
				color: var(--text-muted);
				flex: 1;
				letter-spacing: 0.05em;
			}

			.stat-value {
				font-size: 0.875rem;
				font-weight: 600;
				color: var(--text-value);
			}
		}
	}
</style>
