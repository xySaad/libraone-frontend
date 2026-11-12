<script lang="ts">
	import { Maximize, Move } from '@lucide/svelte';

	interface Props {
		interactive: boolean;
		atHome: boolean;
		ontoggle: () => void;
		onreset: () => void;
	}

	let { interactive, atHome, ontoggle, onreset }: Props = $props();
</script>

<div class="tools">
	<button
		class="mode"
		type="button"
		aria-pressed={interactive}
		title="Turn dragging, zooming and rotating on or off. When off, the plan scrolls normally."
		onclick={ontoggle}
	>
		<Move size={16} strokeWidth={2.2} />
		Interactive: <span>{interactive ? 'On' : 'Off'}</span>
	</button>
	<button
		class="reset"
		class:at-home={atHome}
		type="button"
		aria-label="Reset zoom and position"
		title="Reset zoom (Home)"
		onclick={onreset}
	>
		<Maximize size={16} strokeWidth={2.2} />
		Reset zoom
	</button>
</div>

<style>
	.tools {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 2;
		display: flex;
		gap: 8px;
	}
	button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		border: 1px solid var(--rowline);
		border-radius: 999px;
		background: var(--card);
		color: var(--ink);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 2px 10px var(--shadow);
		transition: opacity 0.2s;
	}
	.mode[aria-pressed='true'] {
		background: var(--ink);
		color: var(--bg);
		border-color: var(--ink);
	}
	.reset.at-home {
		opacity: 0.55;
	}
	.reset:hover,
	.reset:focus-visible {
		opacity: 1;
	}
</style>
