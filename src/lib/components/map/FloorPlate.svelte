<script lang="ts">
	import { resolve } from '$app/paths';
	import { DIRECTIONS, DOOR_TURN } from '$lib/config/map/layout';
	import type { Building, Floor } from '$lib/types/map.svelte';
	import { extent, seatPos } from '$lib/utils/ui/geometry';
	import { ArrowDown } from '@lucide/svelte';

	interface Props {
		building: Building;
		floor: Floor;
		level: number;
	}

	let { building, floor, level }: Props = $props();
	const { zone, layout } = $derived(floor);

	const label = $derived(`${building.name}, ${zone.id.toLowerCase()}, ${zone.totalOnline} online`);
</script>

<a
	class="plate"
	class:top={level === 1}
	href={resolve(`/map/${building.id}/${zone.id}`)}
	aria-label={label}
>
	<div class="floor">
		{#each DIRECTIONS as face (face)}
			{#each layout.blocks[face] ?? [] as block (block.r)}
				{@const e = extent(face, block)}
				{@const seats = zone.rows['R' + block.r]?.seats ?? []}
				<div
					class="row"
					class:lit={seats.length > 0}
					style:--x={e.x}
					style:--y={e.y}
					style:--w={e.w}
					style:--h={e.h}
				></div>
				{#each seats as seat (seat.id)}
					{@const [x, y] = seatPos(face, block, Number(seat.id))}
					<span class="seat" style:--x={x} style:--y={y}></span>
				{/each}
			{/each}
		{/each}
		<span
			class="door"
			style:--x={layout.entry.x}
			style:--y={layout.entry.y}
			style:rotate="{DOOR_TURN[layout.entry.dir]}deg"
		>
			<ArrowDown />
		</span>
		<span class="badge" class:zero={zone.totalOnline === 0}>{zone.totalOnline}</span>
	</div>
</a>

<style>
	/* the floors share one grid cell and are lifted apart along Z by the scene around them */
	.plate {
		grid-area: 1 / 1;
		display: block;
		cursor: pointer;
		outline: none;
		pointer-events: auto; /* the scene around the floors ignores pointer events */
		transform-style: preserve-3d;
		transform: translateZ(calc(var(--lift) * -1));
	}
	.plate.top {
		transform: translateZ(var(--lift));
	}

	/* --tone, --pad, --w and --h come from the scene: every floor shares the building's plate */
	.floor {
		position: relative;
		width: calc(var(--u) * var(--w));
		height: calc(var(--u) * var(--h));
		background: var(--plate);
		box-shadow: inset 0 0 0 max(2px, calc(var(--u) * 0.25)) var(--tone);
		outline: none; /* the app's base styles draw an outline on every element */
		transform-style: preserve-3d;
		transition: transform 0.22s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	@media (hover: hover) {
		.plate:hover .floor,
		.plate:focus-visible .floor {
			transform: translateZ(calc(var(--u) * 0.8));
		}
	}
	.plate:hover .floor,
	.plate:focus-visible .floor {
		box-shadow: inset 0 0 0 max(4px, calc(var(--u) * 0.5)) var(--lit);
	}

	/* the two edges of the slab that face the viewer */
	.floor::before,
	.floor::after {
		content: '';
		position: absolute;
		background: var(--tone-dark);
	}
	.floor::before {
		top: 100%;
		left: 0;
		right: 0;
		height: var(--thick);
		transform-origin: top;
		transform: rotateX(-90deg);
	}
	.floor::after {
		top: 0;
		bottom: 0;
		left: 100%;
		width: var(--thick);
		transform-origin: left;
		transform: rotateY(90deg);
		background: color-mix(in srgb, var(--tone-dark) 82%, var(--bg));
	}

	.row,
	.seat,
	.door {
		position: absolute;
		left: calc(var(--u) * (var(--x) + var(--pad)));
		top: calc(var(--u) * (var(--y) + var(--pad)));
	}
	.seat,
	.door {
		translate: -50% -50%; /* --x, --y are their centre */
	}

	.row {
		width: calc(var(--u) * var(--w));
		height: calc(var(--u) * var(--h));
		background-color: var(--blk);
		/* one dim seat per seat-sized cell */
		background-image: radial-gradient(
			circle,
			var(--dot) calc(var(--u) * 0.275),
			transparent calc(var(--u) * 0.275 + 0.5px)
		);
		background-size: var(--u) var(--u);
	}
	.row.lit {
		background-color: var(--blk-on);
	}
	.seat {
		width: calc(var(--u) * 0.9);
		height: calc(var(--u) * 0.9);
		border-radius: 50%;
		background: var(--lit);
		box-shadow: 0 0 calc(var(--u) * 0.8) var(--lit);
	}
	@media (prefers-reduced-motion: no-preference) {
		.seat {
			animation: glow 3.4s ease-in-out infinite;
		}
	}
	@keyframes glow {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.68;
		}
	}

	.door {
		display: grid;
		place-items: center;
		color: var(--muted);
		pointer-events: none;
	}
	.door :global(svg) {
		width: calc(var(--u) * 1.2);
		height: calc(var(--u) * 1.2);
	}

	/* stands upright at the plate's right corner: the turns undo the scene's tilt */
	.badge {
		position: absolute;
		top: 0;
		left: 100%;
		margin-left: calc(var(--u) * 0.8);
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		padding: 0.3em 0.75em;
		border-radius: 999px;
		background: var(--ink);
		color: var(--bg);
		font-size: calc(var(--u) * 2.2);
		font-weight: 650;
		line-height: 1;
		white-space: nowrap;
		transform-origin: 0 50%;
		transform: rotateZ(-45deg) rotateX(-60deg) translateY(-50%);
	}
	.badge::before {
		content: '';
		width: 0.5em;
		height: 0.5em;
		border-radius: 50%;
		background: var(--lit);
	}
	.badge.zero {
		background: var(--bg);
		color: var(--muted);
		box-shadow: inset 0 0 0 1.5px var(--muted);
	}
	.badge.zero::before {
		background: var(--muted);
	}
</style>
