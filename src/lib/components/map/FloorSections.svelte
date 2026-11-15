<script lang="ts">
	import { resolve } from '$app/paths';
	import { DIRECTIONS, DOOR_TURN } from '$lib/config/map/layout';
	import type { Floor } from '$lib/types/map.svelte';
	import { extent, spanOf } from '$lib/utils/ui/geometry';
	import { ArrowDown } from '@lucide/svelte';
	import MapHint from './MapHint.svelte';

	interface Props {
		floor: Floor;
		building: string;
	}

	let { building, floor }: Props = $props();
	const { zone, layout } = $derived(floor);
</script>

<div class="view">
	<div
		class="floor"
		role="group"
		aria-label="Floor layout"
		style:--right={layout.right}
		style:--bottom={layout.bottom}
	>
		<!-- every side of the room that has rows is one section -->
		{#each DIRECTIONS as face (face)}
			{@const blocks = layout.blocks[face] ?? []}
			{#if blocks.length}
				{@const s = spanOf(face, blocks)}
				{@const single = s.lo === s.hi}
				{@const online = blocks.reduce((n, b) => n + (zone.rows['R' + b.r]?.seats.length ?? 0), 0)}
				{@const range = single ? `R${s.lo}` : `R${s.lo}-R${s.hi}`}
				<a
					class="section"
					class:lit={online > 0}
					href={resolve(`/map/${building}/${zone.id}/${face}`)}
					aria-label="Rows {single ? s.lo : `${s.lo} to ${s.hi}`}, {online} online"
				>
					<span class="card" style:--x={s.x} style:--y={s.y} style:--w={s.w} style:--h={s.h}>
						<span class="badge" class:zero={online === 0}>
							{online ? `${range} · ${online}` : range}
						</span>
					</span>
					{#each blocks as block (block.r)}
						{@const e = extent(face, block)}
						<span class="row" style:--x={e.x} style:--y={e.y} style:--w={e.w} style:--h={e.h}
						></span>
					{/each}
				</a>
			{/if}
		{/each}
		<span
			class="door"
			class:side={layout.entry.dir === 'right'}
			style:--x={layout.entry.x}
			style:--y={layout.entry.y}
		>
			Entry / exit
			<span class="arrow" style:rotate="{DOOR_TURN[layout.entry.dir]}deg"><ArrowDown /></span>
		</span>
	</div>
</div>
<MapHint>Tap a section to see its seats; the number shows who is online there.</MapHint>

<style>
	.view {
		container-type: inline-size;
		max-width: 560px;
		margin: 0 auto;
	}

	/* --pad is the empty plate around the rows; it leaves room for the entry door.
	   --u is one seat: as wide as the view allows, and short enough to fit the screen. */
	.floor {
		--pad: 1;
		--u: min(
			calc(100cqw / (var(--right) + 2 * var(--pad))),
			calc(min(72dvh, 760px) / (var(--bottom) + 2 * var(--pad)))
		);
		position: relative;
		width: calc(var(--u) * (var(--right) + 2 * var(--pad)));
		height: calc(var(--u) * (var(--bottom) + 2 * var(--pad)));
		margin: 0 auto;
	}

	/* the section covers the plate so it can lift as one; only its card and rows take taps */
	.section {
		position: absolute;
		inset: 0;
		outline: none;
		pointer-events: none;
	}
	@media (hover: hover) {
		.section {
			transition: translate 0.22s cubic-bezier(0.2, 0.7, 0.2, 1);
		}
		.section:hover {
			translate: 0 calc(var(--u) * -0.17);
		}
	}

	.card,
	.row {
		position: absolute;
		left: calc(var(--u) * (var(--x) + var(--pad)));
		top: calc(var(--u) * (var(--y) + var(--pad)));
		width: calc(var(--u) * var(--w));
		height: calc(var(--u) * var(--h));
		pointer-events: auto;
	}

	.card {
		box-sizing: content-box;
		margin: calc(var(--u) * -0.25);
		padding: calc(var(--u) * 0.25);
		display: grid;
		place-items: center;
		border-radius: calc(var(--u) * 0.5);
		background: var(--blk);
		outline: none; /* the app's base styles draw an outline on every element */
	}
	.lit .card {
		background: var(--blk-on);
	}
	.section:hover .card,
	.section:focus-visible .card {
		box-shadow: 0 0 0 calc(var(--u) * 0.13) var(--lit);
	}

	.row {
		border-radius: calc(var(--u) * 0.3);
		background: var(--plate);
		opacity: 0.8;
	}

	.badge {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		padding: 0.3em 0.75em;
		border-radius: 999px;
		background: var(--ink);
		color: var(--bg);
		font-size: calc(var(--u) * 0.67);
		font-weight: 650;
		line-height: 1;
		white-space: nowrap;
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

	/* --x, --y are the centre of the door's label and arrow */
	.door {
		position: absolute;
		left: calc(var(--u) * (var(--x) + var(--pad)));
		top: calc(var(--u) * (var(--y) + var(--pad)));
		translate: -50% -50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: calc(var(--u) * 0.2);
		color: var(--muted);
		font-size: calc(var(--u) * 0.43);
		white-space: nowrap;
		pointer-events: none;
	}
	.door.side {
		flex-direction: row;
	}
	.arrow {
		display: grid;
	}
	.arrow :global(svg) {
		width: calc(var(--u) * 0.75);
		height: calc(var(--u) * 0.75);
	}
</style>
