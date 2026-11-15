<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import MapHeader from '$lib/components/map/MapHeader.svelte';
	import { onlineMap } from '$lib/stores/onlineUsers.svelte';
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { scale } from 'svelte/transition';
	import type { LayoutProps } from './$types';

	let { children, params }: LayoutProps = $props();
	const { building = 'Map', zone, section } = $derived(params);
	const heading = $derived([building, zone, section].filter(Boolean).join(' - '));

	const reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');
	const depth = (pathname: string | undefined) => pathname?.split('/').filter(Boolean).length ?? 0;

	// Going deeper zooms in, going back zooms out.
	let direction = $state<'in' | 'out'>('in');
	beforeNavigate(({ from, to }) => {
		direction = depth(to?.url.pathname) >= depth(from?.url.pathname) ? 'in' : 'out';
	});
</script>

<svelte:head><title>Libraone - Map</title></svelte:head>

<div class="map-root">
	<MapHeader {heading} online={onlineMap.totalOnline} />
	<div class="stage">
		{#key page.url.pathname}
			<div
				class="view"
				in:scale={{
					start: direction === 'in' ? 0.86 : 1.08,
					opacity: 0,
					duration: reducedMotion.current ? 0 : 320,
					easing: cubicOut
				}}
			>
				{@render children()}
			</div>
		{/key}
	</div>
</div>

<style>
	/* The map's own palette, tied to the app's theme tokens where they exist. */
	.map-root {
		--bg: var(--primary-bg);
		--ink: var(--text-primary);
		--muted: var(--text-muted);
		--lit: var(--success-dot);
		--plate: hsl(215, 35%, 12%);
		--card: hsl(215, 35%, 12%);
		--chip: var(--surface-bg);
		--rowline: var(--surface-border);
		--blk: hsl(212, 40%, 17%);
		--blk-on: hsl(210, 50%, 24%);
		--seat-off: hsl(212, 30%, 25%);
		--dot: hsl(212, 30%, 32%);
		--blue: hsl(210, 60%, 52%);
		--blue-dark: hsl(210, 60%, 36%);
		--green: hsl(180, 55%, 40%);
		--green-dark: hsl(180, 55%, 28%);
		--shadow: rgba(0, 0, 0, 0.5);

		flex: 1;
		min-height: 0;
		overflow: auto;
		width: 100%;
		max-width: 820px;
		margin: 0 auto;
		padding: 0 20px 24px;
	}
	.stage {
		margin-top: 10px;
	}
	.view {
		transform-origin: 50% 40%;
	}
</style>
