<script lang="ts">
	import { ArrowDown } from '@lucide/svelte';
	import { LAYOUTS } from '$lib/map/config/buildings_layouts';
	import { extent, floorInfo, labelPos, seatPos } from '$lib/map/domain/geometry';
	import { placedOf } from '$lib/map/domain/occupancy';
	import type { Occupancy } from '$lib/map/domain/occupancy';
	import type { ZoneId } from '$lib/map/domain/types';
	import { UNIT } from '$lib/map/camera/math';
	import Seat from './Seat.svelte';

	interface Props {
		zone: ZoneId;
		occupancy: Occupancy;
		/** "row:seat" of the occupant whose card is open. */
		selected: string | null;
		onpick: (key: string) => void;
	}

	let { zone, occupancy, selected, onpick }: Props = $props();

	const info = $derived(floorInfo(zone));
	const layout = $derived(LAYOUTS[zone]);
	const placed = $derived(placedOf(occupancy, zone));
	const seated = $derived(
		new Map(placed.map((p) => [`${p.block.r}:${p.occupant.seat}`, p.occupant]))
	);

	// seat units on the plan, relative to the top-left of the drawable area
	const gx = (x: number) => x - info.minX;
	const gy = (y: number) => y - info.minY;

	const rows = $derived(
		layout.blocks.map((block) => {
			const e = extent(block);
			const [lx, ly] = labelPos(block);
			return {
				block,
				has: placed.some((p) => p.block === block),
				box: { x: gx(e.x - 0.1), y: gy(e.y - 0.1), w: e.w + 0.2, h: e.h + 0.2 },
				label: { x: gx(lx), y: gy(ly) },
				seats: Array.from({ length: 2 * block.n }, (_, i) => {
					const seat = i + 1;
					const [x, y] = seatPos(block, seat);
					return { seat, x: gx(x), y: gy(y), occupant: seated.get(`${block.r}:${seat}`) };
				})
			};
		})
	);
</script>

<div class="canvas" style:--u="{UNIT}px" style:--W={info.W} style:--H={info.H} data-w={info.W}>
	{#each rows as row (row.block.r)}
		<div
			class="blk"
			class:has={row.has}
			style:--x={row.box.x}
			style:--y={row.box.y}
			style:--w={row.box.w}
			style:--h={row.box.h}
		></div>
		<span class="rl" class:has={row.has} style:--x={row.label.x} style:--y={row.label.y}
			>R{row.block.r}</span
		>
		{#each row.seats as s (s.seat)}
			<Seat
				x={s.x}
				y={s.y}
				occupant={s.occupant}
				selected={selected === `${row.block.r}:${s.seat}`}
				onpick={() => onpick(`${row.block.r}:${s.seat}`)}
			/>
		{/each}
	{/each}

	<div
		class="door {layout.entry.dir}"
		style:--x={gx(layout.entry.x)}
		style:--y={gy(layout.entry.y)}
	>
		<span>Entry / exit</span>
		<ArrowDown />
	</div>
</div>

<style>
	/* --rot is set by the camera and counter-rotates labels and avatars so they stay upright */
	.canvas {
		position: absolute;
		left: 0;
		top: 0;
		transform-origin: 0 0;
		width: calc(var(--W) * var(--u));
		height: calc(var(--H) * var(--u));
	}
	.blk {
		position: absolute;
		left: calc(var(--x) * var(--u));
		top: calc(var(--y) * var(--u));
		width: calc(var(--w) * var(--u));
		height: calc(var(--h) * var(--u));
		border-radius: calc(var(--u) * 0.45);
		background: var(--blk);
	}
	.blk.has {
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--lit) 75%, transparent);
	}
	.rl {
		position: absolute;
		left: calc(var(--x) * var(--u));
		top: calc(var(--y) * var(--u));
		transform: translate(-50%, -50%) rotate(calc(var(--rot) * -1));
		font-size: max(11px, calc(var(--u) * 0.44));
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		pointer-events: none;
	}
	.rl.has {
		color: var(--ink);
		font-weight: 700;
	}
	.door {
		position: absolute;
		left: calc(var(--x) * var(--u));
		top: calc(var(--y) * var(--u));
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		gap: calc(var(--u) * 0.2);
		color: var(--muted);
		font-size: max(10px, calc(var(--u) * 0.34));
		white-space: nowrap;
		pointer-events: none;
	}
	.door.down {
		flex-direction: column;
	}
	.door span {
		display: inline-block;
		transform: rotate(calc(var(--rot) * -1));
	}
	.door :global(svg) {
		width: calc(var(--u) * 0.6);
		height: calc(var(--u) * 0.6);
		margin: 0;
	}
	.door.right :global(svg) {
		transform: rotate(-90deg);
	}
</style>
