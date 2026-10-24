<script lang="ts">
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
