<script lang="ts">
	import { PHOTO } from '$lib/config/map/buildings';
	import type { Building } from '$lib/types/map.svelte';
	import BuildingComponent from './Building.svelte';
	import MapHint from './MapHint.svelte';

	interface Props {
		buildings: Building[];
	}
	let { buildings }: Props = $props();
</script>

<svg
	class="photo"
	viewBox="0 0 {PHOTO.width} {PHOTO.height}"
	role="group"
	aria-label="Aerial view of the campus"
>
	<defs>
		<clipPath id="photo-clip"><rect width={PHOTO.width} height={PHOTO.height} rx="22" /></clipPath>
	</defs>
	<image href={PHOTO.src} width={PHOTO.width} height={PHOTO.height} clip-path="url(#photo-clip)" />

	{#each buildings as building (building.id)}
		<BuildingComponent {building} />
	{/each}
</svg>
<MapHint>Tap a building to look inside.</MapHint>

<style>
	.photo {
		display: block;
		width: 100%;
		height: auto;
		max-width: 760px;
		margin: 0 auto;
	}
</style>
