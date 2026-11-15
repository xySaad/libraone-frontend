<script lang="ts">
	import { pillWidth } from '$lib/utils/ui/geometry';

	interface Props {
		cx: number;
		cy: number;
		label: string;
		count: number;
	}

	let { cx, cy, label, count }: Props = $props();

	const w = $derived(pillWidth(label));
	const x = $derived(Math.round(cx - w / 2));
</script>

<g class="pill" class:zero={count === 0}>
	<rect {x} y={cy - 15} width={w} height="30" rx="15" />
	<circle cx={x + 18} {cy} r="5" />
	<text x={x + 31} y={cy + 7}>{label}</text>
</g>

<style>
	rect {
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
	.zero circle,
	.zero text {
		fill: var(--muted);
	}
</style>
