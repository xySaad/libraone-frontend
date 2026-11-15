<script lang="ts">
	import { DIRECTIONS, DOOR_TURN, PLAN_PAD } from '$lib/config/map/layout';
	import { UNIT } from '$lib/map/camera/math';
	import type { Floor } from '$lib/types/map.svelte';
	import { extent, labelPos, seatPos } from '$lib/utils/ui/geometry';
	import { ArrowDown } from '@lucide/svelte';
	import Seat from './Seat.svelte';

	interface Props {
		floor: Floor;
		/** Login of the occupant whose card is open. */
		selected: string | null;
		onpick: (login: string) => void;
	}

	let { floor, selected, onpick }: Props = $props();
	const { zone, layout } = $derived(floor);
</script>

<div
	class="canvas"
	style:--u="{UNIT}px"
	style:--right={layout.right}
	style:--bottom={layout.bottom}
	style:--pad={PLAN_PAD}
>
	<!-- everything is placed in the layout's own seat units, which start one margin in -->
	<div class="origin">
		{#each DIRECTIONS as face (face)}
			{#each layout.blocks[face] ?? [] as block (block.r)}
				{@const e = extent(face, block)}
				{@const [lx, ly] = labelPos(face, block)}
				{@const seats = zone.rows['R' + block.r]?.seats ?? []}
				{@const lit = seats.length > 0}
				<div
					class="blk"
					class:lit
					style:--x={e.x}
					style:--y={e.y}
					style:--w={e.w}
					style:--h={e.h}
				></div>
				<span class="rl" class:lit style:--x={lx} style:--y={ly}>R{block.r}</span>
				<!-- seat ids are seat numbers; ones outside the row's 2n seats have nowhere to go -->
				{#each { length: 2 * block.n }, i (i)}
					{@const [x, y] = seatPos(face, block, i + 1)}
					{@const occupant = seats.find((s) => Number(s.id) === i + 1)}
					<Seat
						{x}
						{y}
						{occupant}
						selected={selected === occupant?.login}
						onpick={() => occupant && onpick(occupant.login)}
					/>
				{/each}
			{/each}
		{/each}

		<span
			class="door"
			class:side={layout.entry.dir === 'right'}
			style:--x={layout.entry.x}
			style:--y={layout.entry.y}
		>
			<span class="label">Entry / exit</span>
			<span class="arrow" style:rotate="{DOOR_TURN[layout.entry.dir]}deg"><ArrowDown /></span>
		</span>
	</div>
</div>

<style>
	/* --rot is set by the camera and counter-rotates labels and avatars so they stay upright */
	.canvas {
		position: absolute;
		left: 0;
		top: 0;
		transform-origin: 0 0;
		width: calc(var(--u) * (var(--right) + 2 * var(--pad)));
		height: calc(var(--u) * (var(--bottom) + 2 * var(--pad)));
	}
	.origin {
		position: absolute;
		left: calc(var(--u) * var(--pad));
		top: calc(var(--u) * var(--pad));
	}

	.blk,
	.rl,
	.door {
		position: absolute;
		left: calc(var(--u) * var(--x));
		top: calc(var(--u) * var(--y));
	}
	.rl,
	.door {
		translate: -50% -50%; /* --x, --y are their centre */
		white-space: nowrap;
		pointer-events: none;
	}

	.blk {
		box-sizing: content-box;
		margin: calc(var(--u) * -0.1);
		padding: calc(var(--u) * 0.1);
		width: calc(var(--u) * var(--w));
		height: calc(var(--u) * var(--h));
		border-radius: calc(var(--u) * 0.45);
		background: var(--blk);
	}
	.blk.lit {
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--lit) 75%, transparent);
	}

	.rl {
		rotate: calc(var(--rot) * -1);
		font-size: max(11px, calc(var(--u) * 0.44));
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}
	.rl.lit {
		color: var(--ink);
		font-weight: 700;
	}

	.door {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(var(--u) * 0.2);
		color: var(--muted);
		font-size: max(10px, calc(var(--u) * 0.34));
	}
	.door.side {
		flex-direction: row;
	}
	.label {
		display: inline-block;
		rotate: calc(var(--rot) * -1);
	}
	.arrow {
		display: grid;
	}
	.arrow :global(svg) {
		width: calc(var(--u) * 0.6);
		height: calc(var(--u) * 0.6);
		margin: 0;
	}
</style>
