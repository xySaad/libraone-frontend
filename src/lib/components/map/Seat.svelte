<script lang="ts">
	import type { Occupant } from '$lib/types/map/occupancy.js';
	import Avatar from './Avatar.svelte';

	interface Props {
		x: number;
		y: number;
		occupant?: Occupant;
		selected?: boolean;
		onpick?: () => void;
	}

	let { x, y, occupant, selected = false, onpick }: Props = $props();
</script>

{#if occupant}
	<button
		class="seat on"
		class:sel={selected}
		style:--x={x}
		style:--y={y}
		title={occupant.login}
		aria-label="{occupant.login}, row {occupant.row}, seat {occupant.seat}"
		aria-pressed={selected}
		onclick={onpick}
		ondblclick={(e) => e.stopPropagation()}
	>
		<Avatar user={occupant} />
	</button>
{:else}
	<span class="seat off" style:--x={x} style:--y={y} aria-hidden="true"></span>
{/if}

<style>
	.seat {
		position: absolute;
		left: calc(var(--x) * var(--u));
		top: calc(var(--y) * var(--u));
		width: calc(var(--u) * 0.88);
		height: calc(var(--u) * 0.88);
		transform: translate(-50%, -50%) rotate(calc(var(--rot) * -1));
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: none;
		color: inherit;
		font-size: max(9px, calc(var(--u) * 0.3));
		border-radius: 50%;
	}
	.off {
		background: var(--seat-off);
	}
	button {
		cursor: pointer;
	}
	.on :global(.av) {
		box-shadow: 0 0 0 2px var(--lit);
	}
	.on.sel :global(.av) {
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 5px var(--ink);
	}
</style>
