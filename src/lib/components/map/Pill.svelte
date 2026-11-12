<script lang="ts">
	import { pillWidth } from '$lib/map/ui/pill';

	interface Props {
		/** Left edge of the badge. */
		x: number;
		/** Vertical centre of the badge. */
		cy: number;
		label: string;
		count: number;
		/** Draw a small tip pointing down at what the badge labels. */
		pointer?: boolean;
	}

	let { x, cy, label, count, pointer = false }: Props = $props();

	const w = $derived(pillWidth(label));
</script>

<g class="pill" class:zero={count === 0}>
	<rect {x} y={cy - 15} width={w} height="30" rx="15" />
	{#if pointer}
		<path d="M{x + w / 2 - 7} {cy + 14} L{x + w / 2 + 7} {cy + 14} L{x + w / 2} {cy + 22} Z" />
	{/if}
	<circle cx={x + 18} {cy} r="5" />
	<text x={x + 31} y={cy + 7}>{label}</text>
</g>

<style>
	rect,
	path {
		fill: var(--ink);
	}
	circle {
		fill: var(--lit);
	}
	text {
		fill: var(--bg);
		font-size: 20px;
		font-weight: 650;
		font-family: inherit;
	}
	.zero rect {
		fill: var(--bg);
		stroke: var(--muted);
		stroke-width: 1.5;
	}
	.zero path,
	.zero circle,
	.zero text {
		fill: var(--muted);
	}
</style>
