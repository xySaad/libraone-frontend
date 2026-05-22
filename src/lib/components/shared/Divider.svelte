<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children?: Snippet } = $props();
</script>

<div>
	{@render children?.()}
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;

		&::before,
		&::after {
			content: '';
			position: relative;
			min-width: 30%;
			height: 1px;
			background: linear-gradient(
				90deg,
				transparent,
				hsla(215, 40%, 70%, 0.12) 30%,
				hsla(215, 40%, 70%, 0.12) 70%,
				transparent
			);
		}
	}
</style>
