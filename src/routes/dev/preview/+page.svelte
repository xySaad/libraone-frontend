<script lang="ts">
	import Wordmark from '$lib/components/shared/Wordmark.svelte';
	import type { Component } from 'svelte';

	const modules = import.meta.glob<{ default: Component }>('/src/lib/assets/svg/*.svelte', {
		eager: true
	});

	const icons = Object.entries(modules)
		.map(([path, mod]) => ({
			name: path.split('/').pop()?.replace('.svelte', '') ?? '',
			Component: mod.default
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
</script>

<section>
	<Wordmark>SVGs</Wordmark>
	<div class="grid">
		{#each icons as icon (icon.name)}
			<div class="cell">
				<icon.Component class="icon" />
				<span class="label">{icon.name}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	section {
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;

		.grid {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
			gap: 1rem;
			padding: 2rem;
		}

		.cell {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
			padding: 1rem;
			border: 1px solid #e5e7eb;
			border-radius: 0.5rem;
		}

		:global(svg) {
			width: 2rem;
			height: 2rem;
		}

		.label {
			font-size: 0.75rem;
			color: #6b7280;
		}
	}
</style>
