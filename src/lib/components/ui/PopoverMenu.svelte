<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		Icon: Snippet;
	} & Record<string, Snippet>;

	const { Icon, ...children }: Props = $props();
	const menuId = Date.now().toString();
</script>

<section>
	<button popovertarget={menuId} style="anchor-name: --trigger">
		{@render Icon()}
	</button>
	<div
		class="menu"
		id={menuId}
		popover="auto"
		style="position-anchor: --trigger; position-area: bottom left;"
	>
		<div class="flex">
			{#each Object.entries(children) as [key, child] (key)}
				{@render child()}
			{/each}
		</div>
	</div>
</section>

<style>
	.menu {
		background: var(--secondary);
		border-radius: var(--card-radius);
		padding: 15px;
		.flex {
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 5px;
		}
	}
</style>
