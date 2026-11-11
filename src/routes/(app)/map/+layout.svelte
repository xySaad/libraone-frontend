<script lang="ts">
	import './map.css';
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import AppHeader from '$lib/components/map/AppHeader.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');
	const depth = (pathname: string | undefined) => pathname?.split('/').filter(Boolean).length ?? 0;

	// Going deeper zooms in, going back zooms out.
	let direction = $state<'in' | 'out'>('in');
	beforeNavigate(({ from, to }) => {
		direction = depth(to?.url.pathname) >= depth(from?.url.pathname) ? 'in' : 'out';
	});
</script>

<div class="map">
	<AppHeader
		heading={page.data.heading ?? ''}
		online={page.data.online ?? 0}
		back={page.data.back}
	/>
	<main class="stage">
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
	</main>
</div>

<style>
	.map {
		/* width: 100%; */
		margin: 0 auto;
		padding: 14px 16px 24px;
	}
	.stage {
		margin-top: 10px;
	}
	.view {
		transform-origin: 50% 40%;
	}
</style>
