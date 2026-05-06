<script lang="ts">
	import { fmtSeconds, monthLabel } from '$lib/utils/time';

	interface Props {
		months: [string, { total: number; logtime: Record<string, number> }][];
		maxTotal: number;
	}

	const { months, maxTotal }: Props = $props();
</script>

<div class="chart-viewport">
	<div class="bar-chart">
		{#each months as [key, data] (key)}
			{@const pct = (data.total / maxTotal) * 100}
			<div class="bar-col">
				<div class="bar-label-top">{pct > 0 ? fmtSeconds(data.total) : ''}</div>
				<div class="bar-track">
					<div class="bar-fill" style="height: {pct}%" data-tooltip={fmtSeconds(data.total)}></div>
				</div>
				<div class="bar-label">{monthLabel(key)}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.chart-viewport {
		overflow-x: auto;
		padding-top: 40px;
	}
	.bar-chart {
		display: flex;
		align-items: flex-end;
		gap: 10px;
		height: 210px;
		padding-bottom: 10px;
	}
	.bar-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}
	.bar-label-top {
		font-size: 0.56rem;
		color: var(--text-muted);
		margin-bottom: 3px;
		height: 14px;
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	.bar-track {
		flex: 1;
		width: 100%;
		display: flex;
		align-items: flex-end;
		border-radius: 4px;
	}
	.bar-fill {
		width: 100%;
		min-height: 5px;
		background: linear-gradient(to top, hsl(213, 70%, 40%), hsl(210, 80%, 55%));
		border-radius: 4px 4px 0 0;
		transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 0.85;
	}
	.bar-fill:hover {
		opacity: 1;
	}
	.bar-label {
		margin-top: 6px;
		font-size: 0.62rem;
		color: var(--text-muted);
	}
</style>
