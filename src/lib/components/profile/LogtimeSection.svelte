<script lang="ts">
	import Grid from '$lib/assets/svg/grid.svelte';
	import type { LogtimeData } from '$lib/types/profile';
	import LogtimeBars from './LogtimeBars.svelte';
	import LogtimeHeatmaps from './LogtimeHeatmaps.svelte';

	interface Props {
		logtime: LogtimeData;
	}

	const { logtime }: Props = $props();
	let view: 'bars' | 'heatmaps' = $state('bars');

	const months = $derived(
		Object.entries(logtime) as [string, { total: number; logtime: Record<string, number> }][]
	);

	const maxTotal = $derived(Math.max(...months.map(([, v]) => v.total), 1));
</script>

<section class="logtime-section">
	<div class="section-header">
		<Grid />
		Logtime Overview
		<div class="view-switcher">
			<button class:active={view === 'bars'} onclick={() => (view = 'bars')}>Bars</button>
			<button class:active={view === 'heatmaps'} onclick={() => (view = 'heatmaps')}
				>Heatmaps</button
			>
		</div>
	</div>

	{#if view === 'bars'}
		<LogtimeBars {months} {maxTotal} />
	{:else}
		<LogtimeHeatmaps {months} />
	{/if}
</section>

<style>
	.logtime-section {
		border-radius: 14px;
		background: hsla(215, 35%, 10%, 0.45);
		border: 1px solid hsla(215, 40%, 70%, 0.07);
		padding: 24px;
		backdrop-filter: blur(8px);
	}
	.section-header {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--text-muted);
		margin-bottom: 14px;
	}

	.view-switcher {
		display: inline-flex;
		gap: 6px;
		padding: 4px;
		border-radius: 999px;
		background: hsla(215, 35%, 10%, 0.35);
		border: 1px solid hsla(215, 40%, 70%, 0.07);
	}
	.view-switcher button {
		border: 0;
		background: transparent;
		color: var(--text-muted);
		font-size: 0.7rem;
		font-weight: 600;
		padding: 6px 12px;
		border-radius: 999px;
		cursor: pointer;
	}
	.view-switcher button.active {
		background: hsla(210, 80%, 55%, 0.16);
		color: hsl(210, 80%, 65%);
	}
</style>
