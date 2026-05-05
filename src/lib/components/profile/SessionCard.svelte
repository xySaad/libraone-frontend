<script lang="ts">
	import Clock from '$lib/assets/svg/clock.svelte';
	import type { LastSession } from '$lib/types/profile';
	import { formatDate, sessionDuration } from '$lib/utils/time';

	const { lastSession }: { lastSession: LastSession } = $props();
</script>

<div class="card card-session">
	<div class="card-title">
		<Clock />
		Last Session
	</div>

	<div class="session-grid">
		<div class="s-row">
			<span class="s-label">Start</span>
			<span class="s-val">{formatDate(lastSession.start)}</span>
		</div>

		<div class="s-row">
			<span class="s-label">End</span>
			<span class="s-val">{formatDate(lastSession.end)}</span>
		</div>

		<div class="s-row">
			<span class="s-label">Duration</span>
			<span class="s-val accent">{sessionDuration(lastSession.start, lastSession.end)}</span>
		</div>

		{#if lastSession.hostname}
			<div class="s-row">
				<span class="s-label">Host</span>
				<span class="s-val mono">{lastSession.hostname}</span>
			</div>
		{/if}

		{#if lastSession.ip_address}
			<div class="s-row">
				<span class="s-label">IP</span>
				<span class="s-val mono">{lastSession.ip_address}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.card {
		border-radius: 12px;
		background: hsla(215, 35%, 10%, 0.45);
		border: 1px solid hsla(215, 40%, 70%, 0.07);
		padding: 20px;
		backdrop-filter: blur(8px);
	}
	.card-title {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--text-muted);
		margin-bottom: 16px;
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.session-grid {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.s-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px;
	}
	.s-label {
		font-size: 0.72rem;
		color: var(--text-muted);
		white-space: nowrap;
	}
	.s-val {
		font-size: 0.82rem;
		color: var(--text-value);
		font-weight: 500;
		text-align: right;
	}
	.s-val.accent {
		color: hsl(210, 80%, 65%);
	}
	.s-val.mono {
		font-family: 'SF Mono', 'Fira Code', monospace;
		font-size: 0.77rem;
	}
</style>
