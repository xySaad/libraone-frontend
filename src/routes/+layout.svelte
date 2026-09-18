<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import '$lib/styles/animation.css';
	import '$lib/styles/embla.css';
	import '$lib/styles/scroll.css';
	import '$lib/styles/tooltip.css';
	import './layout.css';

	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
