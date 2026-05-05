<script>
	import { resolve } from '$app/paths';
	import Event from '$lib/assets/svg/event.svelte';
	import Gite from '$lib/assets/svg/gite.svelte';
</script>

<nav class="links">
	<a class="card" href={resolve('/events')}>
		<Event />
		<p>Events</p>
	</a>
	<a class="card" href={resolve('/map')}>
		<Gite />
		<p>Map</p>
	</a>
</nav>

<style>
	.links {
		display: flex;
		gap: 1.5rem;
		margin: auto;
	}

	.card {
		text-decoration: none;
		background: #1e293b;
		padding: 1.5rem 2rem;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: inherit;
		transition: 0.2s ease;
		min-width: 120px;
		justify-content: center;
	}

	.card:hover {
		background: #334155;
		transform: translateY(-4px);
	}

	.card p {
		margin: 0;
		font-size: 0.95rem;
	}
</style>
