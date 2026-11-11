<script lang="ts">
	import { LAYOUTS } from '$lib/config/layouts.js';
	import { extent, floorInfo, sectionsOf } from '$lib/types/map/geometry.js';
	import { onlineInSection } from '$lib/types/map/occupancy.js';
	import type { Occupancy } from '$lib/types/map/occupancy.js';
	import type { Building, ZoneId } from '$lib/types/map/types.js';
	import { pillWidth } from '$lib/utils/ui/pill.js';
	import Pill from './Pill.svelte';

	interface Props {
		building: Building;
		zone: ZoneId;
		occupancy: Occupancy;
	}

	let { building, zone, occupancy }: Props = $props();

	const K = 30;
	const info = $derived(floorInfo(zone));
	const entry = $derived(LAYOUTS[zone].entry);
	const X = (x: number) => (x - info.minX) * K;
	const Y = (y: number) => (y - info.minY) * K;

	const sections = $derived(
		sectionsOf(zone).map((section) => {
			const online = onlineInSection(occupancy, zone, section);
			const label = online ? `${section.label} \u00b7 ${online}` : section.label;
			const x = X(section.box.x0);
			const y = Y(section.box.y0);
			const w = (section.box.x1 - section.box.x0) * K;
			const h = (section.box.y1 - section.box.y0) * K;
			return {
				section,
				online,
				label,
				x,
				y,
				w,
				h,
				pillX: Math.round(x + w / 2 - pillWidth(label) / 2),
				pillY: Math.round(y + h / 2),
				rows: section.blocks.map((b) => {
					const e = extent(b);
					return { r: b.r, x: X(e.x), y: Y(e.y), w: e.w * K, h: e.h * K };
				})
			};
		})
	);

	const cx = $derived(X(entry.x));
	const cy = $derived(Y(entry.y));
</script>

<svg
	class="drawing lay"
	viewBox="0 0 {info.W * K} {info.H * K}"
	role="group"
	aria-label="{building.name} floor layout"
>
	{#each sections as s (s.section.id)}
		<a
			href="/map/{building.id}/{zone}/{s.section.id}"
			aria-label="Rows {s.section.lo === s.section.hi
				? s.section.lo
				: `${s.section.lo} to ${s.section.hi}`}, {s.online} online"
		>
			<rect
				class="edge"
				x={s.x}
				y={s.y}
				width={s.w}
				height={s.h}
				rx={K * 0.5}
				fill="var(--{s.online ? 'blk-on' : 'blk'})"
			/>
			{#each s.rows as row (row.r)}
				<rect
					x={row.x}
					y={row.y}
					width={row.w}
					height={row.h}
					rx={K * 0.3}
					fill="var(--plate)"
					opacity="0.8"
				/>
			{/each}
			<Pill x={s.pillX} cy={s.pillY} label={s.label} count={s.online} />
		</a>
	{/each}

	{#if entry.dir === 'right'}
		<text x={cx - 20} y={cy + 4} text-anchor="middle">Entry / exit</text>
		<path d="M{cx + 24} {cy}h18m-6-6l6 6-6 6" />
	{:else}
		<text x={cx} y={cy - 4} text-anchor="middle">Entry / exit</text>
		<path d="M{cx} {cy + 5}v16m-6-6l6 6 6-6" />
	{/if}
</svg>
<p class="hint">Tap a section to see its seats; the number shows who is online there.</p>

<style>
	.lay {
		max-width: 560px;
		max-height: min(72vh, 760px);
		max-height: min(72dvh, 760px);
	}
	a {
		cursor: pointer;
		outline: none;
	}
	@media (hover: hover) {
		a {
			transition: transform 0.22s cubic-bezier(0.2, 0.7, 0.2, 1);
		}
		a:hover {
			transform: translateY(-5px);
		}
	}
	.edge {
		stroke: transparent;
		stroke-width: 4;
	}
	a:hover .edge,
	a:focus-visible .edge {
		stroke: var(--lit);
	}
	text {
		font-size: 13px;
		fill: var(--muted);
	}
	path {
		fill: none;
		stroke: var(--muted);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
