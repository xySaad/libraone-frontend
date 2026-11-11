<script lang="ts">
	import { floorName } from '$lib/config/campus.js';
	import { LAYOUTS } from '$lib/config/layouts.js';
	import { extent, floorInfo, seatPos } from '$lib/types/map/geometry.js';
	import { ISO, iso, polygon } from '$lib/types/map/iso.js';
	import type { Footprint } from '$lib/types/map/iso.js';
	import { onlineInZone, placedOf } from '$lib/types/map/occupancy.js';
	import type { Occupancy } from '$lib/types/map/occupancy.js';
	import type { Building, Point, ZoneId } from '$lib/types/map/types.js';
	import Pill from './Pill.svelte';

	interface Props {
		building: Building;
		zone: ZoneId;
		/** 0 = ground floor (drawn lower), 1 = top floor. */
		level: 0 | 1;
		footprint: Footprint;
		occupancy: Occupancy;
	}

	let { building, zone, level, footprint: fp, occupancy }: Props = $props();

	const info = $derived(floorInfo(zone));
	const placed = $derived(placedOf(occupancy, zone));
	const online = $derived(onlineInZone(occupancy, zone));

	// seat units -> screen, centring this floor's desks in the shared footprint
	const project = $derived((x: number, y: number) =>
		iso(
			(x + (fp.Wb - info.solidW) / 2 - info.solidX) * fp.k,
			(y + (fp.Hb - info.solidH) / 2 - info.solidY) * fp.k
		)
	);

	const top = $derived(polygon([iso(0, 0), iso(fp.W, 0), iso(fp.W, fp.H), iso(0, fp.H)]));
	const lowered = (p: Point): Point => [p[0], p[1] + ISO.thickness];
	const left = $derived(
		polygon([iso(0, fp.H), iso(fp.W, fp.H), lowered(iso(fp.W, fp.H)), lowered(iso(0, fp.H))])
	);
	const right = $derived(
		polygon([iso(fp.W, 0), iso(fp.W, fp.H), lowered(iso(fp.W, fp.H)), lowered(iso(fp.W, 0))])
	);

	const rows = $derived(
		LAYOUTS[zone].blocks.map((block) => {
			const e = extent(block);
			return {
				block,
				occupied: placed.some((p) => p.block === block),
				points: polygon([
					project(e.x, e.y),
					project(e.x + e.w, e.y),
					project(e.x + e.w, e.y + e.h),
					project(e.x, e.y + e.h)
				])
			};
		})
	);

	const dots = $derived(
		LAYOUTS[zone].blocks
			.flatMap((block) =>
				Array.from({ length: 2 * block.n }, (_, i) => {
					const [x, y] = project(...seatPos(block, i + 1));
					return `M${x.toFixed(1)} ${y.toFixed(1)}h.01`;
				})
			)
			.join('')
	);

	const badge = $derived(iso(fp.W, 0));
	const label = $derived(
		`${building.name}, ${floorName(building, zone).toLowerCase()}, ${online} online`
	);
</script>

<g transform="translate({fp.originX.toFixed(1)},{level === 1 ? ISO.topY : ISO.bottomY})">
	<a href="/map/{building.id}/{zone}" aria-label={label}>
		<polygon points={left} fill="var(--{building.tone}-dark)" />
		<polygon points={right} fill="var(--{building.tone}-dark)" opacity="0.82" />
		<polygon
			class="edge"
			points={top}
			fill="var(--plate)"
			stroke="var(--{building.tone})"
			stroke-width="2"
			stroke-linejoin="round"
		/>
		{#each rows as row (row.block.r)}
			<polygon points={row.points} fill="var(--{row.occupied ? 'blk-on' : 'blk'})" />
		{/each}
		<path
			d={dots}
			stroke="var(--dot)"
			stroke-width={(fp.k * 0.55).toFixed(1)}
			stroke-linecap="round"
			fill="none"
		/>
		{#each placed as p (p.occupant.login)}
			{@const [cx, cy] = project(...p.at)}
			<circle class="lit" cx={cx.toFixed(1)} cy={cy.toFixed(1)} r="3.6" filter="url(#glow)" />
		{/each}
		<Pill x={badge[0] + 12} cy={badge[1]} label={String(online)} count={online} />
	</a>
</g>

<style>
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
	a:hover .edge,
	a:focus-visible .edge {
		stroke: var(--lit);
		stroke-width: 4;
	}
	.lit {
		fill: var(--lit);
	}
	@media (prefers-reduced-motion: no-preference) {
		.lit {
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
</style>
