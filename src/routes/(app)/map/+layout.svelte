<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import MapHeader from '$lib/components/map/MapHeader.svelte';
	import NotFoundState from '$lib/components/profile/NotFoundState.svelte';
	import Notice from '$lib/components/ui/Notice.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { resolveView, summarize } from '$lib/map/domain/view';
	import { occupancyStore } from '$lib/map/stores/occupancy.svelte';
	import { onlineUsers } from '$lib/stores/onlineUsers.svelte';
	import { untrack } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { MediaQuery } from 'svelte/reactivity';
	import { scale } from 'svelte/transition';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const view = $derived(resolveView(page.params));
	const summary = $derived(view && summarize(view, occupancyStore.occupancy));

	// Fetch when the map opens, and again whenever the seats change over the websocket.
	// Navigation never waits for this: the map shows a spinner until the first response.
	const seatsSignature = $derived(
		Object.values(onlineUsers)
			.map((seat) => `${seat.login}:${seat.zone}:${seat.row}:${seat.id}`)
			.sort()
			.join()
	);
	$effect(() => {
		void seatsSignature;
		untrack(() => void occupancyStore.refresh());
	});

	const reducedMotion = new MediaQuery('prefers-reduced-motion: reduce');
	const depth = (pathname: string | undefined) => pathname?.split('/').filter(Boolean).length ?? 0;

	// Going deeper zooms in, going back zooms out.
	let direction = $state<'in' | 'out'>('in');
	beforeNavigate(({ from, to }) => {
		direction = depth(to?.url.pathname) >= depth(from?.url.pathname) ? 'in' : 'out';
	});
</script>

<svelte:head><title>{summary ? `${summary.heading} · Map` : 'Map'}</title></svelte:head>

<svelte:window
	onkeydown={(e) => {
		// `back` is already resolved by `summarize`
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		if (e.key === 'Escape' && summary?.back) void goto(summary.back);
	}}
/>

<div class="map-root">
	<MapHeader
		heading={summary?.heading ?? 'Map'}
		online={occupancyStore.ready ? summary?.online : undefined}
		back={summary ? summary.back : resolve('/map')}
	/>
	<div class="stage">
		{#if !view}
			<NotFoundState
				icon="🗺️"
				title="Nothing here"
				detail="This building, floor or section doesn't exist."
			/>
		{:else if occupancyStore.ready}
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
		{:else if occupancyStore.failed}
			<Notice type="warning" title="Couldn't load who is online">
				<button class="retry" onclick={() => occupancyStore.refresh()}>Try again</button>
			</Notice>
		{:else}
			<div class="loading"><Spinner size="32px" /></div>
		{/if}
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
		--a: hsl(210, 60%, 52%);
		--a-dark: hsl(210, 60%, 36%);
		--b: hsl(180, 55%, 40%);
		--b-dark: hsl(180, 55%, 28%);
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
	.loading {
		display: grid;
		place-items: center;
		min-height: 40vh;
	}
	.retry {
		margin-top: 8px;
		padding: 6px 14px;
		border-radius: 999px;
		border: 1px solid var(--warning-border);
		color: var(--warning);
		font-weight: 600;
	}
</style>
